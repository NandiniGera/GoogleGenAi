import React from 'react';
import { Card } from 'antd';

const { Meta } = Card;
function OfferingCard (props){
  const { title, imageUrl } = props;
  return (
    <Card
      hoverable
      style={{
        width: 240,
        height: 260, // Reduced height for the card
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
      cover={
        <div style={{ height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop : '8%' }}>
          <img
            alt="example"
            src={imageUrl}
            style={{ maxWidth: '100%', maxHeight: '100%' , objectFit: 'contain' }}
          />
        </div>
      }
    >
      <Meta 
        title={<span style={{ whiteSpace: 'normal',justifyContent: 'center', alignItems: 'center' ,textAlign: 'center' }}>{title}</span>}
      />
    </Card>
  );
};

export default OfferingCard;
