import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Login from './Login';
import { AuthProvider } from '../../contexts/AuthContext';

console.log('Running Login.test.js');

test('renders login form', () => {
  console.log('Rendering login form');
  const { getByLabelText, getByText } = render(
    <MemoryRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </MemoryRouter>
  );

  expect(getByLabelText(/pin/i)).toBeInTheDocument();
  expect(getByText(/login/i)).toBeInTheDocument();
});

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate,
}));

test('redirects to freestyle mode with no PIN', async () => {
  console.log('Testing freestyle redirect');
  const { getByText } = render(
    <MemoryRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </MemoryRouter>
  );

  fireEvent.click(getByText(/login/i));

  await waitFor(() => {
    expect(mockedNavigate).toHaveBeenCalledWith('/freestyle');
  });
});

test('redirects to study mode with correct PIN', async () => {
  console.log('Testing study mode redirect');
  const { getByLabelText, getByText } = render(
    <MemoryRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </MemoryRouter>
  );

  fireEvent.change(getByLabelText(/pin/i), { target: { value: '1234' } });
  fireEvent.click(getByText(/login/i));

  await waitFor(() => {
    expect(mockedNavigate).toHaveBeenCalledWith('/study-islands.html');
  });
});
