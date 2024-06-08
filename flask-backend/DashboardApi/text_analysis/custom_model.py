import pandas as pd
import numpy as np
from datasets import load_dataset
from transformers import AutoTokenizer, AutoModelForSequenceClassification, AutoModelForTokenClassification, pipeline
import torch
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
import matplotlib.pyplot as plt

# Load SDG test dataset
sdg_test_df = pd.read_csv('D:/AmritaUniversity/AmmachiLabs/CapacityBuildingPortal/flask-backend/DashboardApi/text_analysis/datasets/sdg_test_dataset.csv')

# Load sentiment analysis test dataset
sentiment_test_dataset = load_dataset("sst2", split="test")

# Load keyword extraction test dataset
keyphrase_test_dataset = load_dataset("midas/inspec", split="test", trust_remote_code=True)

# Load the custom models
model_path = 'D:/AmritaUniversity/AmmachiLabs/CapacityBuildingPortal/flask-backend/DashboardApi/text_analysis/SDGFinal'
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForSequenceClassification.from_pretrained(model_path)

sentiment_tokenizer = AutoTokenizer.from_pretrained("D:/AmritaUniversity/AmmachiLabs/CapacityBuildingPortal/flask-backend/DashboardApi/text_analysis/sentiment_model")
sentiment_model = AutoModelForSequenceClassification.from_pretrained("D:/AmritaUniversity/AmmachiLabs/CapacityBuildingPortal/flask-backend/DashboardApi/text_analysis/sentiment_model")

keyphrase_model_name = "ml6team/keyphrase-extraction-distilbert-inspec"
keyphrase_tokenizer = AutoTokenizer.from_pretrained(keyphrase_model_name)
keyphrase_model = AutoModelForTokenClassification.from_pretrained(keyphrase_model_name)
keyphrase_pipeline = pipeline("ner", model=keyphrase_model, tokenizer=keyphrase_tokenizer, aggregation_strategy="simple")

# Function to analyze text (SDG classification)
def analyze_text(text):
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits

        predictions = torch.softmax(logits, dim=1)[0]
        sdg_scores = {f"SDG {idx + 1}": score.item() for idx, score in enumerate(predictions)}
        sorted_sdg_scores = dict(sorted(sdg_scores.items(), key=lambda item: item[1], reverse=True))
    
    return sorted_sdg_scores

# Function to predict sentiment
def predict_sentiment(text):
    inputs = sentiment_tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    outputs = sentiment_model(**inputs)
    logits = outputs.logits
    predicted_class_id = logits.argmax().item()
    predicted_sentiment = "positive" if predicted_class_id == 1 else "negative"
    return predicted_sentiment

# Function to extract keyphrases
def extract_keyphrases(text):
    results = keyphrase_pipeline(text)
    keyphrases = np.unique([result['word'].strip() for result in results])
    return keyphrases

# Evaluate SDG Classification
sdg_predictions = []
sdg_labels = sdg_test_df['sdg'].values - 1  # Adjust labels to range from 0 to 16

for text in sdg_test_df['text']:
    sorted_sdg_scores = analyze_text(text)
    sdg_predictions.append(int(max(sorted_sdg_scores, key=sorted_sdg_scores.get).split()[1]) - 1)

sdg_accuracy = accuracy_score(sdg_labels, sdg_predictions)
sdg_precision, sdg_recall, sdg_f1, _ = precision_recall_fscore_support(sdg_labels, sdg_predictions, average='weighted')

print(f"SDG Classification - Accuracy: {sdg_accuracy}, Precision: {sdg_precision}, Recall: {sdg_recall}, F1-Score: {sdg_f1}")

# Evaluate Sentiment Analysis
sentiment_predictions = []
sentiment_labels = sentiment_test_dataset['label']

for text in sentiment_test_dataset['sentence']:
    sentiment_predictions.append(1 if predict_sentiment(text) == 'positive' else 0)

sentiment_accuracy = accuracy_score(sentiment_labels, sentiment_predictions)
sentiment_precision, sentiment_recall, sentiment_f1, _ = precision_recall_fscore_support(sentiment_labels, sentiment_predictions, average='weighted')

print(f"Sentiment Analysis - Accuracy: {sentiment_accuracy}, Precision: {sentiment_precision}, Recall: {sentiment_recall}, F1-Score: {sentiment_f1}")

# Evaluate Keyphrase Extraction
keyphrase_correct = 0
keyphrase_total = len(keyphrase_test_dataset)

for example in keyphrase_test_dataset:
    text = ' '.join(example['document'])
    true_keyphrases = example['doc_bio_tags']
    predicted_keyphrases = extract_keyphrases(text)
    keyphrase_correct += len(set(true_keyphrases) & set(predicted_keyphrases))

keyphrase_accuracy = keyphrase_correct / keyphrase_total
print(f"Keyphrase Extraction - Accuracy: {keyphrase_accuracy}")

# Plot SDG Classification Results
sdg_metrics = ['Accuracy', 'Precision', 'Recall', 'F1-Score']
sdg_values = [sdg_accuracy, sdg_precision, sdg_recall, sdg_f1]

plt.figure(figsize=(10, 6))
plt.bar(sdg_metrics, sdg_values, color='blue')
plt.title('SDG Classification Performance')
plt.ylim(0, 1)
plt.ylabel('Score')
plt.show()

# Plot Sentiment Analysis Results
sentiment_metrics = ['Accuracy', 'Precision', 'Recall', 'F1-Score']
sentiment_values = [sentiment_accuracy, sentiment_precision, sentiment_recall, sentiment_f1]

plt.figure(figsize=(10, 6))
plt.bar(sentiment_metrics, sentiment_values, color='green')
plt.title('Sentiment Analysis Performance')
plt.ylim(0, 1)
plt.ylabel('Score')
plt.show()

# Plot Keyphrase Extraction Results
keyphrase_metrics = ['Accuracy']
keyphrase_values = [keyphrase_accuracy]

plt.figure(figsize=(10, 6))
plt.bar(keyphrase_metrics, keyphrase_values, color='red')
plt.title('Keyphrase Extraction Performance')
plt.ylim(0, 1)
plt.ylabel('Score')
plt.show()
