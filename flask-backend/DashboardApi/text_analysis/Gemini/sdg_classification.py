import pandas as pd
import google.generativeai as genai
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score
import time
import logging
import random
import google.api_core.exceptions  # Add this import

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

    # Run evaluation once and measure processing speed
    start_time = time.time()
    accuracy, f1, precision, recall = evaluate_model(texts, labels)
    end_time = time.time()
    elapsed_time = end_time - start_time

    # Print evaluation results
    print(f"Evaluation Results:")
    print(f"  Accuracy: {accuracy:.4f}")
    print(f"  F1 Score: {f1:.4f}")
    print(f"  Precision: {precision:.4f}")
    print(f"  Recall: {recall:.4f}")
    print(f"  Time Taken: {elapsed_time:.4f} seconds")
