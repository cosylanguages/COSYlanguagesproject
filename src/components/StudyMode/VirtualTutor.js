import React, { useState } from 'react';
import './VirtualTutor.css';

const VirtualTutor = () => {
    const [sessions, setSessions] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('');

    const handleSchedule = () => {
        if (selectedTime) {
            setSessions([...sessions, { date: selectedDate, time: selectedTime }]);
            setSelectedTime('');
        }
    };

    return (
        <div className="virtual-tutor">
            <h2>Virtual Tutor Sessions</h2>
            <div className="scheduler">
                <input
                    type="date"
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                />
                <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                />
                <button onClick={handleSchedule}>Schedule</button>
            </div>
            <div className="sessions-list">
                <h3>Upcoming Sessions</h3>
                <ul>
                    {sessions.map((session, index) => (
                        <li key={index}>
                            {session.date.toLocaleDateString()} at {session.time}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default VirtualTutor;
