import pandas as pd
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score
import matplotlib.pyplot as plt
import string
import time
import random

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

        # Check for NaN values in the logits
        if torch.isnan(logits).any():
            print("Warning: NaN values detected in the logits.")
            return []

        predictions = torch.softmax(logits, dim=1).squeeze().tolist()

        # Create a list of dictionaries with SDG labels and scores, adding 1 to the label
        predictions_with_labels = [{'label': idx + 1, 'score': score} for idx, score in enumerate(predictions)]

    return predictions_with_labels

def evaluate_model(texts, labels):
    """
    Evaluates the model on the provided texts and labels.
    """
    predictions = []

    for text in texts:
        predictions_with_labels = analyze_text(text)
        if predictions_with_labels:
            sdg_number = max(predictions_with_labels, key=lambda x: x['score'])['label']
            predictions.append(sdg_number)
        else:
            predictions.append(0)  # Assuming 0 is a non-existent SDG for invalid predictions

    accuracy = accuracy_score(labels, predictions)
    f1 = f1_score(labels, predictions, average='weighted', zero_division=0)
    precision = precision_score(labels, predictions, average='weighted', zero_division=0)
    recall = recall_score(labels, predictions, average='weighted', zero_division=0)

    return accuracy, f1, precision, recall

if __name__ == "__main__":
    # Load the eval dataset
    data_path = "D:/AmritaUniversity/AmmachiLabs/CapacityBuildingPortal/flask-backend/DashboardApi/text_analysis/datasets/eval_dataset.csv"
    df = pd.read_csv(data_path)

    # Extract the text and labels
    texts = df['text'].tolist()
    labels = df['sdg'].tolist()

    # Run evaluation 10 times and measure processing speed
    evaluation_results = []
    for i in range(10):
        start_time = time.time()
        accuracy, f1, precision, recall = evaluate_model(texts, labels)
        end_time = time.time()
        elapsed_time = end_time - start_time

        evaluation_results.append({
            "run": i + 1,
            "accuracy": accuracy,
            "f1_score": f1,
            "precision": precision,
            "recall": recall,
            "time_taken": elapsed_time
        })

    # Convert results to DataFrame
    results_df = pd.DataFrame(evaluation_results)

    # Plotting the results
    fig, axs = plt.subplots(3, 2, figsize=(12, 15))

    axs[0, 0].plot(results_df['run'], results_df['accuracy'], marker='o')
    axs[0, 0].axhline(y=results_df['accuracy'].mean(), color='r', linestyle='--')
    axs[0, 0].set_title('Accuracy')
    axs[0, 0].set_xlabel('Run')
    axs[0, 0].set_ylabel('Accuracy')
    axs[0, 0].text(0.5, -0.25, f'Average Accuracy: {results_df["accuracy"].mean():.4f}', 
                   ha='center', va='center', transform=axs[0, 0].transAxes)

    axs[0, 1].plot(results_df['run'], results_df['f1_score'], marker='o')
    axs[0, 1].axhline(y=results_df['f1_score'].mean(), color='r', linestyle='--')
    axs[0, 1].set_title('F1 Score')
    axs[0, 1].set_xlabel('Run')
    axs[0, 1].set_ylabel('F1 Score')
    axs[0, 1].text(0.5, -0.25, f'Average F1 Score: {results_df["f1_score"].mean():.4f}', 
                   ha='center', va='center', transform=axs[0, 1].transAxes)

    axs[1, 0].plot(results_df['run'], results_df['precision'], marker='o')
    axs[1, 0].axhline(y=results_df['precision'].mean(), color='r', linestyle='--')
    axs[1, 0].set_title('Precision')
    axs[1, 0].set_xlabel('Run')
    axs[1, 0].set_ylabel('Precision')
    axs[1, 0].text(0.5, -0.25, f'Average Precision: {results_df["precision"].mean():.4f}', 
                   ha='center', va='center', transform=axs[1, 0].transAxes)

    axs[1, 1].plot(results_df['run'], results_df['recall'], marker='o')
    axs[1, 1].axhline(y=results_df['recall'].mean(), color='r', linestyle='--')
    axs[1, 1].set_title('Recall')
    axs[1, 1].set_xlabel('Run')
    axs[1, 1].set_ylabel('Recall')
    axs[1, 1].text(0.5, -0.25, f'Average Recall: {results_df["recall"].mean():.4f}', 
                   ha='center', va='center', transform=axs[1, 1].transAxes)

    axs[2, 0].plot(results_df['run'], results_df['time_taken'], marker='o')
    axs[2, 0].axhline(y=results_df['time_taken'].mean(), color='r', linestyle='--')
    axs[2, 0].set_title('Processing Time')
    axs[2, 0].set_xlabel('Run')
    axs[2, 0].set_ylabel('Time Taken (s)')
    axs[2, 0].text(0.5, -0.25, f'Average Time: {results_df["time_taken"].mean():.2f} s', 
                   ha='center', va='center', transform=axs[2, 0].transAxes)

    fig.delaxes(axs[2, 1])  # Remove the empty subplot in the bottom right corner

    plt.tight_layout()
    plt.show()
