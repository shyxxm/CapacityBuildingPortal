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

    # Print the response for debugging
    print("Response Text:", response_text)

    # Directly use response_text as sentiment
    sentiment = response_text.lower()

    return sentiment

if __name__ == "__main__":
    # Example text to analyze
    input_text = (
        "I love this product! It's absolutely amazing."
    )

    # Analyze the sentiment
    sentiment = analyze_sentiment(input_text)
    print(f"Sentiment: {sentiment}")
