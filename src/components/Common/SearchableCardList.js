import React, { useState } from 'react';
import './SearchableCardList.css';

const SearchableCardList = ({ items, searchFunction, renderCard }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = searchTerm ? items.filter(item => searchFunction(item, searchTerm)) : [];

    return (
        <div className="searchable-card-list">
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="searchable-card-list-input"
            />
            <div className="searchable-card-list-results">
                {filteredItems.map((item, index) => (
                    <div key={index}>
                        {renderCard(item)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchableCardList;
