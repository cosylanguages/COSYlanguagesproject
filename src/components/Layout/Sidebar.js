import React from 'react';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <nav>
                <ul>
                    <li><a href="#" className="active">Vocabulary</a></li>
                    <li><a href="#">Flashcards</a></li>
                    <li><a href="#">Quiz</a></li>
                    <li><a href="#">Grammar</a></li>
                    <li><a href="#">Listening</a></li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
