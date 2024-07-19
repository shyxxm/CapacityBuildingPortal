import pandas as pd
from sklearn.metrics import accuracy_score, f1_score, recall_score, precision_score
from transformers import pipeline
import matplotlib.pyplot as plt
import time

# Load the dataset
data_path = "D:/AmritaUniversity/AmmachiLabs/CapacityBuildingPortal/flask-backend/DashboardApi/text_analysis/datasets/senti_eval.csv"
df = pd.read_csv(data_path)

# Define the function to predict sentiment
def predict_sentiment(text):
    sentiment_analysis = pipeline("sentiment-analysis", model="siebert/sentiment-roberta-large-english")
    result = sentiment_analysis(text)
    # Assuming 'POSITIVE' label is for positive sentiment and 'NEGATIVE' label is for negative sentiment
    predicted_sentiment = "Positive" if result[0]['label'] == 'POSITIVE' else "Negative"
    return predicted_sentiment

# Initialize lists to store metrics for each run
accuracies = []
f1_scores = []
recalls = []
precisions = []

# Run the prediction and evaluation 10 times
for _ in range(10):
    start_time = time.time()
    df['Predicted_Sentiment'] = df['Text'].apply(predict_sentiment)
    end_time = time.time()
    
    # Convert sentiments to binary labels for evaluation
    df['Sentiment_Label'] = df['Sentiment'].apply(lambda x: 1 if x.strip().lower() == "positive" else 0)
    df['Predicted_Sentiment_Label'] = df['Predicted_Sentiment'].apply(lambda x: 1 if x.strip().lower() == "positive" else 0)
    
    # Calculate the metrics
    accuracy = accuracy_score(df['Sentiment_Label'], df['Predicted_Sentiment_Label'])
    f1 = f1_score(df['Sentiment_Label'], df['Predicted_Sentiment_Label'])
    recall = recall_score(df['Sentiment_Label'], df['Predicted_Sentiment_Label'])
    precision = precision_score(df['Sentiment_Label'], df['Predicted_Sentiment_Label'])
    
    # Append metrics to lists
    accuracies.append(accuracy)
    f1_scores.append(f1)
    recalls.append(recall)
    precisions.append(precision)

    # Print processing time for each run
    print(f"Processing time for run {_ + 1}: {end_time - start_time:.2f} seconds")

# Calculate average metrics
avg_accuracy = sum(accuracies) / len(accuracies)
avg_f1 = sum(f1_scores) / len(f1_scores)
avg_recall = sum(recalls) / len(recalls)
avg_precision = sum(precisions) / len(precisions)

# Plot the metrics
fig, axes = plt.subplots(2, 2, figsize=(15, 10))

axes[0, 0].plot(range(1, 11), accuracies, marker='o')
axes[0, 0].axhline(y=avg_accuracy, color='r', linestyle='--')
axes[0, 0].set_title('Accuracy')
axes[0, 0].set_xlabel('Run')
axes[0, 0].set_ylabel('Accuracy')
axes[0, 0].text(5, avg_accuracy + 0.01, f'Average Accuracy: {avg_accuracy:.4f}', ha='center')

axes[0, 1].plot(range(1, 11), f1_scores, marker='o')
axes[0, 1].axhline(y=avg_f1, color='r', linestyle='--')
axes[0, 1].set_title('F1 Score')
axes[0, 1].set_xlabel('Run')
axes[0, 1].set_ylabel('F1 Score')
axes[0, 1].text(5, avg_f1 + 0.01, f'Average F1 Score: {avg_f1:.4f}', ha='center')

axes[1, 0].plot(range(1, 11), precisions, marker='o')
axes[1, 0].axhline(y=avg_precision, color='r', linestyle='--')
axes[1, 0].set_title('Precision')
axes[1, 0].set_xlabel('Run')
axes[1, 0].set_ylabel('Precision')
axes[1, 0].text(5, avg_precision + 0.01, f'Average Precision: {avg_precision:.4f}', ha='center')

axes[1, 1].plot(range(1, 11), recalls, marker='o')
axes[1, 1].axhline(y=avg_recall, color='r', linestyle='--')
axes[1, 1].set_title('Recall')
axes[1, 1].set_xlabel('Run')
axes[1, 1].set_ylabel('Recall')
axes[1, 1].text(5, avg_recall + 0.01, f'Average Recall: {avg_recall:.4f}', ha='center')

plt.tight_layout()
plt.show()

# Print the average metrics
print(f"Average Accuracy: {avg_accuracy:.4f}")
print(f"Average F1 Score: {avg_f1:.4f}")
print(f"Average Recall: {avg_recall:.4f}")
print(f"Average Precision: {avg_precision:.4f}")
