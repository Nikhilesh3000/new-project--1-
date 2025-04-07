import React, { useState } from 'react';
import './CalendarPanel.css';

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function CalendarPanel() {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState(null);
    const [tasks, setTasks] = useState({});
    const [newTask, setNewTask] = useState('');
    const [taskTime, setTaskTime] = useState('');
    const [isOpen, setIsOpen] = useState(false); // Slider state

    const togglePanel = () => setIsOpen(!isOpen);

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handleDateClick = (date) => setSelectedDate(date);

    const handleTaskChange = (e) => setNewTask(e.target.value);

    const handleTimeChange = (e) => setTaskTime(e.target.value);

    const addTask = () => {
        if (newTask.trim() && taskTime) {
            const key = `${selectedDate}-${currentMonth}-${currentYear}`;
            setTasks(prev => ({
                ...prev,
                [key]: [...(prev[key] || []), { task: newTask, time: taskTime, completed: false }]
            }));
            setNewTask('');
            setTaskTime('');
        }
    };

    const getTasksForDate = (date, month, year) => {
        const key = `${date}-${month}-${year}`;
        return tasks[key] || [];
    };

    const hasTasks = (date) => getTasksForDate(date, currentMonth, currentYear).length > 0;

    return (
        <div className={`calendar-container ${isOpen ? 'open' : 'closed'}`}>
            <button className="toggle-btn" onClick={togglePanel}>
                {isOpen ? '❌' : '📅'}
            </button>

            <div className="calendar-panel">
                <div className="calendar-header">
                    <button onClick={handlePrevMonth}>⮜</button>
                    <span>{monthNames[currentMonth]} {currentYear}</span>
                    <button onClick={handleNextMonth}>⮞</button>
                </div>

                <div className="calendar-grid">
                    {dayNames.map((day) => (
                        <div key={day} className="day-name">{day}</div>
                    ))}

                    {Array.from({ length: (firstDay === 0 ? 6 : firstDay - 1) }).map((_, i) => (
                        <div key={`empty-${i}`} className="empty-slot"></div>
                    ))}

                    {Array.from({ length: daysInMonth }, (_, i) => {
                        const date = i + 1;
                        return (
                            <div
                                key={date}
                                className={`date ${selectedDate === date ? 'selected' : ''}`}
                                onClick={() => handleDateClick(date)}
                            >
                                {date}
                                {hasTasks(date) && <span className="task-dot">•</span>}
                            </div>
                        );
                    })}
                </div>

                {selectedDate && (
                    <div className="task-section">
                        <h5>Tasks for {selectedDate} {monthNames[currentMonth]} {currentYear}</h5>
                        <input type="text" value={newTask} onChange={handleTaskChange} placeholder="Add a task..." />
                        <input type="time" value={taskTime} onChange={handleTimeChange} />
                        <button onClick={addTask}>➕</button>
                    </div>
                )}

                <div className="task-list-section">
                    {Object.keys(tasks).map((dateKey) => {
                        const [date, month, year] = dateKey.split('-');
                        return (
                            <div key={dateKey} className="task-group">
                                <h5 className="task-date">{date} {monthNames[parseInt(month)]} {year}</h5>
                                {tasks[dateKey].map((task, idx) => (
                                    <div key={idx} className="task-item">
                                        <span className={`task-text ${task.completed ? 'completed' : ''}`}>
                                            {task.task}
                                        </span>
                                        <span className="task-time">{task.time}</span>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default CalendarPanel;