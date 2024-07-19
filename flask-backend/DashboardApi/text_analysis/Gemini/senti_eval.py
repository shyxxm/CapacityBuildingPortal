import google.generativeai as genai
import pandas as pd
import numpy as np
import time
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score
import matplotlib.pyplot as plt

# Replace with your actual API key (obtain from Google AI Studio)
API_KEY = "AIzaSyBtqE6_DzKqiXsuzvpWE1SSmoFwO24j5_4"

def analyze_sentiment(text):
    """
    Performs sentiment analysis on the provided text.
    """
    # Configure the API key
    genai.configure(api_key=API_KEY)

    # Load the Gemini model (change the model name if needed)
    model = genai.GenerativeModel('gemini-1.0-pro')

    # Define the prompt template
    prompt = (
        f"Perform sentiment analysis on the following text, indicating whether the sentiment is positive or negative. No Neutral.\n\n"
        f"Text: \"{text}\"\n\n"
        f"Sentiment:"
    )

    # Generate text using the model and prompt
    response = model.generate_content(prompt)

    # Check if response has candidates
    sentiment = ""
    if response.candidates:
        content = response.candidates[0].content

        # Extract the text from the content parts
        if content.parts:
            sentiment = content.parts[0].text.strip().lower()
        else:
            print("No parts found in content.")
    else:
        print("No candidates found in the response.")

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

        # Strip whitespaces from true labels and convert to lower case
        true_sentiments = sentiment_df['Sentiment'].str.strip().str.lower()

        # Debugging: print predicted and true labels
        print(f"Predicted Sentiments (Run {run+1}):", predicted_sentiments.tolist())
        print(f"True Sentiments (Run {run+1}):", true_sentiments.tolist())
        
        # Calculate metrics
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

    gap = -0.2  # Increase the gap between x-axis and average text

    axs[0, 0].plot(runs, accuracy_list, marker='o')
    axs[0, 0].axhline(y=np.mean(accuracy_list), color='r', linestyle='--')
    axs[0, 0].set_title('Accuracy')
    axs[0, 0].set_xlabel('Run')
    axs[0, 0].set_ylabel('Accuracy')
    axs[0, 0].text(0.5, gap, f'Average Accuracy: {np.mean(accuracy_list):.4f}', transform=axs[0, 0].transAxes, ha='center', va='top')

    axs[0, 1].plot(runs, f1_list, marker='o')
    axs[0, 1].axhline(y=np.mean(f1_list), color='r', linestyle='--')
    axs[0, 1].set_title('F1 Score')
    axs[0, 1].set_xlabel('Run')
    axs[0, 1].set_ylabel('F1 Score')
    axs[0, 1].text(0.5, gap, f'Average F1 Score: {np.mean(f1_list):.4f}', transform=axs[0, 1].transAxes, ha='center', va='top')

    axs[1, 0].plot(runs, precision_list, marker='o')
    axs[1, 0].axhline(y=np.mean(precision_list), color='r', linestyle='--')
    axs[1, 0].set_title('Precision')
    axs[1, 0].set_xlabel('Run')
    axs[1, 0].set_ylabel('Precision')
    axs[1, 0].text(0.5, gap, f'Average Precision: {np.mean(precision_list):.4f}', transform=axs[1, 0].transAxes, ha='center', va='top')

    axs[1, 1].plot(runs, recall_list, marker='o')
    axs[1, 1].axhline(y=np.mean(recall_list), color='r', linestyle='--')
    axs[1, 1].set_title('Recall')
    axs[1, 1].set_xlabel('Run')
    axs[1, 1].set_ylabel('Recall')
    axs[1, 1].text(0.5, gap, f'Average Recall: {np.mean(recall_list):.4f}', transform=axs[1, 1].transAxes, ha='center', va='top')

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
