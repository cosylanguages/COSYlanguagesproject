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

  // Logos et drapeaux comme dans CosyLanguageSelector
  const { currentLangKey, allTranslations } = typeof useI18n === 'function' ? useI18n() : { currentLangKey: null, allTranslations: {} };
  const logos = {
    COSYarmenian: '/assets/icons/cosylanguages_logos/cosyarmenian.png',
    COSYbashkir: '/assets/icons/cosylanguages_logos/cosybachkir.png',
    COSYbreton: '/assets/icons/cosylanguages_logos/cosybreton.png',
    COSYenglish: '/assets/icons/cosylanguages_logos/cosyenglish.png',
    COSYfrench: '/assets/icons/cosylanguages_logos/cosyfrench.png',
    COSYgeorgian: '/assets/icons/cosylanguages_logos/cosygeorgian.png',
    COSYgerman: '/assets/icons/cosylanguages_logos/cosygerman.png',
    COSYgreek: '/assets/icons/cosylanguages_logos/cosygreek.png',
    COSYitalian: '/assets/icons/cosylanguages_logos/cosyitalian.png',
    COSYportuguese: '/assets/icons/cosylanguages_logos/cosyportuguese.png',
    COSYrussian: '/assets/icons/cosylanguages_logos/cosyrussian.png',
    COSYspanish: '/assets/icons/cosylanguages_logos/cosyspanish.png',
    COSYtatar: '/assets/icons/cosylanguages_logos/cosytatar.png',
  };
  const flags = {
    COSYbashkir: '/assets/flags/Flag_of_Bashkortostan.png',
    COSYbreton: '/assets/flags/Flag_of_Brittany.png',
    COSYtatar: '/assets/flags/Flag_of_Tatarstan.png',
  };
  return (
    <div>
      {/* Affichage du logo et du drapeau de la langue sélectionnée */}
      {currentLangKey && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0' }}>
          {logos[currentLangKey] && (
            <img src={logos[currentLangKey]} alt="Logo" style={{ width: '48px', height: '48px', borderRadius: '8px', boxShadow: '0 1px 6px rgba(0,0,0,0.10)' }} />
          )}
          {flags[currentLangKey] && (
            <img src={flags[currentLangKey]} alt="Drapeau" style={{ width: '48px', height: '48px', borderRadius: '8px', boxShadow: '0 1px 6px rgba(0,0,0,0.10)' }} />
          )}
          <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
            {allTranslations[currentLangKey]?.cosyName || currentLangKey}
          </span>
        </div>
      )}
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
