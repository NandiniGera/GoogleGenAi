from flask import Flask, request, jsonify
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS
import bcrypt
import re

app = Flask(__name__)
app.config['MONGO_URI']='mongodb://localhost:27017/myapp'
mongo = PyMongo(app)

CORS(app)

users_collection = mongo.db.users  # Correct way to access the collection

# Regular expression to validate an email
email_regex = r'^\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'

@app.route("/users", methods=['POST'])
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
    users_collection.insert_one({  # Use insert_one instead of insert
        'name': data['name'],
        'email': data['email'],
        'password': hashed_password.decode('utf-8'),
        'age': data['age'],
        'gender': data['gender'],
    })
    
    return jsonify({"msg": "User created successfully"}), 201


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
        return jsonify({"msg": "Login successful", "user": {"name": user['name'], "email": user['email'], "age": user['age'], "gender": user['gender']}}), 200

    return jsonify({"msg": "Invalid email or password"}), 401

if __name__ == '__main__':
    app.run(debug=True)