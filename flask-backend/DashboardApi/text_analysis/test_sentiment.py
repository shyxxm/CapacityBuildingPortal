from transformers import AutoTokenizer, AutoModelForSequenceClassification

# Load the tokenizer and model
tokenizer = AutoTokenizer.from_pretrained("/Users/shyam/Documents/AmmachiLabs/CapstoneProject/CapacityBuildingPortal/flask-backend/DashboardApi/text_analysis/sentiment_model")
model = AutoModelForSequenceClassification.from_pretrained("/Users/shyam/Documents/AmmachiLabs/CapstoneProject/CapacityBuildingPortal/flask-backend/DashboardApi/text_analysis/sentiment_model")

# Define the function to predict sentiment
def predict_sentiment(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    outputs = model(**inputs)
    logits = outputs.logits
    predicted_class_id = logits.argmax().item()
    return "positive" if predicted_class_id == 1 else "negative"

# Test the function with sample texts
sample_text = "the training went extremely badly"
print(predict_sentiment(sample_text))

sample_text = "The training was badly organised"
print(predict_sentiment(sample_text))
