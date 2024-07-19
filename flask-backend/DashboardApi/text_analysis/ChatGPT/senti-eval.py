import pandas as pd
import numpy as np
import time
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score
import matplotlib.pyplot as plt
import openai
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Retrieve the OpenAI API key from environment variables
api_key = os.getenv('OPENAI_API_KEY')

# Initialize the OpenAI API client
client = openai

def analyze_sentiment(text):
    """
    Performs sentiment analysis on the provided text.
    """
    prompt = (
        f"Perform sentiment analysis on the following text, indicating whether the sentiment is positive, negative, or neutral.\n\n"
        f"Text: \"{text}\"\n\n"
        f"Sentiment:"
    )

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=300,
        temperature=0.7
    )

    response_text = response.choices[0].message.content.strip()

    # Directly use response_text as sentiment
    sentiment = response_text.lower()

    return sentiment

def run_evaluation(sentiment_df, runs=10):
    accuracy_list = []
    f1_list = []
    precision_list = []
    recall_list = []
    processing_times = []

    for run in range(runs):
        start_time = time.time()
        predicted_sentiments = sentiment_df['Text'].apply(analyze_sentiment)
        end_time = time.time()
        
        processing_time = end_time - start_time
        processing_times.append(processing_time)

        # Strip whitespaces from true labels
        true_sentiments = sentiment_df['Sentiment'].str.strip().str.lower()

        # Debugging: print predicted and true labels
        print(f"Predicted Sentiments (Run {run+1}):", predicted_sentiments.tolist())
        print(f"True Sentiments (Run {run+1}):", true_sentiments.tolist())
        
        accuracy = accuracy_score(true_sentiments, predicted_sentiments)
        f1 = f1_score(true_sentiments, predicted_sentiments, average='weighted', zero_division=1)
        precision = precision_score(true_sentiments, predicted_sentiments, average='weighted', zero_division=1)
        recall = recall_score(true_sentiments, predicted_sentiments, average='weighted', zero_division=1)

        accuracy_list.append(accuracy)
        f1_list.append(f1)
        precision_list.append(precision)
        recall_list.append(recall)

        print(f"Run {run+1}: Processing Time={processing_time:.2f}s, Accuracy={accuracy}, F1 Score={f1}, Precision={precision}, Recall={recall}")

    return accuracy_list, f1_list, precision_list, recall_list, processing_times

def plot_results(accuracy_list, f1_list, precision_list, recall_list):
    runs = list(range(1, len(accuracy_list) + 1))

    fig, axs = plt.subplots(2, 2, figsize=(12, 10))

    axs[0, 0].plot(runs, accuracy_list, marker='o')
    axs[0, 0].axhline(y=np.mean(accuracy_list), color='r', linestyle='--')
    axs[0, 0].set_title('Accuracy')
    axs[0, 0].set_xlabel('Run')
    axs[0, 0].set_ylabel('Accuracy')
    axs[0, 0].text(0.5, 0.5, f'Average Accuracy: {np.mean(accuracy_list):.4f}', transform=axs[0, 0].transAxes, ha='center')

    axs[0, 1].plot(runs, f1_list, marker='o')
    axs[0, 1].axhline(y=np.mean(f1_list), color='r', linestyle='--')
    axs[0, 1].set_title('F1 Score')
    axs[0, 1].set_xlabel('Run')
    axs[0, 1].set_ylabel('F1 Score')
    axs[0, 1].text(0.5, 0.5, f'Average F1 Score: {np.mean(f1_list):.4f}', transform=axs[0, 1].transAxes, ha='center')

    axs[1, 0].plot(runs, precision_list, marker='o')
    axs[1, 0].axhline(y=np.mean(precision_list), color='r', linestyle='--')
    axs[1, 0].set_title('Precision')
    axs[1, 0].set_xlabel('Run')
    axs[1, 0].set_ylabel('Precision')
    axs[1, 0].text(0.5, 0.5, f'Average Precision: {np.mean(precision_list):.4f}', transform=axs[1, 0].transAxes, ha='center')

    axs[1, 1].plot(runs, recall_list, marker='o')
    axs[1, 1].axhline(y=np.mean(recall_list), color='r', linestyle='--')
    axs[1, 1].set_title('Recall')
    axs[1, 1].set_xlabel('Run')
    axs[1, 1].set_ylabel('Recall')
    axs[1, 1].text(0.5, 0.5, f'Average Recall: {np.mean(recall_list):.4f}', transform=axs[1, 1].transAxes, ha='center')

    plt.tight_layout()
    plt.show()

# Load the dataset
data_path = "D:/AmritaUniversity/AmmachiLabs/CapacityBuildingPortal/flask-backend/DashboardApi/text_analysis/datasets/senti_eval.csv"
df = pd.read_csv(data_path)

# Run evaluation 10 times
accuracy_list, f1_list, precision_list, recall_list, processing_times = run_evaluation(df, runs=10)

# Plot the results
plot_results(accuracy_list, f1_list, precision_list, recall_list)

# Print processing times
for i, time in enumerate(processing_times, 1):
    print(f"Run {i} processing time: {time:.2f} seconds")
