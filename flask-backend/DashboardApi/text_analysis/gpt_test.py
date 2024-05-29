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
    Classifies the given text into one of the 17 SDGs, extracts keywords, performs sentiment analysis,
    and provides scores for each SDG.
    """
    prompt = (
        f"The following text is related to one or more of the Sustainable Development Goals (SDGs). "
        f"Please classify it by providing the SDG number and a confidence score ranging from 0 to 1. "
        f"For example, if the text is most likely related to SDG 3, you might assign a score of 0.99. "
        f"For example, if there is also a slight chance it is related to SDG 4, you might give it a score of 0.44. "
        f"Additionally, please extract the keywords from the text and perform a sentiment analysis, "
        f"indicating whether the sentiment is positive, negative, or neutral.\n\n"
        f"Text: \"{text}\"\n\n"
        f"Provide the results in the following format:\n"
        f"SDG: <SDG number>\nKeywords: <keywords>\nSentiment: <sentiment>\n\n"
        f"Scores:\n"
        f"SDG 1: <score>\nSDG 2: <score>\n...SDG 17: <score>"
    )

    response = openai.chat.completions.create(
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

    # Extract SDG, Keywords, and Sentiment
    sdg = "N/A"
    keywords = "N/A"
    sentiment = "N/A"

    sdg_scores = {}
    parsing_scores = False
    for line in lines:
        if line.startswith("SDG:"):
            sdg = line.split(":")[1].strip()
        elif line.startswith("Keywords:"):
            keywords = line.split(":")[1].strip()
        elif line.startswith("Sentiment:"):
            sentiment = line.split(":")[1].strip()
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

    print(f"SDG: {sdg}")
    print(f"Keywords: {keywords}")
    print(f"Sentiment: {sentiment}")
    for sdg_num, score in sdg_scores.items():
        print(f"{sdg_num}: {score:.4f}")
    print(f"The most likely SDG is: {most_likely_sdg}")

    return sdg, keywords, sentiment, sdg_scores, most_likely_sdg

if __name__ == "__main__":
    # Example text to classify
    input_text = (
        "From a gender perspective, Paulgaard points out that the labour markets of the fishing villages have been highly gender-segregated in terms of the existence of \"male jobs\" and \"female jobs\"; however, the new business opportunities have led to the male population of the peripheral areas now working in the service industry in former \"female jobs\": \"That boys and girls are doing the same jobs indicates change, because traditional boundaries between women and men's work are being crossed. But the fact that young people are still working represents continuity with the past\" (Paulgaard 2002: 102). When Paulgaard refers to continuity with traditions, she refers to the expectations of young adults to participate in adult culture, thus these fishing villages traditionally have no actual youth culture. As described earlier, Paulgaard (2015) concludes that in some of Norway's peripheral areas school is still 'foreign', a time waster stealing time from young adults who should instead spend their time on what is considered to be \"real\" work."
    )

    # Classify the text, extract keywords, and analyze sentiment
    sdg, keywords, sentiment, sdg_scores, most_likely_sdg = classify_sdg(input_text)
    print(f"The text is classified under SDG: {sdg}")
    print(f"Extracted keywords: {keywords}")
    print(f"Sentiment: {sentiment}")
    print(f"All SDG scores: {sdg_scores}")
    print(f"The most likely SDG is: {most_likely_sdg}")
