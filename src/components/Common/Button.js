import React from 'react';
import PropTypes from 'prop-types';
import './Button.css'; // We'll create this for styles not covered by index.css

const Button = ({
  children,
  onClick,
  variant = 'default', // 'default', 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'link'
  size = 'md', // 'sm', 'md', 'lg'
  type = 'button',
  disabled = false,
  className = '',
  title = '',
  ariaLabel = '',
  ...props // To pass any other native button attributes
}) => {
  // Base class
  let baseClasses = 'btn';

  // Variant classes from index.css (or Button.css for more specific ones)
  const variantClasses = {
    default: '', // Will use .btn base style
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    danger: 'btn-danger',
    warning: 'btn-warning',
    info: 'btn-info',
    // Assuming you might add these to index.css or Button.css if needed
    light: 'btn-light',
    dark: 'btn-dark',
    link: 'btn-link',
  };

  if (variantClasses[variant]) {
    baseClasses += ` ${variantClasses[variant]}`;
  }

  // Size classes (assuming you might add btn-sm, btn-lg to index.css or Button.css)
  const sizeClasses = {
    sm: 'btn-sm',
    md: '', // Default size, no extra class needed if .btn is md by default
    lg: 'btn-lg',
  };

  if (sizeClasses[size]) {
    baseClasses += ` ${sizeClasses[size]}`;
  }

  // Combine with any additional classes passed via props
  const combinedClassName = `${baseClasses} ${className}`.trim();

  return (
    <button
      type={type}
      className={combinedClassName}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel || (typeof children === 'string' ? children : title)} // Basic accessibility for aria-label
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf([
    'default', 'primary', 'secondary', 'success', 'danger',
    'warning', 'info', 'light', 'dark', 'link'
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  type: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  title: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default Button;
