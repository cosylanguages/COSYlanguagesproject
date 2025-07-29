import { useState, useEffect } from 'react';

export const useBoosterPacks = () => {
  const [boosterPacks, setBoosterPacks] = useState([]);
  const [userBoosterPacks, setUserBoosterPacks] = useState([]);

  useEffect(() => {
    fetch('/data/booster_packs.json')
      .then(response => response.json())
      .then(data => {
        setBoosterPacks(data);
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

  return { boosterPacks, userBoosterPacks, addUserBoosterPack };
};
