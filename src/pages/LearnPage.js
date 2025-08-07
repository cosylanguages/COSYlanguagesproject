// src/pages/LearnPage.js
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './LearnPage.css';

const learnSections = [
  {
    title: 'Study Mode',
    description: 'Follow a structured learning path with lessons and quizzes.',
    link: '/learn/study',
  },
  {
    title: 'Personalize',
    description: 'Customize your learning plan to focus on what matters most to you.',
    link: '/learn/personalize',
  },
  {
    title: 'Interactive Exercises',
    description: 'Practice your skills with a variety of engaging exercises.',
    link: '/learn/interactive',
  },
  {
    title: 'Study Tools',
    description: 'Access flashcards, grammar guides, and other helpful tools.',
    link: '/learn/study-tools',
  },
  {
    title: 'Dictionary',
    description: 'Look up words and phrases in our comprehensive dictionary.',
    link: '/learn/dictionary',
  },
  {
    title: 'Review',
    description: 'Review what you have learned to reinforce your knowledge.',
    link: '/learn/review',
  },
  {
    title: 'Learned Words',
    description: 'See a list of all the words you have learned.',
    link: '/learn/learned-words',
  },
  {
    title: 'Conversation',
    description: 'Practice your conversation skills with our AI tutor.',
    link: '/learn/conversation',
  },
];

const LearnPage = () => {
  return (
    <div className="learn-page">
      <h1>Learn</h1>
      <div className="learn-sections">
        {learnSections.map((section) => (
          <Link to={section.link} key={section.title} className="learn-section-card">
            <h2>{section.title}</h2>
            <p>{section.description}</p>
          </Link>
        ))}
      </div>
      <Outlet />
    </div>
  );
};

export default LearnPage;
