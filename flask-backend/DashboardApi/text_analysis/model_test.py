from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

# Specify the path where the model and tokenizer are saved
model_path = 'D:/AmritaUniversity/AmmachiLabs/CapacityBuildingPortal/flask-backend/DashboardApi/text_analysis/SDGFinal'

# Load the tokenizer and model
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForSequenceClassification.from_pretrained(model_path)

# Ensure the model is in evaluation mode
model.eval()

# Function to analyze a single text
def analyze_text(text):
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits

        # Check for NaN values in the logits
        if torch.isnan(logits).any():
            print("Warning: NaN values detected in the logits.")
            return

        predictions = torch.softmax(logits, dim=1)

        # Print the predictions
        for idx, score in enumerate(predictions[0]):
            print(f"SDG {idx + 1}: {score:.4f}")

        # Print the most likely SDG
        most_likely_sdg = torch.argmax(predictions, dim=1).item() + 1
        print(type(most_likely_sdg))
        print(f"The most likely SDG is: SDG {most_likely_sdg}")

# Text to classify
input_text = "Sustainable Development Goal 8 is about decent work and economic growth and is one of the 17 Sustainable Development Goals which were established by the United Nations General Assembly in 2015"

# Analyze the text
print(f"Analyzing text: {input_text}")
analyze_text(input_text)
