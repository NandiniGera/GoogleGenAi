import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './RagCard.css';

function RagCard(props) {
  const { image, title, routerLink, description } = props; // 'routerLink' is the path to navigate to

  return (
    <Link to={routerLink} className="venue-card-link"> {/* Use Link here */}
      <div className="venue-card">
        <div className="card-image">
          <img src={image} alt={title} />
        </div>
        <div className="card-details">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
    </Link>
  );
}

export default RagCard;
