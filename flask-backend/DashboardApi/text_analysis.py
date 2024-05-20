from transformers import AutoTokenizer, AutoModelForSequenceClassification
from flask import Blueprint, request, jsonify
from PyPDF2 import PdfReader
import textract
import nltk
nltk.download('punkt')
from nltk.tokenize import sent_tokenize
import regex as re
import torch


# Load pre-trained model and tokenizer
tokenizer = AutoTokenizer.from_pretrained("sadickam/sdg-classification-bert")
# Load pre-trained model
model = AutoModelForSequenceClassification.from_pretrained("sadickam/sdg-classification-bert")

text_analysis_api = Blueprint('text_analysis_api', __name__)

# Route to upload file and get predicted SDG
@text_analysis_api.route('/upload_file', methods=['POST'])
def upload_file():
    file = request.files['file'] # Access the uploaded file

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
        text = textract.process(file)

    # # Preprocess text
    # preprocessed_text = process_text(text)

    # # Perform data analysis and get predicted SDG
    # predicted_sdg = data_analysis(text)

    # print(predicted_sdg)


    return jsonify({'message': 'Text extracted successfully', 'text': text})

# Function to preprocess text
@text_analysis_api.route('/process_text', methods=['POST'])
def process_text():
    """
    Function for preprocessing text
    """

    # Extract text from the request
    request_data = request.json
    if request_data and 'text' in request_data:
        text = request_data['text']
        print(text)

        # Remove trailing characters (\s\n) and convert to lowercase
        clean_sents = []  # Append clean con sentences
        sent_tokens = sent_tokenize(str(text))
        for sent_token in sent_tokens:
            word_tokens = [str(word_token).strip().lower() for word_token in sent_token.split()]
            clean_sents.append(' '.join(word_tokens))
        joined = ' '.join(clean_sents).strip(' ')
        joined = re.sub(r'`', "", joined)
        joined = re.sub(r'"', "", joined)

        # Call the function to analyse text
        sorted_preds = analyse_text(joined)
        print(sorted_preds)

        return jsonify({'message': 'Text processed successfully', 'text': joined, 'predictions': sorted_preds})
    else:
        return jsonify({'error': 'Text not found in request'}), 400

# Function to analyse text
def analyse_text(joined):
    """
    Function to analyse text
    """
    print(joined)
    # Tokenize the text
    inputs = tokenizer(joined, return_tensors="pt", padding=True, truncation=True)

    label_list = [
        'SDG1',
        'SDG2',
        'SDG3',
        'SDG4',
        'SDG5',
        'SDG6',
        'SDG7',
        'SDG8',
        'SDG9',
        'SDG10',
        'SDG11',
        'SDG12',
        'SDG13',
        'SDG14',
        'SDG15',
        'SDG16',
        'SDG17'
    ]

    # Perform SDG classification
    outputs = model(**inputs)

    # Obtain logits and predictions
    text_logits = outputs.logits
    predictions = torch.softmax(text_logits, dim=1).tolist()[0]
    predictions = [round(a, 3) for a in predictions]

    # Create dictionary with label as key and percentage as value
    pred_dict = dict(zip(label_list, predictions))

    # Sort 'pred_dict' by value and index the highest at [0]
    sorted_preds = sorted(pred_dict.items(), key=lambda x: x[1], reverse=True)
    
    return sorted_preds

# Function to preprocess whatsapp message
@text_analysis_api.route('/whatsapp_text', methods=['POST'])
def whatsapp_text():
    """
    Function for preprocessing WhatsApp text messages.
    """
    try:
        # Check if a file part is present in the request
        if 'file' not in request.files:
            return jsonify({'error': 'File not found in request'}), 400

        file = request.files['file']

        # Check if the file is a text file
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        if not file.filename.endswith('.txt'):
            return jsonify({'error': 'Invalid file type. Only .txt files are allowed'}), 400

        # Read the contents of the text file
        text = file.read().decode('utf-8')
        print(f"Received text: {text}")

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

