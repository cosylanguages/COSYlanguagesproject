import React from 'react';

const BoosterPack = ({ pack }) => {
    if (!pack) {
        return null;
    }

    return (
        <div className="booster-pack">
            <h3>{pack.name}</h3>
            <p>{pack.description}</p>
        </div>
    );
};

export default BoosterPack;
