import { useState, useEffect } from 'react';

export const useBoosterPacks = () => {
  const [boosterPacks, setBoosterPacks] = useState([]);
  const [userBoosterPacks, setUserBoosterPacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${process.env.PUBLIC_URL}/data/booster_packs.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch booster packs');
        }
        return response.json();
      })
      .then(data => {
        setBoosterPacks(data);
      })
      .catch(error => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const storedUserPacks = JSON.parse(localStorage.getItem('userBoosterPacks')) || [];
    setUserBoosterPacks(storedUserPacks);
  }, []);

  const addUserBoosterPack = (pack) => {
    const newUserPacks = [...userBoosterPacks, pack];
    setUserBoosterPacks(newUserPacks);
    localStorage.setItem('userBoosterPacks', JSON.stringify(newUserPacks));
  };

  return { boosterPacks, userBoosterPacks, addUserBoosterPack, loading, error };
};
