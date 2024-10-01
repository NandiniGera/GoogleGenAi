import { useState, useEffect } from 'react';
import axios from 'axios';
import '../Style/formStyle.css';
import {useNavigate } from 'react-router-dom';


function Logout() {

    const navigate = useNavigate();
    const [userChatMessages, setUserChatMessages] = useState([]);
    const [isLogOut, setIsLogOut] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    

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
                    userMessage = ""; // Reset for the next pair
                }
            }
        }
        return result;
    };

    const handleLogOut = async (e) => {
        e.preventDefault();
        try {
            const chatPairs = convertChatDataToPairs(userChatMessages);
            const logOutData = {'email' : userEmail, 'conversation' : chatPairs};
            const response = await axios.post("http://localhost:5000/logout", logOutData);

            if(response.status === 200){

                setIsLogOut(true);
                localStorage.removeItem("userDetails");
                localStorage.removeItem("chatMessages");
                setTimeout(() => {
                    navigate('/');      
                    window.location.reload();     
                }, 100);  // Delay for a smooth transition
            }
        } 
        catch (error) {
            console.log(error);    
        }
    }

    return (
        <div className='container'>
            <div className='form-container'>
                <h2 className='form-title'>Are you Sure you want to log out</h2>
                <button type='submit' onClick={handleLogOut} className='form-button'>Logout</button>

                {isLogOut && (
                    <div className='result'>
                        <div>   
                            <h3> User Logged Out Successfully</h3>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Logout;
