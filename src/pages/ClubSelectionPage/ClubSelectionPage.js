import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClubSelectionMatrix from '../../components/SpeakingClub/ClubSelectionMatrix';
import { Link } from 'react-router-dom';
import './ClubSelectionPage.css';

const ClubOfTheDay = ({ events }) => {
  const [club, setClub] = useState(null);

  useEffect(() => {
    if (events && events.length > 0) {
      const randomIndex = Math.floor(Math.random() * events.length);
      setClub(events[randomIndex]);
    }
  }, [events]);

  if (!club) return null;

  return (
    <div className="club-of-the-day">
      <h3>Club of the Day</h3>
      <Link to={`/speaking-club/${club._id}`}>
        <h4>{club.title}</h4>
        <p>{club.description}</p>
        <span className={`level-badge ${club.level?.toLowerCase()}`}>{club.level}</span>
      </Link>
    </div>
  );
};

const ProgressTracker = () => (
  <div className="progress-tracker">
    <h3>My Progress</h3>
    <p>You have completed <strong>0/X</strong> sessions.</p>
    {/* Placeholder for progress visualization */}
  </div>
);

const SkillTagsFilter = () => (
    <div className="skill-tags-filter">
        <h3>Filter by Skill</h3>
        <button>Listening</button>
        <button>Debate</button>
        <button>Vocabulary</button>
    </div>
);

const ClubSelectionPage = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        axios.get('/api/events')
          .then(response => {
            setEvents(response.data.events);
          })
          .catch(error => {
            console.error("Failed to fetch events:", error);
          });
      }, []);

  return (
    <div className="club-selection-page">
      <header className="page-header">
        <h1>Welcome to the Speaking Club</h1>
        <p>Select a club to join and start practicing!</p>
      </header>
      <div className="discovery-features">
          <ClubOfTheDay events={events} />
          <ProgressTracker />
      </div>
      <SkillTagsFilter />
      <ClubSelectionMatrix />
    </div>
  );
};

export default ClubSelectionPage;
