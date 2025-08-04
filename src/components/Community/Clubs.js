// src/components/Community/Clubs.js
import React, { useState, useEffect } from 'react';
import { getClubs } from '../../api/community';
import { useI18n } from '../../i18n/I18nContext';
import './Clubs.css';

const Clubs = () => {
  const { t } = useI18n();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const fetchedClubs = await getClubs();
        setClubs(fetchedClubs);
      } catch (err) {
        setError('Failed to fetch clubs.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  if (loading) {
    return <p>{t('community.clubs.loading', 'Loading clubs...')}</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="clubs-container">
      <h3>{t('community.clubs.title', 'Clubs')}</h3>
      <div className="clubs-list">
        {clubs.map(club => (
          <div key={club._id} className="club-card">
            <img src={club.inspiringMaterial.thumbnail} alt={club.title} className="club-thumbnail" />
            <div className="club-info">
                <h4>{club.title}</h4>
                <p>{club.description}</p>
                <span>{t('community.clubs.level', 'Level')}: {club.level}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clubs;
