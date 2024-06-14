import google.generativeai as genai

# Replace with your actual API key (obtain from Google AI Studio)
API_KEY = "AIzaSyAIBrIs9VTOikEvJel5ZKElU6zDGnro6Jc"

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
        f"Perform sentiment analysis on the following text, indicating whether the sentiment is positive, negative, or neutral.\n\n"
        f"Text: \"{text}\"\n\n"
        f"Sentiment:"
    )

    # Generate text using the model and prompt
    response = model.generate_content(prompt)

    sentiment = ""
    if response._result.candidates:
        content = response._result.candidates[0].content.parts[0].text
        lines = content.split("\n")
        
        for line in lines:
            if line.startswith("Sentiment:"):
                sentiment = line.split(":")[-1].strip().lower()

    return sentiment

if __name__ == "__main__":
    # Example text for sentiment analysis
    text_to_analyze = "I love this!"

    # Analyze sentiment
    sentiment = analyze_sentiment(text_to_analyze)
    print(f"The sentiment is: {sentiment}")
