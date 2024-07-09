import openai
import os
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify
from PyPDF2 import PdfReader
import textract
import nltk
import regex as re
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification, AutoModelForTokenClassification, pipeline
import numpy as np
import string

# # Load environment variables from .env file
# load_dotenv()

# # Retrieve the OpenAI API key from environment variables
# api_key = os.getenv('OPENAI_API_KEY')

# # Initialize the OpenAI API client
# openai.api_key = api_key

# # Specify the path where the model and tokenizer are saved
# model_path = 'D:/AmritaUniversity/AmmachiLabs/CapacityBuildingPortal/flask-backend/DashboardApi/text_analysis/SDGFinal'

# # # Load the tokenizer and model
# tokenizer = AutoTokenizer.from_pretrained(model_path)
# model = AutoModelForSequenceClassification.from_pretrained(model_path)

# # Load the sentiment tokenizer and model
# sentiment_tokenizer = AutoTokenizer.from_pretrained("D:/AmritaUniversity/AmmachiLabs/CapacityBuildingPortal/flask-backend/DashboardApi/text_analysis/sentiment_model")
# sentiment_model = AutoModelForSequenceClassification.from_pretrained("D:/AmritaUniversity/AmmachiLabs/CapacityBuildingPortal/flask-backend/DashboardApi/text_analysis/sentiment_model")

# # # Ensure the model is in evaluation mode
# model.eval()

text_analysis_api = Blueprint('text_analysis_api', __name__)

# Route to upload file and get predicted SDG
@text_analysis_api.route('/upload_file', methods=['POST'])
def upload_file():
    file = request.files['file']  # Access the uploaded file

    if file.filename.endswith('.pdf'):
        # Extract text from PDF
        pdf_reader = PdfReader(file)
        text = ''
        for page in pdf_reader.pages:
            text += page.extract_text()
    elif file.filename.endswith('.txt'):
        # Extract text from plain text file
        text = file.read().decode('utf-8')
    else:
        # Extract text using textract for other file types (e.g., Word, PowerPoint)
        text = textract.process(file).decode('utf-8')

    return jsonify({'message': 'Text extracted successfully', 'text': text})

# Function to preprocess text
@text_analysis_api.route('/process_text', methods=['POST'])
def process_text():
    request_data = request.json
    if request_data and 'text' in request_data:
        text = request_data['text']

        # Remove trailing characters (\s\n) and convert to lowercase
        clean_sents = []  # Append clean sentences
        sent_tokens = nltk.sent_tokenize(str(text))
        for sent_token in sent_tokens:
            word_tokens = [str(word_token).strip().lower() for word_token in sent_token.split()]
            clean_sents.append(' '.join(word_tokens))
        joined = ' '.join(clean_sents).strip(' ')
        joined = re.sub(r'`', "", joined)
        joined = re.sub(r'"', "", joined)

        # Call the function to analyze text
        predictions_with_labels, important_words_with_weights = analyze_text(joined)
        predicted_sentiment = predict_sentiment(joined)

        return jsonify({
            'message': 'Text processed successfully',
            'text': joined,
            'predictions': predictions_with_labels,
            'important_words': important_words_with_weights,
            'sentiment': predicted_sentiment,
        })
    else:
        return jsonify({'error': 'Text not found in request'}), 400

