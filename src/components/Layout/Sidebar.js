import React from 'react';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <nav>
                <ul>
                    <li><button className="button-link active">Vocabulary</button></li>
                    <li><button className="button-link">Flashcards</button></li>
                    <li><button className="button-link">Quiz</button></li>
                    <li><button className="button-link">Grammar</button></li>
                    <li><button className="button-link">Listening</button></li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
