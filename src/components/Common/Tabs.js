// src/components/Common/Tabs.js
import React, { useState } from 'react';
import './Tabs.css';

const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(children[0].props.label);

  const handleClick = (e, newActiveTab) => {
    e.preventDefault();
    setActiveTab(newActiveTab);
  };

  return (
    <div className="tabs">
      <ul className="nav nav-tabs">
        {children.map((child) => (
          <li
            key={child.props.label}
            className={activeTab === child.props.label ? 'nav-item active' : 'nav-item'}
          >
            <a
              href="#"
              className="nav-link"
              onClick={(e) => handleClick(e, child.props.label)}
            >
              {child.props.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="tab-content">
        {children.map((child) => {
          if (child.props.label === activeTab) {
            return (
              <div key={child.props.label} className="tab-pane">
                {child.props.children}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default Tabs;
