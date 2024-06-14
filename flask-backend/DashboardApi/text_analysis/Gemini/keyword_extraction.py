import google.generativeai as genai

# Replace with your actual API key (obtain from Google AI Studio)
API_KEY = "AIzaSyAIBrIs9VTOikEvJel5ZKElU6zDGnro6Jc"

def extract_keywords(text):
    """
    Extracts keywords from the provided text.
    """
    # Configure the API key
    genai.configure(api_key=API_KEY)

    # Load the Gemini model (change the model name if needed)
    model = genai.GenerativeModel('gemini-1.0-pro')

    # Define the prompt template
    prompt = (
        f"Extract the main keywords from the following text:\n\n"
        f"Text: \"{text}\"\n\n"
        f"Keywords:"
    )

    # Generate text using the model and prompt
    response = model.generate_content(prompt)

    keywords = []
    if response._result.candidates:
        content = response._result.candidates[0].content.parts[0].text
        lines = content.split("\n")
        
        for line in lines:
            if line.startswith("Keywords:"):
                keywords = line.split(":")[-1].strip().split(", ")

    return keywords

if __name__ == "__main__":
    # Example text for keyword extraction
    text_to_extract = "Affordable and Clean Energy highlights the need for access to reliable, sustainable, and modern energy for all."

    # Extract keywords
    keywords = extract_keywords(text_to_extract)
    print(f"Extracted keywords: {keywords}")
