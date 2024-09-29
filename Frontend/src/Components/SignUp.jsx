import { useState} from 'react';
import axios from 'axios';
import '../Style/formStyle.css';
import { Alert } from "antd";
import {useNavigate } from 'react-router-dom';
const validator = require('validator');

function SignUp() {
    const [submitted, setSubmitted] = useState(false);
    const [signUpData, setSignUpData] = useState({
        Name: '',
        Email: '',
        Gender: '',
        Password : '',
        ConfirmPassword : ''
    });
    const navigate = useNavigate();
    const [incorrectField, setIncorrectFieldAlert] = useState(false);
    const [emptyField, setEmptyFieldAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleSignUpChange = (e) => {
        const { name, value } = e.target;
        setSignUpData(prevState => ({
            ...prevState,
            [name]: value
        }));

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

    
    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        if (signUpData.Name.trim() === '' || signUpData.Email.trim() === '' || signUpData.Gender.trim() === '' || signUpData.Password.trim() === '' || signUpData.ConfirmPassword.trim() === '') {
            setEmptyFieldAlert(true);
            setAlertMessage("Please Fill all the details");
            return;
        }
        if(!validator.isEmail(signUpData.Email)){
            setIncorrectFieldAlert(true);
            setAlertMessage("Please check the credentials");
            return;
        }
        if(signUpData.Password.trim().length < 6){
            setEmptyFieldAlert(true);
            setAlertMessage("The password length should be greater than 5");
            return;
        }
        if(signUpData.Password !== signUpData.ConfirmPassword){
            setIncorrectFieldAlert(true);
            setAlertMessage("Confirm Password and Password both are not same");
            return;
        }
        
        try {
            setSubmitted(true);
            // const response = await axios.post("http://localhost:8000/user/signup", signUpData);

            setTimeout(() => {
                navigate('/login');
            }, 2000); // Delay of 3000ms (3 seconds)
            
        } 
        catch (error) {
            console.log(error);
            setIncorrectFieldAlert(true);
            setAlertMessage("Error at Registering User");
        }
    };

    return (
        <div className='container'>
            <div className='form-container'>
                <h1 className='form-title'>Employee SignUp form</h1>
                <form className='form'>
                    <input className='form-input' name='Name' type='text' value={signUpData.Name} placeholder='Enter your Name' onChange={handleSignUpChange} />
                    <input className='form-input' name='Email' type='text' value={signUpData.Email} placeholder='Enter your Email' onChange={handleSignUpChange}  />
                    <select 
                        name='Gender' 
                        value={signUpData.Gender} 
                        onChange={handleSignUpChange} 
                        className='form-select'
                    >
                        <option value="">Enter Your Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <input className='form-input' name = 'Password' type='password' placeholder='Enter your password' value={signUpData.Password }  onChange={handleSignUpChange} />
                    <input className='form-input' name = 'ConfirmPassword' type='password' placeholder='Confirm your password' value={signUpData.ConfirmPassword }  onChange={handleSignUpChange} />
                    <button className='form-button' type='submit' onClick={handleSignUpSubmit}>SignUp</button>
                </form>

                {submitted && (
                    <div className='result'>
                        <div>
                            <h2>Welcome {signUpData.firstName}</h2>
                            
                            <p> Created User with Credentials</p>
                            <p>Name: {signUpData.Name}</p>
                            <p>Email: {signUpData.Email}</p>
                            <p>Gender: {signUpData.Gender}</p>
                            <h2>Now Please LogIn Again</h2>
                        </div>
                    </div>
                )}
                {incorrectField && <Alert message = {alertMessage} type="error" />} 
                {emptyField && <Alert message = {alertMessage} type="warning" />} 
            </div>


        </div>
    );
}

export default SignUp;
