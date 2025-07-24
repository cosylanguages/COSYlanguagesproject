// Import necessary libraries and components.
import React from 'react';
import MuiButton from '@mui/material/Button';

/**
 * A wrapper around the Material-UI Button component.
 * This allows for consistent styling and behavior across the application.
 * @param {object} props - The props to pass to the Material-UI Button component.
 * @returns {JSX.Element} The Button component.
 */
const Button = (props) => {
  return <MuiButton {...props} />;
};

export default Button;
