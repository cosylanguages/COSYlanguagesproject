import React, { createContext, useState, useContext } from 'react';

const PictureDictionaryContext = createContext();

export const usePictureDictionary = () => useContext(PictureDictionaryContext);

export const PictureDictionaryProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState('');

  const openModal = (word) => {
    setSelectedWord(word);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWord('');
  };

  const value = {
    isModalOpen,
    selectedWord,
    openModal,
    closeModal,
  };

  return (
    <PictureDictionaryContext.Provider value={value}>
      {children}
    </PictureDictionaryContext.Provider>
  );
};
