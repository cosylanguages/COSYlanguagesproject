import React, { useState } from 'react';
import './VirtualTutorTeacherView.css';

const VirtualTutorTeacherView = () => {
    const [availability, setAvailability] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const handleAddAvailability = () => {
        if (startTime && endTime) {
            setAvailability([...availability, { date: selectedDate, startTime, endTime }]);
            setStartTime('');
            setEndTime('');
        }
    };

    return (
        <div className="virtual-tutor-teacher-view">
            <h2>Manage Virtual Tutor Availability</h2>
            <div className="availability-form">
                <input
                    type="date"
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                />
                <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                />
                <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                />
                <button onClick={handleAddAvailability}>Add Availability</button>
            </div>
            <div className="availability-list">
                <h3>Your Availability</h3>
                <ul>
                    {availability.map((slot, index) => (
                        <li key={index}>
                            {slot.date.toLocaleDateString()}: {slot.startTime} - {slot.endTime}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default VirtualTutorTeacherView;
