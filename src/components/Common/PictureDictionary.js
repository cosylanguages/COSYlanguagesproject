import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';
import { useI18n } from '../../i18n/I18nContext';
import { pronounceText } from '../../utils/speechUtils';
import './PictureDictionary.css';

const PEXELS_API_KEY = 'lRLDPNzJP56ztCcj5eRtDPQSoh0sx3lQy0iU5TODtHRK1I85PgG6bmpS';

const PictureDictionary = ({ word, onClose }) => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useI18n();

  useEffect(() => {
    if (!word) return;

    const fetchImages = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://api.pexels.com/v1/search?query=${word}&per_page=9`,
          {
            headers: {
              Authorization: PEXELS_API_KEY,
            },
          }
        );
        setImages(response.data.photos);
      } catch (error) {
        console.error('Error fetching images from Pexels:', error);
      }
      setIsLoading(false);
    };

    fetchImages();
  }, [word]);

  return (
    <Modal isOpen={!!word} onClose={onClose}>
      <div className="picture-dictionary">
        <h3>
          {word}
          <button
            onClick={() => pronounceText(word, language)}
            className="btn-icon pronounce-btn-inline"
          >🔊</button>
        </h3>
        {isLoading ? (
          <p>Loading images...</p>
        ) : (
          <div className="image-grid">
            {images.map((image) => (
              <img key={image.id} src={image.src.small} alt={image.photographer} />
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PictureDictionary;
