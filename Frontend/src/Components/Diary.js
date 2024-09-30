import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../Style/Diary.css"; // Importing the CSS file
import { Alert } from "antd";
import { useNavigate } from 'react-router-dom';

function DiaryForm() {
    const [diaryEntry, setDiaryEntry] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [emptyFieldAlert, setEmptyFieldAlert] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userDetails'));
        // debugger;
        if (user) {
            setUserEmail(user.email);
        }
    }, []);

    const handleDiaryChange = (e) => {
        setDiaryEntry(e.target.value)
        if(emptyFieldAlert){
            setEmptyFieldAlert(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (diaryEntry.trim() === '') {
            setEmptyFieldAlert(true);
            return;
        }
        // Send input to the backend
        
        try {
            const userData = {'email' : userEmail, 'summary' : diaryEntry};
            setSubmitted(true);
            const response = await axios.post("http://localhost:5000/add_summary", userData);
            if(response.status === 200){

                setTimeout(() => {
                    navigate('/');         
                }, 1000);  // Delay for a smooth transition
            }
        } 
        catch (error) {
            console.log(error);    
            setEmptyFieldAlert(true);
        }
    };

    return (
        <div className="diary-container">
            <h1 className="diary-heading">My Personal Diary</h1>
            <form onSubmit={handleSubmit} className="diary-form">
                <textarea
                className="diary-input"
                placeholder="Write your thoughts here..."
                value={diaryEntry}
                onChange={handleDiaryChange}
                required
            />
                <button type="submit" className="diary-button">Submit</button>
            </form>
            {submitted && <p className="success-message">Diary entry submitted successfully!</p>}
            {emptyFieldAlert && <Alert message = {"Please fill the form"} type="warning" />} 
        </div>
  );
}

export default DiaryForm;
