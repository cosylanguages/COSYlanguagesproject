
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EventCalendar.css';

const EventCalendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get('/events')
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div className="event-calendar">
      <h3>Événements à venir</h3>
      <ul>
        {events.map(event => (
          <li key={event._id}>
            <strong>{event.title}</strong> — {new Date(event.start).toLocaleString()} à {new Date(event.end).toLocaleString()}
            <div>{event.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventCalendar;
