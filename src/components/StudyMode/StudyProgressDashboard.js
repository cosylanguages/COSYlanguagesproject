import React from 'react';
import './StudyProgressDashboard.css';

const StudyProgressDashboard = ({ progress }) => {
  return (
    <div className="study-progress-dashboard">
      <h3>Study Progress</h3>
      <div className="progress-grid">
        {Object.keys(progress).map(skill => (
          <div key={skill} className="skill-progress">
            <label>{skill}</label>
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{ width: `${progress[skill]}%` }}
              >
                {progress[skill]}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyProgressDashboard;
