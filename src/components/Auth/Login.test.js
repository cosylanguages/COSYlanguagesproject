import React from 'react';
import { render, fireEvent, waitFor } from '../../testUtils';
import { useNavigate } from 'react-router-dom';
import Login from './Login';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('Login', () => {
  it('renders login form', () => {
    render(<Login />);
    expect(screen.getByLabelText(/pin/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it('redirects to freestyle mode with no PIN', async () => {
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);
    const { getByText } = render(<Login />);
    fireEvent.click(getByText(/login/i));
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/freestyle');
    });
  });

  it('redirects to study mode with correct PIN', async () => {
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);
    const { getByLabelText, getByText } = render(<Login />);
    fireEvent.change(getByLabelText(/pin/i), { target: { value: '1234' } });
    fireEvent.click(getByText(/login/i));
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/study-islands.html');
    });
  });
});
