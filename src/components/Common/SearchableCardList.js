// Import necessary libraries and components.
import React, { useState } from 'react';
import './SearchableCardList.css';

/**
 * A component that displays a searchable list of cards.
 * @param {object} props - The component's props.
 * @param {Array} props.items - The list of items to display.
 * @param {function} props.searchFunction - A function that takes an item and a search term and returns true if the item matches the search term.
 * @param {function} props.renderCard - A function that takes an item and returns a React element to render for that item.
 * @returns {JSX.Element} The SearchableCardList component.
 */
const SearchableCardList = ({ items, searchFunction, renderCard }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter the items based on the search term.
    const filteredItems = searchTerm ? items.filter(item => searchFunction(item, searchTerm)) : [];

    return (
        <div className="searchable-card-list">
            {/* The search input field. */}
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="searchable-card-list-input"
            />
            {/* The list of filtered items. */}
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
