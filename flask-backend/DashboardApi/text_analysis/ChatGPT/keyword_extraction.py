import openai
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Retrieve the OpenAI API key from environment variables
api_key = os.getenv('OPENAI_API_KEY')

# Initialize the OpenAI API client
openai.api_key = api_key

def extract_keywords(text):
    """
    Extracts keywords from the given text.
    """
    prompt = (
        f"Extract the main keywords from the following text:\n\n"
        f"Text: \"{text}\"\n\n"
        f"Keywords:"
    )

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=50,
        temperature=0.7
    )

    response_text = response.choices[0].message.content.strip()
    keywords = response_text.split("\n")[0]

    return keywords

if __name__ == "__main__":
    # Example text for keyword extraction
    input_text = (
        "From a gender perspective, Paulgaard points out that the labour markets of the fishing villages..."
    )

    # Extract keywords
    keywords = extract_keywords(input_text)
    print(f"Extracted keywords: {keywords}")
