
import React, { useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { createEvent } from '../api/community';
import './EventForm.css';

const EventForm = () => {
  const { t } = useI18n();
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = { title, videoUrl, videoTitle, start, end, description };
    createEvent(newEvent)
      .then(res => {
        console.log(res);
        alert('Event created successfully!');
      })
      .catch(err => {
        console.error('Error creating event:', err);
        alert('Error creating event. Please try again.');
      });
  };

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <h3>{t('eventForm.title', 'Create an Event')}</h3>
      <input type="text" placeholder={t('eventForm.placeholder.title', 'Title')} value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="text" placeholder={t('eventForm.placeholder.videoUrl', 'Video URL')} value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
      <input type="text" placeholder={t('eventForm.placeholder.videoTitle', 'Video Title')} value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} />
      <input type="datetime-local" placeholder={t('eventForm.placeholder.start', 'Start Time')} value={start} onChange={(e) => setStart(e.target.value)} />
      <input type="datetime-local" placeholder={t('eventForm.placeholder.end', 'End Time')} value={end} onChange={(e) => setEnd(e.target.value)} />
      <textarea placeholder={t('eventForm.placeholder.description', 'Description')} value={description} onChange={(e) => setDescription(e.target.value)} />
      <button type="submit">{t('eventForm.submitButton', 'Create')}</button>
    </form>
  );
};

export default EventForm;
