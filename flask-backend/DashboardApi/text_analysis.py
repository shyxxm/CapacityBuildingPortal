import openai
import os
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify
from PyPDF2 import PdfReader
import textract
import regex as re
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification, AutoModelForTokenClassification, pipeline
import numpy as np
import string
import nltk
from nltk.corpus import stopwords


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

    # Truncate the input text if it exceeds the maximum length
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

        # Convert token indices to words and filter out special tokens and punctuation
        tokens = tokenizer.convert_ids_to_tokens(inputs['input_ids'][0])
        important_words_with_weights = []

        for idx in range(len(tokens)):
            token = tokens[idx]
            if token in tokenizer.all_special_tokens or token in string.punctuation:
                continue
            weight = mean_attentions[idx].item()
            important_words_with_weights.append({'word': token, 'weight': weight})

        # Sort words by weight in descending order and take the top 30 to ensure variety
        important_words_with_weights.sort(key=lambda x: x['weight'], reverse=True)
        important_words_with_weights = important_words_with_weights[:30]

        # Debug print before processing
        print(f"Important words with weights (before processing): {important_words_with_weights}")

        # Combine subwords properly
        combined_words_with_weights = []
        current_word = ""
        current_weight = 0
        for word_info in important_words_with_weights:
            token_word = word_info['word']
            weight = word_info['weight']
            if token_word.startswith("##"):
                current_word += token_word[2:]
                current_weight += weight
            else:
                if current_word:
                    combined_words_with_weights.append({'word': current_word, 'weight': current_weight})
                current_word = token_word
                current_weight = weight
        if current_word:
            combined_words_with_weights.append({'word': current_word, 'weight': current_weight})

        # Match tokens back to the original words and clean them
        stop_words = set(stopwords.words('english'))
        matched_words_with_weights = []
        original_words = joined.split()
        for word_info in combined_words_with_weights:
            token_word = word_info['word']
            best_match = None
            best_match_weight = word_info['weight']
            for original_word in original_words:
                clean_original_word = original_word.strip(string.punctuation).lower()
                if token_word in clean_original_word:
                    best_match = original_word
                    break
            if best_match:
                clean_word = best_match.strip(string.punctuation + string.digits).lower()
                if clean_word and clean_word not in stop_words and clean_word not in string.punctuation and len(clean_word) > 1:
                    matched_words_with_weights.append({'word': clean_word, 'weight': best_match_weight})

        # Debug print after processing
        print(f"Matched words with weights (after processing): {matched_words_with_weights}")

        # Remove duplicates while preserving order
        seen = set()
        matched_words_with_weights = [x for x in matched_words_with_weights if not (x['word'] in seen or seen.add(x['word']))]

        # Ensure we have exactly 10 words, taking the top 10 highest weights
        matched_words_with_weights = sorted(matched_words_with_weights, key=lambda x: x['weight'], reverse=True)[:10]

        print(f"Keywords with weights: {matched_words_with_weights}")

    return predictions_with_labels, matched_words_with_weights

def predict_sentiment(joined):
    sentiment_analysis = pipeline("sentiment-analysis", model="siebert/sentiment-roberta-large-english")
    max_length = sentiment_analysis.tokenizer.model_max_length

    # Tokenize the input text
    tokens = sentiment_analysis.tokenizer.tokenize(joined)

    # Split the tokens into chunks of the model's max length
    chunks = [tokens[i:i + max_length] for i in range(0, len(tokens), max_length)]

    # Analyze sentiment for each chunk
    sentiments = []
    for chunk in chunks:
        chunk_text = sentiment_analysis.tokenizer.convert_tokens_to_string(chunk)
        result = sentiment_analysis(chunk_text)
        sentiments.append(result[0])

    # Determine overall sentiment based on majority vote
    positive_count = sum(1 for sentiment in sentiments if sentiment['label'] == 'POSITIVE')
    negative_count = len(sentiments) - positive_count

    predicted_sentiment = "positive" if positive_count > negative_count else "negative"
    
    return predicted_sentiment

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
