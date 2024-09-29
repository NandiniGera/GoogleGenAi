import { useState, useEffect } from 'react';
import axios from 'axios';
import '../Style/formStyle.css';
import {useNavigate } from 'react-router-dom';


function Logout() {

    const navigate = useNavigate();
    const [isLogOut, setIsLogOut] = useState(false);

    const handleLogOut = async (e) => {
        e.preventDefault();
        try {
            setIsLogOut(true);
            localStorage.removeItem("userDetails");
            localStorage.removeItem("chatMessages");
            setTimeout(() => {
                navigate('/'); // Navigate to the homepage after a delay
            }, 2000); // Delay of 3000ms (3 seconds)

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
