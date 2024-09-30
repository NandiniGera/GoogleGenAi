
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS
from datetime import datetime
import bcrypt
import re
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os
from summarizer import summarize_session_history

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB connection
mongo_uri = os.getenv('MONGO_URI')
client = MongoClient(mongo_uri, server_api=ServerApi('1'))

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")

users_collection = client.myapp.users
responses_collection = client.myapp.responses
summary_collection = client.myapp.summary

# Regular expression to validate an email
email_regex = r'^\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'

# Questions for morning and evening
morning_questions = [
    "Did you smile today?",
    "Any worries on your mind? (Yes/No)",
    "Did you sleep well last night?",
    "Have you taken breaks today?",
    "Did you feel calm today?"
]

evening_questions = [
    "Did you smile today?",
    "Any worries on your mind? (Yes/No)",
    "Did you do this well last night?",
    "Have you taken breaks today?",
    "Did you feel calm today?"
]


# User registration
@app.route("/register", methods=['POST'])
def createUser():
    data = request.json
    
    # Check if all required fields are present
    required_fields = ['name', 'email', 'password', 'age', 'gender']
    for field in required_fields:
        if not data.get(field):  # Check if field is missing or empty
            return jsonify({"msg": f"'{field}' is required"}), 400
    
    # Validate that age is an integer
    if not isinstance(data['age'], int) or data['age'] <= 0:
        return jsonify({"msg": "Age must be a positive integer"}), 400
    
    # Validate email format using regex
    if not re.match(email_regex, data['email']):
        return jsonify({"msg": "Invalid email format"}), 400
    
    # Check if the user already exists by email
    if users_collection.find_one({'email': data['email']}):
        return jsonify({"msg": "User already exists"}), 400
    
    # Hash the password
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    
    # Insert new user into the database
    users_collection.insert_one({
        'name': data['name'],
        'email': data['email'],
        'password': hashed_password.decode('utf-8'),
        'age': data['age'],
        'gender': data['gender'],
    })
    
    return jsonify({"msg": "User created successfully"}), 201


# User login
@app.route("/login", methods=['POST'])
def loginUser():
    data = request.json
    required_fields = ['email', 'password']
    
    for field in required_fields:
        if not data.get(field):
            return jsonify({"msg": f"'{field}' is required"}), 400

    # Find the user by email
    user = users_collection.find_one({'email': data['email']})
    
    if user and bcrypt.checkpw(data['password'].encode('utf-8'), user['password'].encode('utf-8')):
        return jsonify({
            "msg": "Login successful",
            "user": {
                "name": user['name'],
                "email": user['email'],
                "age": user['age'],
                "gender": user['gender']
            }
        }), 200

    return jsonify({"msg": "Invalid email or password"}), 401


# Start conversation with 5 questions based on time of login
@app.route("/conversation", methods=['POST'])
def update_conversation():
    data = request.json
    user_email = data.get('email')
    qa_pairs = data.get('qa_pairs')

    if not user_email or not qa_pairs:
        return jsonify({"msg": "Email and question-answer pairs are required"}), 400

    # Find the user in the database
    user = users_collection.find_one({'email': user_email})
    if not user:
        return jsonify({"msg": "User not found"}), 404

    # Store each question-answer pair
    for pair in qa_pairs:
        question = pair.get('question')
        answer = pair.get('answer')
        # Make sure question and answer exist
        if not question or not answer:
            return jsonify({"msg": "Each question-answer pair must have both question and answer"}), 400
        # Store in the database (example code, adjust as needed)
        responses_collection.update_one(
            {'user_id': str(user["_id"])},
            {'$push': {'qa_pairs': {'question': question, 'answer': answer}}},
            upsert=True 
        )

    return jsonify({"msg": "Conversation updated successfully"}), 200


