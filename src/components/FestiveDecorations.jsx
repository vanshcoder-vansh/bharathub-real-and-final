import React from 'react';
import { festiveConfig } from '../festiveConfig';

const FestiveDecorations = () => {
  if (!festiveConfig.showDecorations) return null;

  return (
    <>
      <div className="festive-snowflake" style={{ top: '10%', left: '5%' }}>*</div>
      <div className="festive-snowflake" style={{ top: '20%', right: '10%' }}>*</div>
      <div className="festive-snowflake" style={{ top: '40%', left: '15%' }}>*</div>
      <div className="festive-snowflake" style={{ top: '60%', right: '5%' }}>*</div>
      
      <div className="festive-star" style={{ top: '5%', right: '20%' }}>+</div>
      <div className="festive-star" style={{ top: '15%', left: '25%' }}>+</div>
      <div className="festive-star" style={{ top: '70%', right: '15%' }}>+</div>
    </>
  );
};

export default FestiveDecorations;
