import React from 'react';
import { Link } from 'react-router-dom';
import './KeyToolsCallouts.css';

const KeyToolsCallouts = () => {
    const tools = [
        {
            title: 'Community Clubs',
            description: 'Join a speaking club →',
            link: '/community',
            icon: 'users' // Placeholder for an icon
        },
        {
            title: 'Calculator',
            description: 'Plan your learning journey →',
            link: '/calculator',
            icon: 'calculator' // Placeholder for an icon
        },
        {
            title: 'Study Mode',
            description: 'Unlock your full potential →',
            link: '/study',
            icon: 'lock' // Placeholder for an icon
        }
    ];

    return (
        <div className="key-tools-callouts">
            <h3>Explore Our Tools</h3>
            <div className="tools-container">
                {tools.map(tool => (
                    <Link to={tool.link} key={tool.title} className="tool-card">
                        <div className="tool-icon">{/* Icon will go here */}</div>
                        <h4>{tool.title}</h4>
                        <p>{tool.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default KeyToolsCallouts;
