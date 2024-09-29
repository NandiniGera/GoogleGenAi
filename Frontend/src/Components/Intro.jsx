import React from "react";
import '../Style/intro.css'
import frontpage from "../Assets/front-page.webp"
function Introduction(){

    return(
        <div class="intro-container">
            <div class="intro-text">
                <h1>Welcome to HealthCare Bot</h1>
                <p>Our healthcare chatbot provides instant, AI-powered support for medical queries, appointment scheduling, and personalized health guidance.</p>
            </div>
            <div class="intro-image">
                <img src={frontpage} alt="HeathCare Chatbot"/>
            </div>
        </div>
    );
}

export default Introduction;