import React, { useState, useEffect } from 'react';
import axios from 'axios';
import specializedComponents from './SpeakingClub/Specialized';

import './SpeakingClub.css';

// --- Placeholder Sub-components ---

const ClubHeader = ({ title, level, inspiringMaterial, description, topics }) => (
  <div className="club-header-section">
    <div className="club-title">
      <h2>{title}</h2>
      <span className={`level-badge ${level?.toLowerCase()}`}>{level}</span>
    </div>
    {inspiringMaterial?.link && (
      <div className="inspiring-material">
        <a href={inspiringMaterial.link} target="_blank" rel="noopener noreferrer">
          <img src={inspiringMaterial.thumbnail} alt={inspiringMaterial.title || "Inspiring material preview"} />
          <span>Inspiring Material</span>
        </a>
      </div>
    )}
    <p className="session-description">{description}</p>
    <div className="topics-covered">
      <h4>Topics Covered</h4>
      <ul>
        {topics?.map((topic, index) => <li key={index}>{topic}</li>)}
      </ul>
    </div>
  </div>
);

const VocabularyBank = ({ vocabulary }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="vocabulary-bank-section">
      <h3 onClick={() => setExpanded(!expanded)}>
        Vocabulary Bank {expanded ? '▲' : '▼'}
      </h3>
      {expanded && (
        <ul>
          {vocabulary?.map((item, index) => (
            <li key={index}>
              <strong>{item.word}</strong>
              <button onClick={() => new Audio(item.pronunciation).play()}>🔊</button>
              <button className="add-to-dict-btn">+</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const TeacherTools = () => {
    const [visible, setVisible] = useState(false);
    return (
      <div className="teacher-tools-section">
        <h3 onClick={() => setVisible(!visible)}>
          Teacher Tools {visible ? '▲' : '▼'}
        </h3>
        {visible && (
          <div className="tools-content">
            <button>Download Session PDF</button>
            <button>View Analytics</button>
            <button>Export Vocabulary</button>
          </div>
        )}
      </div>
    );
  };

const TeacherNotes = ({ notes }) => {
  const [visible, setVisible] = useState(false);
  if (!notes) return null;
  return (
    <div className="teacher-notes-section">
      <h3 onClick={() => setVisible(!visible)}>
        Teacher Notes {visible ? '▲' : '▼'}
      </h3>
      {visible && (
        <div className="notes-content">
          <h4>Discussion Tips</h4>
          <p>{notes.discussionTips}</p>
          <h4>Common Pitfalls</h4>
          <p>{notes.commonPitfalls}</p>
          <h4>Cultural Context</h4>
          <p>{notes.culturalContext}</p>
        </div>
      )}
    </div>
  );
};

const SessionRound = ({ round }) => {
    if (!round) return null;
    return (
      <div className="session-round">
        <h4>{round.title}</h4>
        <ul>
          {round.questions?.map((q, i) => (
            <li key={i}>
              <span className="question-difficulty">{q.difficulty}</span>
              {q.text}
            </li>
          ))}
        </ul>
      </div>
    );
  };

const MiniBreak = ({ miniBreak }) => {
  if (!miniBreak) return null;
  return (
    <div className="mini-break-section">
      <h4>Mini-Break</h4>
      <p><strong>Fun Fact:</strong> {miniBreak.funFact}</p>
      <p><strong>Tongue Twister:</strong> {miniBreak.tongueTwister}</p>
      {miniBreak.memeUrl && <img src={miniBreak.memeUrl} alt={miniBreak.memeDescription || "Relevant meme"} />}
    </div>
  );
};

const ClosingSection = ({ closing }) => {
  if (!closing) return null;
  return (
    <div className="closing-section">
      <h3>Key Takeaways</h3>
      <ul>
        {closing.keyTakeaways?.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
      <h3>Continue Exploring</h3>
      <ul>
        {closing.continueExploring?.map((item, i) => (
          <li key={i}><a href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a></li>
        ))}
      </ul>
      <div className="feedback-prompt">
        <p>How was this session? 👍 👎</p>
        <textarea placeholder="Your feedback..."></textarea>
      </div>
    </div>
  );
};


// --- Main SpeakingClub Component ---

const SpeakingClub = ({ eventId }) => {
  const [event, setEvent] = useState(null);
  const [dailyQuote, setDailyQuote] = useState(null);

  useEffect(() => {
    if (eventId) {
      axios.get(`/api/events/${eventId}`) // Assuming API is prefixed
        .then(response => {
          const eventData = response.data;
          setEvent(eventData);
          if (eventData.clubType === 'The Greatest Quotes') {
            axios.get('/api/quotes/daily')
              .then(response => {
                setDailyQuote(response.data);
              })
              .catch(error => {
                console.error("Failed to fetch daily quote:", error);
              });
          }
        })
        .catch(error => {
          console.error("Failed to fetch event:", error);
        });
    }
  }, [eventId]);

  if (!event) {
    return <div>Loading Speaking Club...</div>;
  }

  const SpecializedComponent = specializedComponents[event.clubType];

  return (
    <div className="speaking-club">
      <ClubHeader
        title={event.title}
        level={event.level}
        inspiringMaterial={event.inspiringMaterial}
        description={event.description}
        topics={event.topics}
      />
      <div className="pre-session-prep">
        <VocabularyBank vocabulary={event.vocabularyBank} />
        <TeacherNotes notes={event.teacherNotes} />
        <TeacherTools />
      </div>
      <div className="session-flow">
        <h3>Session Flow</h3>
        <SessionRound round={event.sessionFlow?.round1} />
        <MiniBreak miniBreak={event.sessionFlow?.miniBreak} />
        <SessionRound round={event.sessionFlow?.round2} />
        {SpecializedComponent && <SpecializedComponent content={event.specializedContent} dailyQuote={dailyQuote} />}
      </div>
      <ClosingSection closing={event.closingSection} />
    </div>
  );
};

export default SpeakingClub;
