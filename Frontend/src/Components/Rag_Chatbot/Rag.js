import React from "react";
import MainRagCard from "./RagCard/MainRagCard";
import './Rag.css'
function RAG(){
    return(
        <div className="rag-wrapper">
            <div className="main-rag-container">
                <div className="intro-rag-container">
                    <h1>Welcome to the Interactive RAG Section</h1>
                    <p>Below are various cards. Please select one to interact with the content.</p>
                </div>
                <MainRagCard/>
            </div>
        </div>
    );
}
export default RAG;