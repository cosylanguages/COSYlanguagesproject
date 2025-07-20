import React from 'react';
import './CosyCorner.css';

const CosyCorner = () => {
  const links = [
    { id: 1, title: 'Learn about French cuisine', url: '#' },
    { id: 2, title: 'Listen to a Spanish podcast', url: '#' },
    { id: 3, title: 'Watch a German movie trailer', url: '#' },
  ];

  return (
    <div className="cosy-corner-container">
      <h3>Cosy Corner</h3>
      <ul>
        {links.map((link) => (
          <li key={link.id}>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CosyCorner;
