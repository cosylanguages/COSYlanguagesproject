import React from 'react';
import PropTypes from 'prop-types';

// No separate CSS file for Label is needed if all styling is handled by 'unified-label' in index.css

const Label = ({ htmlFor, children, className = '', ...props }) => {
  const combinedClassName = `unified-label ${className}`.trim();

  return (
    <label htmlFor={htmlFor} className={combinedClassName} {...props}>
      {children}
    </label>
  );
};

Label.propTypes = {
  htmlFor: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Label;
