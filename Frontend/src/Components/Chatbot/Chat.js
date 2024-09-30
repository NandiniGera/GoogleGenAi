import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import axios from 'axios';
import { Alert } from "antd";


function Chatbot() {
  // Initial state with messages from local storage if available
  const [messages, setMessages] = useState(() => {
    const storedMessages = localStorage.getItem('chatMessages');
    return storedMessages ? JSON.parse(storedMessages) : [
      { sender: "bot", text: "Hello, how can I assist you today?" }
    ];
  });
  
  const [input, setInput] = useState('');
  const chatWindowRef = useRef(null);
  const [userChatMessages, setUserChatMessages] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [emptyFieldAlert, setEmptyFieldAlert] = useState(false);

  useEffect(() => {
    chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;

    // Save messages to local storage whenever they change
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);


  useEffect(() => {
        
    const userChat = JSON.parse(localStorage.getItem('chatMessages'));
    const user = JSON.parse(localStorage.getItem('userDetails'));
    if (userChat) {
        setUserChatMessages(userChat);
    }
    if (user) {
        setUserEmail(user.email);
    }
  }, []);
  
  const handleTextInputChange = (e) => {
    setInput(e.target.value);
    setEmptyFieldAlert(false);
  }

  const convertChatDataToPairs = (chatData) => {
    const result = [];
    let userMessage = "";
    let botMessage = "";
  
    // Start looping from index 1 to skip the first message
    for (let i = 1; i < chatData.length; i++) {
        const entry = chatData[i];
        if (entry.sender === "user") {
            userMessage = entry.text;
        } 
        else if (entry.sender === "bot") {
            botMessage = entry.text;
            if (userMessage) {
                result.push(`${userMessage}: ${botMessage}`);
                userMessage = ""; 
            }
        }
    }
    return result;
  };

  const handleSendMessage = async () => {
    if(input.trim() === ''){
      setEmptyFieldAlert(true);
      return;
    }
    try {
      const newMessages = [...messages, { sender: "user", text: input }];
      setMessages(newMessages);
      setInput('');
      const chatPairs = convertChatDataToPairs(userChatMessages);
      const userChatData = {'email' : userEmail, 'user_query' : input,'session_history' : chatPairs};
      const response = await axios.post("http://localhost:5000/user_chat_response", userChatData);

      let botResponse = '';
      if(response.status === 200){
        botResponse = response.data.bot_response;
      }

      const updatedMessages = [
        ...newMessages, 
        { sender: "bot", text: botResponse } // Bot response from a variable (in future, backend)
      ];
      setMessages(updatedMessages);
    }
    catch(error){
      console.log(error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default behavior (like new line)
      handleSendMessage(); // Call the send message function
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
      </div>
      {emptyFieldAlert && <Alert message = {"Please input a valid Mesage"} type="warning" />} 
      <div className="input-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown} // Add onKeyDown event
          placeholder="Type your message..."
          rows={1}
        />
        <button className='chat-button' onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chatbot;
