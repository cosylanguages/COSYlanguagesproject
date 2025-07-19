import React, { useState } from 'react';
import './LanguagePartnerFinder.css';

const LanguagePartnerFinder = () => {
  const [partners, setPartners] = useState([]);
  const [language, setLanguage] = useState('');

  const findPartners = () => {
    // In a real app, this would be a call to a backend service
    setPartners([
      { id: 1, name: 'Alex', learning: 'French' },
      { id: 2, name: 'Maria', learning: 'Spanish' },
    ]);
  };

  return (
    <div className="language-partner-finder">
      <h3>Find a Language Partner</h3>
      <input
        type="text"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        placeholder="Language you want to practice"
      />
      <button onClick={findPartners}>Find</button>
      <div className="partners-list">
        {partners.map(partner => (
          <div key={partner.id} className="partner">
            <p>{partner.name}</p>
            <p>Learning: {partner.learning}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguagePartnerFinder;
