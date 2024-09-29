import React from 'react';
import OfferingCard from './OfferingCard';

const cardData = [
  {
    title: 'HeathCare Chatbot',
    imageUrl: require("../../../Assets/chatbot.png")
  },
  {
    title: 'User Diary',
    imageUrl: require("../../../Assets/diary.jpg")
  },
  {
    title: 'Mental Health Tracker',
    imageUrl: require("../../../Assets/mental-health.png"),
  },
];

function MainOfferingCard (){
  return (
    <div
    style={{
      display: 'flex',
      justifyContent: 'center', // Center the cards in the container
      padding: '20px', // Add padding around the container
      gap: '16px', // Space between the cards
      flexWrap: 'wrap', // Allow cards to wrap if there's not enough space
    }}>
      {cardData.map((item, index) => (
        <OfferingCard
          key={index}
          title={item.title}
          imageUrl={item.imageUrl}
        />
      ))}
    </div>
  );
};

export default MainOfferingCard;
