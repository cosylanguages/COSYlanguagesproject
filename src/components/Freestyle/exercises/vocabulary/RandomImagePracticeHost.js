// src/components/Freestyle/exercises/vocabulary/RandomImagePracticeHost.js
import React, { useState, useEffect, useCallback } from 'react';
import { loadImageData } from '../../../../utils/exerciseDataService';
import IdentifyImageMode from './IdentifyImageMode';
// Future: import MultipleChoiceImageMode from './MultipleChoiceImageMode';

const IMAGE_EXERCISE_MODES = ['identify']; // Add more modes like 'multiple-choice-name', 'name-multiple-choice-image'

const RandomImagePracticeHost = ({ language, days, exerciseKey }) => {
  const [allImages, setAllImages] = useState([]);
  const [currentImageObject, setCurrentImageObject] = useState(null);
  const [currentMode, setCurrentMode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [internalKey, setInternalKey] = useState(0); // For re-triggering child mode component

  const selectNextImageExercise = useCallback(() => {
    if (allImages.length === 0) {
      setError("No images loaded to select from.");
      setCurrentImageObject(null);
      return;
    }

    const randomImageIndex = Math.floor(Math.random() * allImages.length);
    const nextImage = allImages[randomImageIndex];
    setCurrentImageObject(nextImage);

    const randomModeIndex = Math.floor(Math.random() * IMAGE_EXERCISE_MODES.length);
    setCurrentMode(IMAGE_EXERCISE_MODES[randomModeIndex]);
    
    setInternalKey(prevKey => prevKey + 1);
    console.log("RandomImagePracticeHost: Next image selected", nextImage, "Mode:", IMAGE_EXERCISE_MODES[randomModeIndex]);
  }, [allImages]);

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      setError(null);
      setCurrentImageObject(null);
      try {
        const formattedDays = Array.isArray(days) ? days.map(String) : [String(days)];
        const { data, error: fetchError } = await loadImageData(language, formattedDays);
        if (fetchError) {
          throw new Error(fetchError.message || fetchError);
        }
        if (data && data.length > 0) {
          // Filter out images that might not have a translation for the current language, if necessary
          const validImages = data.filter(img => img.translations && img.translations[language]);
          if (validImages.length > 0) {
            setAllImages(validImages);
          } else {
            setAllImages([]);
            setError('No images with translations found for the selected criteria.');
          }
        } else {
          setAllImages([]);
          setError('No image data found for the selected criteria.');
        }
      } catch (err) {
        console.error("Error loading image data:", err);
        setError(err.message || 'Failed to load images.');
        setAllImages([]);
      }
      setIsLoading(false);
    };

    if (language && days && days.length > 0) {
      fetchImages();
    }
  }, [language, days, exerciseKey]);

  useEffect(() => {
    if (!isLoading && allImages.length > 0) {
      selectNextImageExercise();
    } else if (!isLoading && allImages.length === 0 && !error) {
      setError('No image data available for the selected criteria.');
    }
  }, [allImages, isLoading, selectNextImageExercise, error]);

  const handleExerciseDone = (isCorrect) => {
    console.log(`RandomImagePracticeHost: Image exercise done. Correct: ${isCorrect}. Selecting next.`);
    // Here you could add logic for spaced repetition or scoring based on isCorrect
    selectNextImageExercise();
  };

  if (isLoading) {
    return <p>Loading random image exercise...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!currentImageObject || !currentMode) {
    return <p>No image exercise available. Try adjusting selections or check data sources.</p>;
  }

  return (
    <div>
      {currentMode === 'identify' && currentImageObject && (
        <IdentifyImageMode
          key={internalKey} // Use key to force re-mount with new image/mode
          imageObject={currentImageObject}
          language={language}
          onDone={handleExerciseDone}
          exerciseKeyInternal={internalKey} // Pass internalKey to reset child state if needed
        />
      )}
      {/* Placeholder for other modes */}
      {/* {currentMode === 'multiple-choice-name' && currentImageObject && (
        <MultipleChoiceImageMode imageObject={currentImageObject} language={language} onDone={handleExerciseDone} />
      )} */}
    </div>
  );
};

export default RandomImagePracticeHost;
