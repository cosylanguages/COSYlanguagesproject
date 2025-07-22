import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import LandingPage from './LandingPage';

test('renders landing page with welcome message and buttons', () => {
  render(
    <Router>
      <LandingPage />
    </Router>
  );

  expect(screen.getByText(/Welcome to COSYlanguages/i)).toBeInTheDocument();
  expect(screen.getByText(/Your journey to language mastery starts here./i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Start a Lesson/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Create an Account \/ Login/i })).toBeInTheDocument();
});
