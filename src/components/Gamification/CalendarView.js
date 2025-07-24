// Import necessary libraries and components.
import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarView.css';

/**
 * A component that displays a calendar view of the user's progress.
 * It highlights the days on which the user has made progress.
 * @param {object} props - The component's props.
 * @param {object} props.data - An object where the keys are dates and the values are progress data.
 * @returns {JSX.Element} The CalendarView component.
 */
function CalendarView({ data }) {
  /**
   * A function that returns a class name for a calendar tile.
   * @param {object} param0 - The function's parameters.
   * @param {Date} param0.date - The date of the tile.
   * @param {string} param0.view - The current view of the calendar.
   * @returns {string|null} The class name for the tile, or null if no class should be applied.
   */
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      if (data[dateString]) {
        return 'highlight';
      }
    }
  };

  // Render the calendar view.
  return (
    <div className="calendar-view-container">
      <h2>Your Progress Calendar</h2>
      <Calendar tileClassName={tileClassName} />
    </div>
  );
}

export default CalendarView;
