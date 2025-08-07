import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import TransliterableText from '../Common/TransliterableText';
import HelpModal from '../Common/HelpModal';
import './ProgressChart.css';

const ProgressChart = ({ data }) => {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  return (
    <div className="progress-chart-container">
      <div className="progress-chart-header">
        <h2><TransliterableText text="Progress Chart" /></h2>
        <button onClick={() => setIsHelpModalOpen(true)} className="help-button">?</button>
      </div>
      <div className="progress-chart-content">
        <Line data={data} />
      </div>
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        title="progressChart.help.title"
        content="progressChart.help.content"
      />
    </div>
  );
};

export default ProgressChart;
