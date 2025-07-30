
import React, { useState, useEffect } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { getEvents } from '../api/community';
import './EventCalendar.css';

const EventCalendar = () => {
  const { t } = useI18n();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getEvents()
      .then(response => {
        setEvents(response);
      })
      .catch(error => {
        setError('Failed to fetch events.');
        console.error('Failed to fetch events:', error);
      });
  }, []);

  const handleRsvp = (eventId) => {
    console.log(`RSVPing to event ${eventId}`);
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="event-calendar">
      <h3>{t('community.events.title', 'Upcoming Events')}</h3>
      <ul>
        {events.map(event => (
          <li key={event._id}>
            <strong>{event.title}</strong> — {new Date(event.start).toLocaleString()} à {new Date(event.end).toLocaleString()}
            <div>{event.description}</div>
            <button onClick={() => handleRsvp(event._id)}>RSVP</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventCalendar;