def analyze_text(joined):
    model_name = "shyxm/SDGClassification16SDGs"
    subfolder = "corrected_model"

    # Load the tokenizer and model from the Hugging Face Hub with subfolder
    tokenizer = AutoTokenizer.from_pretrained(model_name, subfolder=subfolder)
    model = AutoModelForSequenceClassification.from_pretrained(model_name, subfolder=subfolder, output_attentions=True)

    # Ensure the model is in evaluation mode
    model.eval()
    inputs = tokenizer(joined, return_tensors="pt", padding=True, truncation=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        attentions = outputs.attentions  # This contains the attention weights

        # Check for NaN values in the logits
        if torch.isnan(logits).any():
            print("Warning: NaN values detected in the logits.")
            return []

        predictions = torch.softmax(logits, dim=1).squeeze().tolist()

        # Create a list of dictionaries with SDG labels and scores, adding 1 to the label
        predictions_with_labels = [{'label': idx + 1, 'score': score} for idx, score in enumerate(predictions)]

        # Extract attention weights from the last layer
        last_layer_attentions = attentions[-1]
        # Take the mean attention weights across all heads and sequences (dimension 1 and 2)
        mean_attentions = last_layer_attentions.mean(dim=1).mean(dim=1).squeeze()

        # Determine the number of tokens to consider
        num_tokens = mean_attentions.size(0)
        k = min(15, num_tokens)

        # Get the token indices with the highest attention weights
        important_tokens = mean_attentions.topk(k=k).indices

        # Convert token indices to words and filter out special tokens and punctuation
        tokens = tokenizer.convert_ids_to_tokens(inputs['input_ids'][0])
        important_words_with_weights = []
        for idx in important_tokens:
            token = tokens[idx]
            if token in tokenizer.all_special_tokens or token in string.punctuation:
                continue
            if token.startswith("##"):
                original_word_part = token[2:]
                for word in joined.split():
                    if original_word_part in word:
                        important_words_with_weights.append({'word': word, 'weight': mean_attentions[idx].item()})
                        break
            else:
                important_words_with_weights.append({'word': token, 'weight': mean_attentions[idx].item()})

        # Remove duplicates while preserving order
        seen = set()
        important_words_with_weights = [x for x in important_words_with_weights if not (x['word'] in seen or seen.add(x['word']))]
        print(f"Keywords with weights: {important_words_with_weights}")

    return predictions_with_labels, important_words_with_weights

# Define the function to predict sentiment
def predict_sentiment(joined):
    sentiment_analysis = pipeline("sentiment-analysis", model="siebert/sentiment-roberta-large-english")
    result = sentiment_analysis(joined)
    # Assuming 'POSITIVE' label is for positive sentiment and 'NEGATIVE' label is for negative sentiment
    predicted_sentiment = "positive" if result[0]['label'] == 'POSITIVE' else "negative"
    return predicted_sentiment

# def extract_keyphrases(text, model_name="ml6team/keyphrase-extraction-kbir-kpcrowd"):
#     tokenizer = AutoTokenizer.from_pretrained(model_name)
#     model = AutoModelForTokenClassification.from_pretrained(model_name)
#     nlp_pipeline = pipeline("ner", model=model, tokenizer=tokenizer, aggregation_strategy="simple")
#     results = nlp_pipeline(text)
#     keyphrases = np.unique([result['word'].strip() for result in results])
#     return keyphrases

def chatgpt(joined):
    """
    Classifies the given text into one of the 17 SDGs, extracts keywords, performs sentiment analysis,
    and provides scores for each SDG.
    """
    prompt = (
        f"The following text is related to one or more of the Sustainable Development Goals (SDGs). "
        f"Please classify it by providing the SDG number and a confidence score ranging from 0 to 1. "
        f"For example, if the text is most likely related to SDG 3, you might assign a score of 0.99. "
        f"For example, if there is also a slight chance it is related to SDG 4, you might give it a score of 0.44. "
        f"Additionally, please extract the keywords from the text and perform a sentiment analysis, "
        f"indicating whether the sentiment is positive, negative, or neutral.\n\n"
        f"Text: \"{joined}\"\n\n"
        f"Provide the results in the following format:\n"
        f"SDG: <SDG number>\nKeywords: <keywords>\nSentiment: <sentiment>\n\n"
        f"Scores:\n"
        f"SDG 1: <score>\nSDG 2: <score>\n...SDG 17: <score>"
    )

    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=300,
        temperature=0.7
    )

    response_text = response.choices[0].message.content.strip()
    lines = response_text.split("\n")

    # Extract SDG, Keywords, and Sentiment
    sdg = "N/A"
    keywords = "N/A"
    sentiment = "N/A"

    sdg_scores = {}
    parsing_scores = False
    for line in lines:
        if line.startswith("SDG:"):
            sdg = line.split(":")[1].strip()
        elif line.startswith("Keywords:"):
            keywords = line.split(":")[1].strip()
        elif line.startswith("Sentiment:"):
            sentiment = line.split(":")[1].strip()
        elif line.startswith("Scores:"):
            parsing_scores = True
        elif parsing_scores and line.startswith("SDG"):
            sdg_num, score = line.split(":")
            try:
                sdg_scores[sdg_num.strip()] = float(score.strip())
            except ValueError:
                print(f"Skipping invalid score line: {line}")

    # Find the most likely SDG if there are valid scores
    most_likely_sdg = max(sdg_scores, key=sdg_scores.get) if sdg_scores else "N/A"

    print(f"SDG: {sdg}")
    print(f"Keywords: {keywords}")
    print(f"Sentiment: {sentiment}")
    for sdg_num, score in sdg_scores.items():
        print(f"{sdg_num}: {score:.4f}")
    print(f"The most likely SDG is: {most_likely_sdg}")

    return sdg, keywords, sentiment, sdg_scores, most_likely_sdg

# Function to preprocess WhatsApp messages
@text_analysis_api.route('/whatsapp_text', methods=['POST'])
def whatsapp_text():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'File not found in request'}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        if not file.filename.endswith('.txt'):
            return jsonify({'error': 'Invalid file type. Only .txt files are allowed'}), 400

        text = file.read().decode('utf-8')

        # Regular expression to match the date, time, and name
        pattern = r'\[\d{1,2}/\d{1,2}/\d{2,4}, \d{1,2}:\d{2}:\d{2}\s?(?:AM|PM)?\] [^:]+: '

        # Split the chat text into individual messages
        messages = re.split(pattern, text)

        # Filter out any empty messages
        messages = [message.strip() for message in messages if message.strip()]

        processed_text = '\n'.join(messages)

        return jsonify({'message': 'Text processed successfully', 'text': processed_text})
    except Exception as e:
        print(f"Error processing text: {e}")
        return jsonify({'error': 'Internal server error'}), 500
