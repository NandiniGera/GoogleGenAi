import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

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

  // Placeholder for bot response, this will come from backend in the future
  let botResponse = "This is a sample response."; // Replace this in the future with backend call

  useEffect(() => {
    // Automatically scroll to the bottom when new messages are added
    chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;

    // Save messages to local storage whenever they change
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim()) {
      // Update message list with user's message
      const newMessages = [...messages, { sender: "user", text: input }];
      setMessages(newMessages);
      setInput('');

      // Simulate bot response (later will be replaced with actual backend call)
      setTimeout(() => {
        const updatedMessages = [
          ...newMessages, 
          { sender: "bot", text: botResponse } // Bot response from a variable (in future, backend)
        ];
        setMessages(updatedMessages);
      }, 1000);
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
