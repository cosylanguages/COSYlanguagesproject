// Import necessary libraries and components.
import React from 'react';

/**
 * A component that displays a single booster pack.
 * @param {object} props - The component's props.
 * @param {object} props.pack - The booster pack data.
 * @returns {JSX.Element|null} The BoosterPack component, or null if no pack is provided.
 */
const BoosterPack = ({ pack }) => {
    // If no pack is provided, don't render anything.
    if (!pack) {
        return null;
    }

    // Render the booster pack.
    return (
        <div className="booster-pack">
            <h3>{pack.name}</h3>
            <p>{pack.description}</p>
        </div>
    );
};

export default BoosterPack;
