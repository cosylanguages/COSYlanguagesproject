import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarView.css';

function CalendarView({ data }) {
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      if (data[dateString]) {
        return 'highlight';
      }
    }
  };

  return (
    <div className="calendar-view-container">
      <h2>Your Progress Calendar</h2>
      <Calendar tileClassName={tileClassName} />
    </div>
  );
}

export default CalendarView;
