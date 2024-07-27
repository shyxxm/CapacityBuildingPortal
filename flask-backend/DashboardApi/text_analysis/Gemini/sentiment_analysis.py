import google.generativeai as genai

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
        f"Perform sentiment analysis on the following text, indicating whether the sentiment is positive or negative. No Neutral. On\n\n"
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

if __name__ == "__main__":
    # Example text for sentiment analysis
    text_to_analyze = "I love this!"

    # Analyze sentiment
    sentiment = analyze_sentiment(text_to_analyze)
    print(f"The sentiment is: {sentiment}")
