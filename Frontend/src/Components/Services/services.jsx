import React from 'react';
import "./services.css";
import MainOfferingCard from "./OfferingsCard/MainOfferingCard";

function Services() {
  
  return (

    <div className="container">
      <h1 className="title">Our Healthcare Offerings</h1>
      <p className="description">
      Our healthcare chatbot is an AI-driven solution designed to enhance patient care by offering instant medical assistance, appointment scheduling, and personalized health guidance. It streamlines healthcare interactions, making it easier for users to access vital information and support, improving the overall patient experience.
      </p>
      <MainOfferingCard/>
    </div>
  );
}

export default Services;