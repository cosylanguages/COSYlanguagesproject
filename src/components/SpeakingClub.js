
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SpeakingClub.css';

const SpeakingClub = ({ eventId }) => {
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (eventId) {
      axios.get(`/events/${eventId}`)
        .then(response => {
          setEvent(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [eventId]);

  if (!event) {
    return <div>Chargement du club de parole...</div>;
  }

  return (
    <div className="speaking-club">
      <h3>{event.title}</h3>
      <div>
        <h4>Sujets</h4>
        <ul>
          {event.topics && event.topics.map((topic, index) => <li key={index}>{topic}</li>)}
        </ul>
      </div>
      <div>
        <h4>Discussion</h4>
        <p>{event.discussion}</p>
      </div>
      <div>
        <h4>Vocabulaire</h4>
        <ul>
          {event.vocabulary && event.vocabulary.map((word, index) => <li key={index}>{word}</li>)}
        </ul>
      </div>
      <div>
        <h4>Tour 1</h4>
        <p>{event.round1}</p>
      </div>
      <div>
        <h4>Tour 2</h4>
        <p>{event.round2}</p>
      </div>
    </div>
  );
};

export default SpeakingClub;
