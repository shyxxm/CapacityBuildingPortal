from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

# Specify the path where the model and tokenizer are saved
model_path = 'D:/AmritaUniversity/AmmachiLabs/CapacityBuildingPortal/flask-backend/DashboardApi/text_analysis/SDGFinal'

# Load the tokenizer
tokenizer = AutoTokenizer.from_pretrained(model_path)

# Load the model
model = AutoModelForSequenceClassification.from_pretrained(model_path)

# Ensure the model is in evaluation mode
model.eval()

# Function to analyze text
def analyze_text(text):
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits

        # Check for NaN values in the logits
        if torch.isnan(logits).any():
            print("Warning: NaN values detected in the logits.")
            print("Logits:", logits)
            print("Inputs:", inputs)
            return None

        predictions = torch.softmax(logits, dim=1)
        return predictions

# Example texts to classify
texts = [
    "Sustainable Development Goal 8 is about decent work and economic growth and is one of the 17 Sustainable Development Goals which were established by the United Nations General Assembly in 2015",
]

# Analyze multiple texts
for text in texts:
    print(f"Analyzing text: {text}")
    predictions = analyze_text(text)

    if predictions is not None:
        # Print the predictions
        for idx, score in enumerate(predictions[0]):
            print(f"SDG {idx + 1}: {score:.4f}")

        # Print the most likely SDG
        most_likely_sdg = torch.argmax(predictions, dim=1).item() + 1
        print(f"The most likely SDG is: SDG {most_likely_sdg}")
    else:
        print("Model output contained NaN values and could not be processed.")
    print("\n" + "-"*50 + "\n")

# # Check model configuration
# config = model.config
# print(f"Model configuration: {config}")

# Verify model weights
for name, param in model.named_parameters():
    if torch.isnan(param).any():
        print(f"NaN values detected in parameter: {name}")
    if torch.isinf(param).any():
        print(f"Infinite values detected in parameter: {name}")
