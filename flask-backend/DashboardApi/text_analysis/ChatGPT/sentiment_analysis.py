from transformers import pipeline

# Initialize the sentiment analysis pipeline
sentiment_analysis = pipeline("sentiment-analysis", model="siebert/sentiment-roberta-large-english")

def predict_sentiment(text):
    result = sentiment_analysis(text)
    predicted_sentiment = "positive" if result[0]['label'] == 'POSITIVE' else "negative"
    return predicted_sentiment

if __name__ == "__main__":
    # Example text for sentiment analysis
    input_text = "I love this!"

    # Analyze sentiment
    sentiment = predict_sentiment(input_text)
    print(f"The sentiment is: {sentiment}")
