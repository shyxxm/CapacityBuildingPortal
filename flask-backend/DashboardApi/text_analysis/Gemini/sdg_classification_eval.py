import pandas as pd
import google.generativeai as genai
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score
import time
import logging
import random
import matplotlib.pyplot as plt
import google.api_core.exceptions  # Import necessary exceptions

# Replace with your actual API key (obtain from Google AI Studio)
API_KEY = "AIzaSyAIBrIs9VTOikEvJel5ZKElU6zDGnro6Jc"

# Configure the API key
genai.configure(api_key=API_KEY)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def classify_sdg(text, retries=5):
    """
    Classifies the given text into one of the 17 SDGs and provides scores for each SDG.
    Retries the API call up to 'retries' times in case of quota exhaustion.
    """
    model = genai.GenerativeModel('gemini-1.0-pro')
    prompt = (
        f"The following text is related to one or more of the Sustainable Development Goals (SDGs). "
        f"Please classify it by providing the SDG number. "
        f"Text: \"{text}\"\n\n"
        f"Provide the results in the following format:\n"
        f"SDG: <SDG number>\n\n"
    )

    for attempt in range(retries):
        try:
            response = model.generate_content(prompt)
            classification = {"sdg_number": None}

            if response._result.candidates:
                content = response._result.candidates[0].content.parts[0].text
                lines = content.split("\n")

                for line in lines:
                    if line.startswith("SDG:"):
                        sdg_str = line.split(":")[-1].strip()
                        sdg_number_str = ''.join(filter(str.isdigit, sdg_str))  # Extract digits only
                        if sdg_number_str:
                            classification["sdg_number"] = int(sdg_number_str)

            return classification
        except google.api_core.exceptions.ResourceExhausted as e:
            logger.warning(f"Resource exhausted, retrying... (attempt {attempt + 1})")
            time.sleep((2 ** attempt) + random.uniform(0, 1))  # Exponential backoff with jitter

    raise Exception("Max retries exceeded")

def evaluate_model(texts, labels):
    """
    Evaluates the Gemini-based SDG classifier on the provided texts and labels.
    """
    predictions = []

    for text in texts:
        sdg_number = classify_sdg(text)["sdg_number"]
        predictions.append(sdg_number if sdg_number is not None else 0)  # Assuming 0 is a non-existent SDG for invalid predictions

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
    fig, axs = plt.subplots(2, 2, figsize=(12, 8))

    axs[0, 0].plot(results_df['run'], results_df['accuracy'], marker='o')
    axs[0, 0].axhline(y=results_df['accuracy'].mean(), color='r', linestyle='--')
    axs[0, 0].set_title('Accuracy')
    axs[0, 0].set_xlabel('Run')
    axs[0, 0].set_ylabel('Accuracy')
    axs[0, 0].text(0.5, 0.02, f'Average Accuracy: {results_df["accuracy"].mean():.4f}', 
                   ha='center', va='center', transform=axs[0, 0].transAxes)

    axs[0, 1].plot(results_df['run'], results_df['f1_score'], marker='o')
    axs[0, 1].axhline(y=results_df['f1_score'].mean(), color='r', linestyle='--')
    axs[0, 1].set_title('F1 Score')
    axs[0, 1].set_xlabel('Run')
    axs[0, 1].set_ylabel('F1 Score')
    axs[0, 1].text(0.5, 0.02, f'Average F1 Score: {results_df["f1_score"].mean():.4f}', 
                   ha='center', va='center', transform=axs[0, 1].transAxes)

    axs[1, 0].plot(results_df['run'], results_df['precision'], marker='o')
    axs[1, 0].axhline(y=results_df['precision'].mean(), color='r', linestyle='--')
    axs[1, 0].set_title('Precision')
    axs[1, 0].set_xlabel('Run')
    axs[1, 0].set_ylabel('Precision')
    axs[1, 0].text(0.5, 0.02, f'Average Precision: {results_df["precision"].mean():.4f}', 
                   ha='center', va='center', transform=axs[1, 0].transAxes)

    axs[1, 1].plot(results_df['run'], results_df['recall'], marker='o')
    axs[1, 1].axhline(y=results_df['recall'].mean(), color='r', linestyle='--')
    axs[1, 1].set_title('Recall')
    axs[1, 1].set_xlabel('Run')
    axs[1, 1].set_ylabel('Recall')
    axs[1, 1].text(0.5, 0.02, f'Average Recall: {results_df["recall"].mean():.4f}', 
                   ha='center', va='center', transform=axs[1, 1].transAxes)

    plt.tight_layout()
    plt.show()
