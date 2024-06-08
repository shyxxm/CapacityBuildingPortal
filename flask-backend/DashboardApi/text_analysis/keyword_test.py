import pandas as pd
import torch
from datasets import load_dataset
from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline
import numpy as np
from sklearn.metrics import precision_score, recall_score, f1_score
import matplotlib.pyplot as plt
import seaborn as sns

# Load keyword extraction test dataset
keyphrase_test_dataset = load_dataset("midas/inspec", split="validation", trust_remote_code=True)

# Load the custom models
keyphrase_model_name = "ml6team/keyphrase-extraction-distilbert-inspec"
keyphrase_tokenizer = AutoTokenizer.from_pretrained(keyphrase_model_name)
keyphrase_model = AutoModelForTokenClassification.from_pretrained(keyphrase_model_name)
keyphrase_pipeline = pipeline("ner", model=keyphrase_model, tokenizer=keyphrase_tokenizer, aggregation_strategy="simple")

# Function to preprocess and normalize keyphrases
def preprocess_keyphrases(tokens, tags):
    keyphrases = []
    current_phrase = []
    for token, tag in zip(tokens, tags):
        if tag == 'B':
            if current_phrase:
                keyphrases.append(' '.join(current_phrase))
                current_phrase = []
            current_phrase.append(token)
        elif tag == 'I':
            if current_phrase:
                current_phrase.append(token)
        elif tag == 'O' and current_phrase:
            keyphrases.append(' '.join(current_phrase))
            current_phrase = []
    if current_phrase:
        keyphrases.append(' '.join(current_phrase))
    return set(map(lambda x: x.lower().strip(), keyphrases))

# Function to extract keyphrases
def extract_keyphrases(text):
    results = keyphrase_pipeline(text)
    keyphrases = set([result['word'].strip().lower() for result in results])
    return keyphrases

# Normalize and calculate overlap metrics
def normalize_keyphrases(keyphrases):
    return set(map(lambda x: x.lower().strip(), keyphrases))

# Evaluate Keyphrase Extraction
true_keyphrases_all = []
predicted_keyphrases_all = []

print("Debugging: Comparing True and Predicted Keyphrases")
for i, example in enumerate(keyphrase_test_dataset):
    text = " ".join(example['document'])  # Join tokens to form the document text
    true_keyphrases = preprocess_keyphrases(example['document'], example['doc_bio_tags'])  # Extract true keyphrases
    predicted_keyphrases = extract_keyphrases(text)
    
    true_keyphrases_all.append(true_keyphrases)
    predicted_keyphrases_all.append(predicted_keyphrases)
    

# Flatten lists of sets for precision, recall, and F1-score calculation
true_keyphrases_flat = [item for sublist in true_keyphrases_all for item in sublist]
predicted_keyphrases_flat = [item for sublist in predicted_keyphrases_all for item in sublist]

print(f"Length of true keyphrases (flat): {len(true_keyphrases_flat)}")
print(f"Length of predicted keyphrases (flat): {len(predicted_keyphrases_flat)}")

# Calculate precision, recall, and F1-score for partial matches
def partial_match_score(true, pred):
    total_matches = 0
    for t in true:
        for p in pred:
            if t in p or p in t:
                total_matches += 1
                break
    return total_matches

true_matches = partial_match_score(true_keyphrases_flat, predicted_keyphrases_flat)
pred_matches = partial_match_score(predicted_keyphrases_flat, true_keyphrases_flat)

precision = true_matches / len(predicted_keyphrases_flat)
recall = true_matches / len(true_keyphrases_flat)
f1 = 2 * (precision * recall) / (precision + recall)

print(f"Keyphrase Extraction - Precision: {precision:.4f}, Recall: {recall:.4f}, F1-Score: {f1:.4f}")

# Enhanced Plotting
sns.set(style="whitegrid")
plt.figure(figsize=(10, 8))  # Increased the height of the plot
data = pd.DataFrame({
    'Metric': ['Precision', 'Recall', 'F1-Score'],
    'Score': [precision, recall, f1]
})
ax = sns.barplot(x='Metric', y='Score', data=data, palette="viridis")
plt.ylim(0, 1)
plt.title('Keyphrase Extraction Performance', pad=20)
plt.ylabel('Score')
plt.xlabel('Metrics')

# Adding the text labels
for p in ax.patches:
    ax.annotate(format(p.get_height(), '.4f'), 
                (p.get_x() + p.get_width() / 2., p.get_height()), 
                ha = 'center', va = 'center', 
                xytext = (0, 10), 
                textcoords = 'offset points')

plt.show()
