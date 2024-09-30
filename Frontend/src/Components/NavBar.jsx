import React from "react";
import '../Style/NavBarStyle.css';
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
function Navbar() {
    const [logOut, setLogOut] = useState(false);
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userDetails'));
        if (user) {
            setLogOut(true);
        }
        }, []);

    return (
        <div className="custom-navbar">
            <div className="custom-nav-left">
                <ul className="custom-nav-links">
                    <li><Link to="/">Home Page</Link></li>
                </ul>
            </div>
            <div className="custom-nav-right">
                <ul className="custom-nav-links">
                    {logOut && 
                    <>
                        <li><Link to="/chatbot">Chatbot</Link></li>
                        <li><Link to="/rag">RAG</Link></li>
                        <li><Link to="/diary">User Diary</Link></li>
                    </>}
                    { !logOut &&
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/signup">Sign Up</Link></li>
                    </>
                    }
                    {logOut && <li><Link to="/logout">Logout</Link></li> }
                </ul>
            </div>
        </div>
    );
}

export default Navbar;
