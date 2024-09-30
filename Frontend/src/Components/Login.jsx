import { useState, useEffect } from 'react';
import axios from 'axios';
import '../Style/formStyle.css';
import {useNavigate } from 'react-router-dom';
import { Alert } from "antd";
const validator = require('validator');

function Login() {
    const [incorrectField, setIncorrectFieldAlert] = useState(false);
    const [emptyField, setEmptyFieldAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loginData, setLoginData] = useState({
        email: "",
        password : ""
    });
    const [userDetails, setUserDetails] = useState()
    const navigate = useNavigate();

    // In this ...loginData in it, it creates a deep copy of previous filled data and then add the value correspos

    const handleLoginChange = (e) =>{
        const {name, value} = e.target;
        const newData = {
            ...loginData,
            [name] : value
        } 
        setLoginData(newData);
        if (emptyField) {
            setEmptyFieldAlert(false);
        }
        if (incorrectField) {
            setIncorrectFieldAlert(false);
        }
        if (alertMessage) {
            setAlertMessage('');
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (loginData.email.trim() === '' || loginData.password.trim() === '') {
            setEmptyFieldAlert(true);
            setAlertMessage("Please Fill all the details");
            return;
        }
        if(!validator.isEmail(loginData.email)){
            setIncorrectFieldAlert(true);
            setAlertMessage("Please check the credentials");
            return;
        }
        if(loginData.password.trim().length < 6){
            setEmptyFieldAlert(true);
            setAlertMessage("The password length should be greater than 5");
            return;
        }
        try {
            setSubmitted(true);
            const response = await axios.post("http://localhost:5000/login", loginData);
            if(response.status === 200){
                localStorage.setItem('userDetails', JSON.stringify(response.data));

                setTimeout(() => {
                    navigate('/');        
                    window.location.reload();  
                }, 1000);  // Delay for a smooth transition
            }
        } 
        catch (error) {
            console.log(error);    
            setIncorrectFieldAlert(true);
            setAlertMessage("Incorrect Credentials or user not registered");
        }
    }

    return (
        <div className='container'>
            <div className='form-container'>
                <h1 className='form-title'>Employee Login form</h1>
                <form className='form'>
                    <input name='email' type='email' value= {loginData.email} placeholder='Enter your Email' onChange={handleLoginChange} className='form-input'  />
                    <input name = 'password' type='password' placeholder='Enter your password' value={loginData.password}  onChange={handleLoginChange} className='form-input' />
                    <button type='submit' onClick={handleLoginSubmit} className='form-button'>Login</button>
                </form>

                {submitted && (
                    <div className='result'>
                        <div>   
                            <h2> User Logged In with Credentials</h2>
                            <p>Email: {loginData.email}</p>
                        </div>
                    </div>
                )}
                {incorrectField && <Alert message = {alertMessage} type="error" />} 
                {emptyField && <Alert message = {alertMessage} type="warning" />} 
            </div>
        </div>
    );
}

export default Login;
