
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { getSubtitles } from '@suejon/youtube-subtitles';
import './SpeakingClub.css';

const SpeakingClub = ({ eventId }) => {
  const [event, setEvent] = useState(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [loop, setLoop] = useState(true);
  const [subtitles, setSubtitles] = useState([]);
  const [showSubtitles, setShowSubtitles] = useState(false);

  useEffect(() => {
    if (eventId) {
      axios.get(`/events/${eventId}`)
        .then(response => {
          setEvent(response.data);
          if (response.data.videoUrl) {
            const videoId = new URL(response.data.videoUrl).searchParams.get('v');
            getSubtitles({ videoId, lang: 'en' }).then(setSubtitles);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [eventId]);

  if (!event) {
    return <div>Chargement du club de parole...</div>;
  }

  const getVideoUrl = (url) => {
    // A simple proxy for youtube links
    return url.replace("youtube.com", "pense.pro");
  }

  return (
    <div className="speaking-club">
      <h3>{event.title}</h3>
      {event.videoUrl && (
        <div className="video-container">
          <h4>{event.videoTitle}</h4>
          <ReactPlayer
            url={getVideoUrl(event.videoUrl)}
            playing={playing}
            muted={muted}
            loop={loop}
            controls
            config={{
              file: {
                tracks: subtitles.map((sub, i) => ({
                  kind: 'subtitles',
                  src: `data:text/vtt,${encodeURIComponent(sub.text)}`,
                  srcLang: 'en',
                  default: i === 0,
                })),
              },
            }}
          />
          <div className="video-controls">
            <button onClick={() => setPlaying(!playing)}>{playing ? 'Pause' : 'Play'}</button>
            <button onClick={() => setMuted(!muted)}>{muted ? 'Unmute' : 'Mute'}</button>
            <button onClick={() => setLoop(!loop)}>{loop ? 'Disable Loop' : 'Enable Loop'}</button>
            <button onClick={() => setShowSubtitles(!showSubtitles)}>{showSubtitles ? 'Hide Subtitles' : 'Show Subtitles'}</button>
          </div>
          {showSubtitles && (
            <div className="subtitles">
              {subtitles.map((line, index) => (
                <p key={index}>{line.text}</p>
              ))}
            </div>
          )}
        </div>
      )}
      <div>
        <h4>Sujets</h4>
        <ul>
          {event.topics && event.topics.map((topic, index) => <li key={index}>{topic}</li>)}
        </ul>
      </div>
      <div>
        <h4>Discussion</h4>
        <p>{event.discussion}</p>
      </div>
      <div>
        <h4>Vocabulaire</h4>
        <ul>
          {event.vocabulary && event.vocabulary.map((word, index) => <li key={index}>{word}</li>)}
        </ul>
      </div>
      <div>
        <h4>Tour 1</h4>
        <p>{event.round1}</p>
      </div>
      <div>
        <h4>Tour 2</h4>
        <p>{event.round2}</p>
      </div>
    </div>
  );
};

export default SpeakingClub;
