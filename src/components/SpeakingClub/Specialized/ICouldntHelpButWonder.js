import React from 'react';
import ReactPlayer from 'react-player';

const ICouldntHelpButWonder = ({ content }) => {
  if (!content) return null;
  return (
    <div className="specialized-club-section">
      <h4>I Couldn't Help But Wonder</h4>
      {content.mediaClipUrl && (
        <ReactPlayer url={content.mediaClipUrl} controls width="100%" height="100%" />
      )}
      {content.advice && (
        <div>
          <h5>AI-Generated Advice</h5>
          <p>"{content.advice}"</p>
        </div>
      )}
    </div>
  );
};

export default ICouldntHelpButWonder;
