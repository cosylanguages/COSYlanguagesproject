
import React, { useState } from 'react';
import axios from 'axios';
import './EventForm.css';

const EventForm = () => {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = { title, start, end, description };
    axios.post('/events/add', newEvent)
      .then(res => console.log(res.data));
  };

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <h3>Créer un événement</h3>
      <input type="text" placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="datetime-local" placeholder="Début" value={start} onChange={(e) => setStart(e.target.value)} />
      <input type="datetime-local" placeholder="Fin" value={end} onChange={(e) => setEnd(e.target.value)} />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <button type="submit">Créer</button>
    </form>
  );
};

export default EventForm;
