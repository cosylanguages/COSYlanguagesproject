import React, { useState } from 'react';
import Calendar from 'react-calendar';
import TransliterableText from '../Common/TransliterableText';
import HelpModal from '../Common/HelpModal';
import './CalendarView.css';

const CalendarView = ({ data }) => {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().slice(0, 10);
      if (data[dateString]) {
        return `day-${data[dateString]}`;
      }
    }
  };

  return (
    <div className="calendar-view-container">
      <div className="calendar-view-header">
        <h2><TransliterableText text="Calendar View" /></h2>
        <button onClick={() => setIsHelpModalOpen(true)} className="help-button">?</button>
      </div>
      <div className="calendar-view-content">
        <Calendar tileClassName={tileClassName} />
      </div>
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        title="calendarView.help.title"
        content="calendarView.help.content"
      />
    </div>
  );
};

export default CalendarView;
