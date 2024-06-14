import openai
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Retrieve the OpenAI API key from environment variables
api_key = os.getenv('OPENAI_API_KEY')

# Initialize the OpenAI API client
openai.api_key = api_key

def classify_sdg(text):
    """
    Classifies the given text into one of the 17 SDGs and provides scores for each SDG.
    """
    prompt = (
        f"The following text is related to one or more of the Sustainable Development Goals (SDGs). "
        f"Please classify it by providing the SDG number and a confidence score ranging from 0 to 1. "
        f"For example, if the text is most likely related to SDG 3, you might assign a score of 0.99. "
        f"For example, if there is also a slight chance it is related to SDG 4, you might give it a score of 0.44. "
        f"Text: \"{text}\"\n\n"
        f"Provide the results in the following format:\n"
        f"SDG: <SDG number>\n\n"
        f"Scores:\n"
        f"SDG 1: <score>\nSDG 2: <score>\n...SDG 17: <score>"
    )

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=300,
        temperature=0.7
    )

    response_text = response.choices[0].message.content.strip()
    lines = response_text.split("\n")

    sdg = "N/A"
    sdg_scores = {}
    parsing_scores = False
    for line in lines:
        if line.startswith("SDG:"):
            sdg = line.split(":")[1].strip()
        elif line.startswith("Scores:"):
            parsing_scores = True
        elif parsing_scores and line.startswith("SDG"):
            sdg_num, score = line.split(":")
            try:
                sdg_scores[sdg_num.strip()] = float(score.strip())
            except ValueError:
                print(f"Skipping invalid score line: {line}")

    # Find the most likely SDG if there are valid scores
    most_likely_sdg = max(sdg_scores, key=sdg_scores.get) if sdg_scores else "N/A"

    return sdg, sdg_scores, most_likely_sdg

if __name__ == "__main__":
    # Example text to classify
    input_text = (
        "From a gender perspective, Paulgaard points out that the labour markets of the fishing villages..."
    )

    # Classify the text
    sdg, sdg_scores, most_likely_sdg = classify_sdg(input_text)
    print(f"The text is classified under SDG: {sdg}")
    print(f"All SDG scores: {sdg_scores}")
    print(f"The most likely SDG is: {most_likely_sdg}")
