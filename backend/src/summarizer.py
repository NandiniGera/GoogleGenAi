import google.generativeai as genai
import os 
from dotenv import load_dotenv

# Setup Google Generative AI configuration
load_dotenv()
genai.configure(api_key=os.environ['GOOGLE_API_KEY'])
model = genai.GenerativeModel("gemini-1.5-flash")


def summarize_session_history(session_history):
    # Generate a summary of the session history, focusing on important emotional indicators and events
    prompt = (
        "You are a mental health assistant tasked with summarizing session histories. "
        "Please provide a concise summary that retains all important information useful for assessing the mental state of the user. "
        "Focus on key emotional indicators and significant events. Here is the session history:\n"
        f"{session_history}\n"
        f"Summary:"
    )

    summary = model.generate_content(prompt)
    return summary.text

# Exportable function
def main(session_history):
    return summarize_session_history(session_history)


