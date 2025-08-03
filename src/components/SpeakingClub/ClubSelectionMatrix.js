import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ClubSelectionMatrix.css';

const CLUB_TYPES = ['Keeping Up With Science', 'Let\'s Celebrate', 'The Greatest Quotes', 'Mind Matters', 'I Couldn\'t Help But Wonder'];
const LEVELS = ['Starter', 'Elementary', 'Intermediate', 'Advanced'];

const ClubSelectionMatrix = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/events')
      .then(response => {
        setEvents(response.data.events);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch events:", error);
        setLoading(false);
      });
  }, []);

  const getEventForCell = (clubType, level) => {
    return events.find(event => event.clubType === clubType && event.level === level);
  };

  if (loading) {
    return <div>Loading clubs...</div>;
  }

  return (
    <div className="club-selection-matrix">
      <h2>Club Selection Matrix</h2>
      <table>
        <thead>
          <tr>
            <th>Club Type</th>
            {LEVELS.map(level => <th key={level}>{level}</th>)}
          </tr>
        </thead>
        <tbody>
          {CLUB_TYPES.map(clubType => (
            <tr key={clubType}>
              <td>{clubType}</td>
              {LEVELS.map(level => {
                const event = getEventForCell(clubType, level);
                return (
                  <td key={level}>
                    {event ? (
                      <Link to={`/speaking-club/${event._id}`} className="club-link available">
                        ✓
                      </Link>
                    ) : (
                      <span className="club-link unavailable">--</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClubSelectionMatrix;
