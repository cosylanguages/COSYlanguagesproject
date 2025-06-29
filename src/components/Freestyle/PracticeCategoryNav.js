import React from 'react';

// These would ideally come from a config or be derived from available exercise types
const PRACTICE_CATEGORIES = [
  { id: 'vocabulary', label: '🔠 Vocabulary' },
  { id: 'grammar', label: '🧩 Grammar' },
  { id: 'reading', label: '📚 Reading' },
  { id: 'speaking', label: '🗣️ Speaking' },
  { id: 'writing', label: '✍️ Writing' },
  // { id: 'practice-all', label: '🔄 Practice All' }, // Consider how to handle this
];

const PracticeCategoryNav = ({ activeCategory, onCategorySelect }) => {
  return (
    <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
      {PRACTICE_CATEGORIES.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategorySelect(category.id)}
          style={{
            padding: '10px 15px',
            fontSize: '1rem',
            cursor: 'pointer',
            backgroundColor: activeCategory === category.id ? '#007bff' : '#f0f0f0',
            color: activeCategory === category.id ? 'white' : 'black',
            border: '1px solid #ccc',
            borderRadius: '5px',
          }}
          aria-pressed={activeCategory === category.id}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};

export default PracticeCategoryNav;
