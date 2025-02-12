import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/styles.css';
import '../css/settings.css';

const Settings = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();
    const [workHours, setWorkHours] = useState([
        { day: 'Monday', start: '', end: '' },
        { day: 'Tuesday', start: '', end: '' },
        { day: 'Wednesday', start: '', end: '' },
        { day: 'Thursday', start: '', end: '' },
        { day: 'Friday', start: '', end: '' },
        { day: 'Saturday', start: '', end: '' },
        { day: 'Sunday', start: '', end: '' },
    ]);

    const handleWorkHoursChange = (index, field, value) => {
        const newWorkHours = [...workHours];
        newWorkHours[index][field] = value;
        setWorkHours(newWorkHours);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };


    return (
        <div className='settings-container'>
            <div className='centered-container'>
                <div className="settings-form">
                    <h1>Settings</h1>
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={handleNameChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                        />
                    </div>

                    {workHours.map((day, index) => (
                        <div key={day.day} className="form-group">
                            <label>{day.day}:</label>
                            <input
                                type="time"
                                value={day.start}
                                onChange={(e) => handleWorkHoursChange(index, 'start', e.target.value)}
                            />
                            <input
                                type="time"
                                value={day.end}
                                onChange={(e) => handleWorkHoursChange(index, 'end', e.target.value)}
                            />
                        </div>
                    ))}

                    <div className="form-group">
                        <label>Estimated Hours Worked Per Week:</label>
                        <p>
                            {workHours.reduce((total, day) => {
                                const start = day.start ? new Date(`1970-01-01T${day.start}:00`) : null;
                                const end = day.end ? new Date(`1970-01-01T${day.end}:00`) : null;
                                if (start && end) {
                                    const hours = (end - start) / (1000 * 60 * 60);
                                    return total + hours;
                                }
                                return total;
                            }, 0).toFixed(2)} hours
                        </p>
                    </div>
                </div>

                <button className="save-btn">Save</button>
                <button type="button" onClick={() => navigate(-1)} className="arrow backward-btn"></button>
            </div>
        </div>
    );
};

export default Settings;