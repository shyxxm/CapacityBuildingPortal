import pandas as pd
import openai
import os
from dotenv import load_dotenv
from openai import OpenAI
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score
import matplotlib.pyplot as plt

# Load environment variables from .env file
load_dotenv()

# Retrieve the OpenAI API key from environment variables
api_key = os.getenv('OPENAI_API_KEY')

# Initialize the OpenAI API client
openai.api_key = api_key

client = OpenAI()

def classify_sdg(text):
    prompt = (
        f"The following text is related to one or more of the Sustainable Development Goals (SDGs). "
        f"Please classify it by providing the SDG number. "
        f"Text: \"{text}\"\n\n"
        f"Provide the result in the following format:\n"
        f"SDG: <SDG number>"
    )

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
    )

    response_text = response.choices[0].message.content.strip()

    sdg = "N/A"
    for line in response_text.split("\n"):
        if line.startswith("SDG:"):
            sdg = line.split(":")[1].strip()
            break

    return sdg

def evaluate_model(texts, labels):
    predictions = []

    for text in texts:
        sdg = classify_sdg(text)
        # print(f"Text: {text}")
        # print(f"Predicted SDG: {sdg}")
        if sdg.isdigit():
            predictions.append(int(sdg))
        else:
            predictions.append(-1)  # Use -1 or some other placeholder for invalid predictions

    valid_indices = [i for i, pred in enumerate(predictions) if pred != -1]
    valid_labels = [labels[i] for i in valid_indices]
    valid_predictions = [predictions[i] for i in valid_indices]

    if valid_labels and valid_predictions:
        accuracy = accuracy_score(valid_labels, valid_predictions)
        f1 = f1_score(valid_labels, valid_predictions, average='weighted')
        precision = precision_score(valid_labels, valid_predictions, average='weighted')
        recall = recall_score(valid_labels, valid_predictions, average='weighted')

        return accuracy, f1, precision, recall
    else:
        return None, None, None, None

if __name__ == "__main__":
    data_path = "D:/AmritaUniversity/AmmachiLabs/CapacityBuildingPortal/flask-backend/DashboardApi/text_analysis/datasets/eval_dataset.csv"
    df = pd.read_csv(data_path)

    texts = df['text'].tolist()
    labels = df['sdg'].tolist()

    results = []

    for _ in range(10):
        accuracy, f1, precision, recall = evaluate_model(texts, labels)
        if accuracy is not None:
            results.append((accuracy, f1, precision, recall))

    if results:
        # Calculate the average scores
        avg_accuracy = sum([r[0] for r in results]) / len(results)
        avg_f1 = sum([r[1] for r in results]) / len(results)
        avg_precision = sum([r[2] for r in results]) / len(results)
        avg_recall = sum([r[3] for r in results]) / len(results)

        # Prepare data for plotting
        accuracies = [r[0] for r in results]
        f1_scores = [r[1] for r in results]
        precisions = [r[2] for r in results]
        recalls = [r[3] for r in results]

        # Plot the results
        plt.figure(figsize=(12, 10))

        plt.subplot(2, 2, 1)
        plt.plot(range(1, 11), accuracies, marker='o')
        plt.axhline(y=avg_accuracy, color='r', linestyle='--')
        plt.title('Accuracy')
        plt.xlabel('Run')
        plt.ylabel('Accuracy')
        plt.text(5.5, min(accuracies) - 0.05, f"Average Accuracy: {avg_accuracy:.4f}", ha='center')

        plt.subplot(2, 2, 2)
        plt.plot(range(1, 11), f1_scores, marker='o')
        plt.axhline(y=avg_f1, color='r', linestyle='--')
        plt.title('F1 Score')
        plt.xlabel('Run')
        plt.ylabel('F1 Score')
        plt.text(5.5, min(f1_scores) - 0.05, f"Average F1 Score: {avg_f1:.4f}", ha='center')

        plt.subplot(2, 2, 3)
        plt.plot(range(1, 11), precisions, marker='o')
        plt.axhline(y=avg_precision, color='r', linestyle='--')
        plt.title('Precision')
        plt.xlabel('Run')
        plt.ylabel('Precision')
        plt.text(5.5, min(precisions) - 0.05, f"Average Precision: {avg_precision:.4f}", ha='center')

        plt.subplot(2, 2, 4)
        plt.plot(range(1, 11), recalls, marker='o')
        plt.axhline(y=avg_recall, color='r', linestyle='--')
        plt.title('Recall')
        plt.xlabel('Run')
        plt.ylabel('Recall')
        plt.text(5.5, min(recalls) - 0.05, f"Average Recall: {avg_recall:.4f}", ha='center')

        plt.tight_layout(rect=[0, 0.1, 1, 1])
        plt.show()

        # Plot average scores in a bar graph with different shades of blue
        plt.figure(figsize=(8, 6))
        metrics = ['Accuracy', 'F1 Score', 'Precision', 'Recall']
        averages = [avg_accuracy, avg_f1, avg_precision, avg_recall]
        colors = ['#1f77b4', '#aec7e8', '#1f77b4', '#aec7e8']  # Different shades of blue
        plt.bar(metrics, averages, color=colors)
        plt.title('Average Scores Over 10 Runs')
        plt.ylabel('Score')
        plt.show()
