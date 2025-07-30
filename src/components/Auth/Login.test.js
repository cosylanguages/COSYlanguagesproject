import React from 'react';
import { render, fireEvent, waitFor } from '../../testUtils';
import { useNavigate } from 'react-router-dom';
import Login from './Login';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

jest.mock('../../contexts/AuthContext', () => ({
    useAuth: jest.fn(() => ({
        login: jest.fn(() => Promise.resolve(true)),
        signup: jest.fn(() => Promise.resolve(true)),
        loadingAuth: false,
        authError: null,
    })),
}));

describe('Login', () => {
  it('renders login form by default', () => {
    render(<Login />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByText('Need an account? Sign Up')).toBeInTheDocument();
  });

  it('switches to sign up form', () => {
    render(<Login />);
    fireEvent.click(screen.getByText('Need an account? Sign Up'));
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
    expect(screen.getByText('Already have an account? Login')).toBeInTheDocument();
  });

  it('calls login function on submit', async () => {
    const login = jest.fn(() => Promise.resolve(true));
    const { useAuth } = require('../../contexts/AuthContext');
    useAuth.mockReturnValueOnce({ login, signup: jest.fn(), loadingAuth: false, authError: null });

    render(<Login />);
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('testuser', 'password');
    });
  });

  it('calls signup function on submit', async () => {
    const signup = jest.fn(() => Promise.resolve(true));
    const { useAuth } = require('../../contexts/AuthContext');
    useAuth.mockReturnValueOnce({ login: jest.fn(), signup, loadingAuth: false, authError: null });

    render(<Login />);
    fireEvent.click(screen.getByText('Need an account? Sign Up'));
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'newuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'newpassword' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      expect(signup).toHaveBeenCalledWith('newuser', 'newpassword');
    });
  });
});
