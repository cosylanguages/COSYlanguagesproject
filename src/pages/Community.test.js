import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Community from './Community';
import { getEvents } from '../api/community';
import { I18nContext } from '../i18n/I18nContext';
import { AuthContext } from '../contexts/AuthContext';

jest.mock('../api/community');

const mockT = (key, fallback) => fallback || key;

const renderWithProviders = (ui, { authProviderProps, ...renderOptions } = {}) => {
  return render(
    <AuthContext.Provider value={authProviderProps}>
      <I18nContext.Provider value={{ t: mockT }}>
        {ui}
      </I18nContext.Provider>
    </AuthContext.Provider>,
    renderOptions
  );
};

describe('Community Page', () => {
  let authProviderProps;

  beforeEach(() => {
    authProviderProps = {
      currentUser: { username: 'testuser' },
    };
    getEvents.mockResolvedValue({ events: [], totalPages: 1 });
  });

  test('renders the community page title and filter buttons', () => {
    renderWithProviders(<Community />, { authProviderProps });
    expect(screen.getByText('Community')).toBeInTheDocument();
    expect(screen.getByText('Current Events')).toBeInTheDocument();
    expect(screen.getByText('Past Events')).toBeInTheDocument();
  });

  test('displays events when they are fetched successfully', async () => {
    const mockEvents = [
      { _id: '1', title: 'Event 1', description: 'Description 1', start: new Date().toISOString(), comments: [], likes: [] },
      { _id: '2', title: 'Event 2', description: 'Description 2', start: new Date().toISOString(), comments: [], likes: [] },
    ];
    getEvents.mockResolvedValue({ events: mockEvents, totalPages: 1 });

    renderWithProviders(<Community />, { authProviderProps });

    await waitFor(() => {
      expect(screen.getByText('Event 1')).toBeInTheDocument();
      expect(screen.getByText('Event 2')).toBeInTheDocument();
    });
  });

  test('displays a message when there are no events', async () => {
    getEvents.mockResolvedValue({ events: [], totalPages: 1 });

    renderWithProviders(<Community />, { authProviderProps });

    await waitFor(() => {
      expect(screen.getByText('No events to display.')).toBeInTheDocument();
    });
  });

  test('displays a loading message while fetching events', () => {
    getEvents.mockImplementation(() => new Promise(() => {})); // Never resolves

    renderWithProviders(<Community />, { authProviderProps });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays an error message if fetching events fails', async () => {
    getEvents.mockRejectedValue(new Error('Failed to fetch'));

    renderWithProviders(<Community />, { authProviderProps });

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch events.')).toBeInTheDocument();
    });
  });

  test('handles pagination correctly', async () => {
    getEvents.mockResolvedValue({ events: [], totalPages: 3 });

    renderWithProviders(<Community />, { authProviderProps });

    await waitFor(() => {
      expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
    });

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(getEvents).toHaveBeenCalledWith({ filter: 'current', page: 2, limit: 5 });
      expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
    });

    const previousButton = screen.getByText('Previous');
    fireEvent.click(previousButton);

    await waitFor(() => {
      expect(getEvents).toHaveBeenCalledWith({ filter: 'current', page: 1, limit: 5 });
      expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
    });
  });
});
