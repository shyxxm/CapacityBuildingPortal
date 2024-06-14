import google.generativeai as genai

# Replace with your actual API key (obtain from Google AI Studio)
API_KEY = "AIzaSyAIBrIs9VTOikEvJel5ZKElU6zDGnro6Jc"

def classify_sdg(text):
    """
    Classifies the given text into one of the 17 SDGs and provides scores for each SDG.
    """
    # Configure the API key
    genai.configure(api_key=API_KEY)

    # Load the Gemini model (change the model name if needed)
    model = genai.GenerativeModel('gemini-1.0-pro')

    # Define the prompt template
    prompt = (
        f"The following text is related to one or more of the Sustainable Development Goals (SDGs). "
        f"Please classify it by providing the SDG number and a confidence score ranging from 0 to 1. "
        f"For example, if the text is most likely related to SDG 3, you might assign a score of 0.99. "
        f"For example, if there is also a slight chance it is related to SDG 4, you might give it a score of 0.44. \n\n"
        f"Text: \"{text}\"\n\n"
        f"Provide the results in the following format:\n"
        f"SDG: <SDG number>\n\n"
        f"Scores:\n"
        f"SDG 1: <score>\nSDG 2: <score>\n...SDG 17: <score>"
    )

    # Generate text using the model and prompt
    response = model.generate_content(prompt)

    # Extract relevant information from the response
    classification = {"sdg_number": None, "confidence_score": None}
    scores = {}

    if response._result.candidates:
        content = response._result.candidates[0].content.parts[0].text
        lines = content.split("\n")
        
        for line in lines:
            if line.startswith("SDG:"):
                classification["sdg_number"] = int(line.split(":")[-1].strip())
            elif line.startswith("SDG "):
                sdg, score = line.split(":")
                scores[sdg.strip()] = float(score.strip())

        if classification["sdg_number"] is not None:
            classification["confidence_score"] = scores.get(f"SDG {classification['sdg_number']}", None)

    # Normalize the scores to sum up to 1
    total_score = sum(scores.values())
    if total_score > 0:
        for sdg in scores:
            scores[sdg] = scores[sdg] / total_score

    return classification, scores

if __name__ == "__main__":
    # Example text to classify
    text_to_classify = "Affordable and Clean Energy highlights the need for access to reliable, sustainable, and modern energy for all."
    
    classification, scores = classify_sdg(text_to_classify)
    print(f"Classification: {classification}")
    print(f"Scores: {scores}")
