import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
import os 
# Setup Google Generative AI configuration
genai.configure(api_key=os.environ['GOOGLE_API_KEY'])
model = genai.GenerativeModel("gemini-1.5-flash")

# Sample phone numbers for healthcare institutions
healthcare_resources = (
    "If you are facing a mental health crisis, please contact the following helplines:\n"
    "1. National Mental Health Helpline (Kiran): 1800-599-0019 (24/7)\n"
    "2. Snehi Mental Health Helpline: 91-22-2772 6771\n"
    "3. Vandrevala Foundation: 1860-2662-345\n"
    "4. iCall - TISS Helpline: 9152987821\n"
    "5. Sangath COVID-19 Mental Health Helpline: 011-41198666 (Mon-Sat, 10 AM - 6 PM)\n\n"
    "For general health support, you can reach out to:\n"
    "6. National Health Helpline: 1800-180-1104\n"
    "7. Arogya Setu Helpline: 1075 (COVID-19 Queries)\n"
    "8. National AIDS Control Organisation: 1097\n"
    "9. Childline India: 1098 (Support for children in distress)\n"
    "10. Women Helpline: 181 (Support for women facing abuse or health issues)\n"
)

def check_serious_concern_with_llm(user_query):
    # Use the LLM to determine if the message indicates serious concerns
    prompt = (
        "You are a mental healthcare assistant. Based on the following user query, determine if the user may be experiencing a serious mental health concern, "
        "such as thoughts of self-harm, suicide, depression, or other severe emotional distress. "
        "Respond with 'yes' if it's serious and 'no' if it's not.\n"
        f"User Query: {user_query}\n"
        "Is this a serious mental health concern?"
        "Answer: YES or NO."
    )
    
    response = model.generate_content(prompt)
    return 'yes' in response.text.lower()

def process_message(login_days_history, current_day_history, session_history, user_query):
    # Unified prompt to check if the query is related to mental health and generate an appropriate response
    prompt = (
        "You are a mental healthcare assistant. Your task is to respond only to queries that are related to mental health issues, "
        "such as stress, anxiety, depression, emotional distress, self-harm, suicide, therapy, or general mental well-being. "
        "If the user's query is not related to mental health, respond with the following message: "
        "'It seems like your query may not be related to mental health. Please feel free to ask questions related to mental well-being, and I’ll do my best to help.'\n\n"
        "If the user's query is related to mental health, check if it's a serious concern like thoughts of self-harm or suicide. "
        "If so, respond with relevant healthcare resources and offer support. Otherwise, provide an empathetic and supportive response based on the user's query and their past history.\n\n"
        f"User Query: {user_query}\n"
        f"Session History: {session_history}\n"
        f"Current Day History: {current_day_history}\n"
        f"Last 14 Login Days History (with dates): {login_days_history}\n"
        "Chatbot Response:"
    )

    response = model.generate_content(prompt)
    return response.text

# Exportable function
def main(login_days_history, current_day_history, session_history, user_query):
    return process_message(login_days_history, current_day_history, session_history, user_query)



