import React from 'react';
import './BoosterPack.css';

const BoosterPack = ({ pack }) => {
    return (
        <div className="booster-pack">
            <h3>{pack.title}</h3>
            <p>{pack.description}</p>
            <button>Start</button>
        </div>
    );
};

export default BoosterPack;
