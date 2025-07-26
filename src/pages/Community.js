import React from 'react';
import Feed from '../components/Feed';
import CreatePost from '../components/CreatePost';
import EventCalendar from '../components/EventCalendar';
import EventForm from '../components/EventForm';
import SpeakingClub from '../components/SpeakingClub';

const Community = () => {
  const userId = "demo_user_id"; // À remplacer par l'ID réel de l'utilisateur connecté
  const eventId = null; // Peut être défini dynamiquement selon le contexte
  const isAdmin = true; // À adapter selon le rôle utilisateur

  return (
    <div>
      <h2>Communauté</h2>
      <CreatePost userId={userId} />
      <Feed userId={userId} />
      <EventCalendar />
      {isAdmin && <EventForm />}
      {eventId && <SpeakingClub eventId={eventId} />}
    </div>
  );
};

export default Community;
