import React from 'react';
import RagCard from './RagCard';
import './MainRagCard.css';
import atomicHabits from "../../../Assets/AtomicHabits.webp"
import bhagwat from "../../../Assets/bhagavad-gita.jpg"
const cardItems = [
  {
    image: bhagwat,
    title: 'Wisdom of the Gita',
    description : "Guidance for Life's Journey",
    routerLink : '/rag_bhagwat'
  },
  {
    image: atomicHabits,
    title: 'Atomic Habits',
    description : "Small changes, big results",
    routerLink : '/rag_atomicHabit'
  }
];

function MainRagCard() {

  return (
    <div>
      <div className="Main-Card">
        <div className="Main-Card-container">
          {cardItems.map((item, index) => (
            <RagCard
              key={index}
              image={item.image}
              description = {item.description}
              title={item.title}
              routerLink = {item.routerLink}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainRagCard;