@app.route("/add_summary", methods=['POST'])
def add_summary():
    data = request.json
    user_email = data.get('email')  # Expecting user email from the request
    summary_text = data.get('summary')  # Expecting summary text from the request

    if not user_email or not summary_text:
        return jsonify({"msg": "Email and summary are required"}), 400

    # Get the current timestamp
    current_timestamp = datetime.now()
    current_date = current_timestamp.date()

    # Create a summary entry
    new_summary_entry = {
        "summary": summary_text,
        "timestamp": current_timestamp
    }

    # Check if there's an existing summary for the user
    existing_summary = summary_collection.find_one({"email": user_email})

    if existing_summary:
        existing_summaries = existing_summary['summaries']
        last_entry = existing_summaries[-1]  # Get the last summary entry

        # Check if the last summary is from the same day
        if last_entry['timestamp'].date() == current_date:
            # Concatenate the new summary to the last entry
            last_entry['summary'] += " " + summary_text
            # Update the last entry's timestamp
            last_entry['timestamp'] = current_timestamp
            existing_summaries[-1] = last_entry  # Update the last entry in the array
        else:
            # If different day, append the new summary
            existing_summaries.append(new_summary_entry)

        # Limit to 15 summaries and remove the oldest if needed
        if len(existing_summaries) > 15:
            existing_summaries.pop(0)  # Remove the oldest summary

        # Update the document
        summary_collection.update_one(
            {"email": user_email},
            {"$set": {"summaries": existing_summaries}}
        )
    else:
        # If it doesn't exist, insert a new document with the first summary
        summary_collection.insert_one({
            "email": user_email,
            "summaries": [new_summary_entry]  # Initialize with the first summary
        })

    return jsonify({"msg": "Summary added successfully", "timestamp": current_timestamp}), 200



@app.route("/logout", methods=['POST'])
def logout():
    data = request.json
    user_email = data.get('email')
    conversation = data.get('conversation')

    if not user_email or not conversation:
        return jsonify({"msg": "Email and conversation are required"}), 400

    # Call the LLM model to generate summary (replace this with your model call)
    summary = summarize_session_history(conversation)

    # Store the summary
    timestamp = datetime.now()
    summary_data = {
        "email": user_email,
        "timestamp": timestamp,
        "summary": summary
    }
    
    # Check if the user already has a summary for today
    existing_summary = summary_collection.find_one({"email": user_email, "timestamp": {"$gte": timestamp.replace(hour=0, minute=0, second=0, microsecond=0)}})

    if existing_summary:
        # If a summary exists for today, concatenate the new summary
        updated_summary = existing_summary['summary'] + " " + summary
        summary_collection.update_one(
            {"_id": existing_summary["_id"]},
            {"$set": {"summary": updated_summary}}
        )
    else:
        # If no summary exists for today, insert a new one
        summary_collection.insert_one(summary_data)

    return jsonify({"msg": "Logout successful, summary stored"}), 200


# Submit answers to questions
@app.route("/submit_answer", methods=['POST'])
def submit_answer():
    data = request.json
    conversation_id = data.get('conversation_id')
    answer = data.get('answer')

    if not conversation_id or answer is None:
        return jsonify({"msg": "Conversation ID and answer are required"}), 400

    # Find the conversation in the database
    conversation = responses_collection.find_one({"_id": ObjectId(conversation_id)})
    if not conversation:
        return jsonify({"msg": "Conversation not found"}), 404

    # Append the answer to the conversation
    answers = conversation['answers']
    answers.append(answer)

    # Check if all questions are answered
    if len(answers) < len(conversation['questions']):
        # Ask the next question
        next_question_index = len(answers)
        next_question = conversation['questions'][next_question_index]

        # Update the conversation state
        responses_collection.update_one(
            {"_id": ObjectId(conversation_id)},
            {"$set": {"answers": answers, "current_question": next_question_index}}
        )

        return jsonify({
            "question": next_question
        }), 200
    else:
        # All questions are answered, create the prompt
        prompt = f"User answered the questions as follows: {answers}"
        return jsonify({
            "msg": "All questions answered",
            "prompt": prompt
        }), 200


if __name__ == '__main__':
    app.run(debug=True)
