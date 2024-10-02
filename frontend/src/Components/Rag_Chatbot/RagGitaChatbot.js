import React, { useState, useEffect, useRef } from 'react';
import '../Chatbot/Chat.css';
import axios from 'axios';
import { Alert } from "antd";
import { v4 as uuidv4 } from 'uuid';

function RagGitaChatbot() {
    const [messages, setMessages] = useState([{ sender: "bot", text: "Hello, how can I assist you today?" }]);
    
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false); // For typing simulation
    const chatWindowRef = useRef(null);
    const [userEmail, setUserEmail] = useState('');
    const [emptyFieldAlert, setEmptyFieldAlert] = useState(false);
    const [userSessionId, setUserSessionId] = useState('');

    const handleTextInputChange = (e) => {
        setInput(e.target.value);
        setEmptyFieldAlert(false);
    }

    useEffect(() => {

        const user = JSON.parse(localStorage.getItem('userDetails'));
        if (user) {
            setUserEmail(user.email);
        }
        const originalUid = uuidv4();
        setUserSessionId(originalUid);
    }, []);

    const handleSendMessage = async () => {
        if(input.trim() === ''){
            setEmptyFieldAlert(true);
            return;
        }
        try {
            const newMessages = [...messages, { sender: "user", text: input }];
            setMessages(newMessages);
            setInput('');

            setIsTyping(true);

            // Delay before sending request to the backend
            await new Promise(resolve => setTimeout(resolve, 200)); //delay
            const bookId = "1";
            debugger;
            
            const userRagChatData = {'email' : userEmail, 'user_question' : input, 'session_id' : userSessionId , 'book_code' : bookId};
            const response = await axios.post("https://harmoni03.onrender.com/user_book_chat_response", userRagChatData);

            let botResponse = '';
            if(response.status === 200){
                botResponse = response.data.bot_response;
                console.log(response);
            }

            // Remove typing and display bot response
            setIsTyping(false);
            const updatedMessages = [
                ...newMessages, 
                { sender: "bot", text: botResponse }
            ];
            setMessages(updatedMessages);
        }
        catch(error){
            console.log(error);
            setEmptyFieldAlert(true);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chat-window" ref={chatWindowRef}>
                {messages.map((msg, index) => (
                <div
                    key={index}
                    className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
                >
                    <p>{msg.text}</p>
                </div>
                ))}
                {isTyping && (
                <div className="message bot-message">
                    <p><i>Typing...</i></p> {/* Typing effect */}
                </div>
                )}
            </div>
            {emptyFieldAlert && <Alert message={"Please input a valid Message"} type="warning" />} 
            <div className="input-container">
                <textarea
                value={input}
                onChange={handleTextInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                rows={1}
                />
                <button className='chat-button' onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
}

export default RagGitaChatbot;
