import React, { useState } from 'react';
import { staff, taskTypes } from '../data/sampleData';
import './CalendarSidebar.css';

const CalendarSidebar = ({ 
  currentDate, 
  onDateSelect, 
  filters, 
  onFiltersChange,
  isCollapsed,
  onToggleCollapse 
}) => {
  const [selectedMiniDate, setSelectedMiniDate] = useState(new Date(currentDate));

  // Generate mini calendar
  const generateMiniCalendar = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const miniCalendarDays = generateMiniCalendar(selectedMiniDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleMiniDateClick = (date) => {
    if (date) {
      onDateSelect(date);
    }
  };

  const navigateMiniCalendar = (direction) => {
    const newDate = new Date(selectedMiniDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedMiniDate(newDate);
  };

  const handleFilterChange = (filterType, value, checked) => {
    onFiltersChange(filterType, value, checked);
  };

  const isToday = (date) => {
    const today = new Date();
    return date && 
           date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date) => {
    return date && 
           date.getDate() === currentDate.getDate() &&
           date.getMonth() === currentDate.getMonth() &&
           date.getFullYear() === currentDate.getFullYear();
  };

  if (isCollapsed) {
    return (
      <div className="calendar-sidebar collapsed">
        <button 
          className="collapse-toggle"
          onClick={onToggleCollapse}
          aria-label="Expand sidebar"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5.293 3.293a1 1 0 0 1 1.414 0L10 6.586V4a1 1 0 1 1 2 0v5a1 1 0 0 1-1 1H6a1 1 0 1 1 0-2h2.586L5.293 4.707a1 1 0 0 1 0-1.414z"/>
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="calendar-sidebar">
      <div className="sidebar-header">
        <h3>Calendar</h3>
        <button 
          className="collapse-toggle"
          onClick={onToggleCollapse}
          aria-label="Collapse sidebar"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M10.707 3.293a1 1 0 0 1 0 1.414L7.414 8l3.293 3.293a1 1 0 1 1-1.414 1.414l-4-4a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0z"/>
          </svg>
        </button>
      </div>

      {/* Mini Calendar */}
      <div className="mini-calendar">
        <div className="mini-calendar-header">
          <button 
            className="mini-nav-btn"
            onClick={() => navigateMiniCalendar(-1)}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M7.5 2L6 3.5L8.5 6L6 8.5L7.5 10L11 6L7.5 2Z"/>
            </svg>
          </button>
          <span className="mini-month-year">
            {monthNames[selectedMiniDate.getMonth()]} {selectedMiniDate.getFullYear()}
          </span>
          <button 
            className="mini-nav-btn"
            onClick={() => navigateMiniCalendar(1)}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M4.5 2L6 3.5L3.5 6L6 8.5L4.5 10L1 6L4.5 2Z"/>
            </svg>
          </button>
        </div>

        <div className="mini-calendar-grid">
          <div className="mini-weekdays">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div key={index} className="mini-weekday">{day}</div>
            ))}
          </div>
          
          <div className="mini-days">
            {miniCalendarDays.map((date, index) => (
              <button
                key={index}
                className={`mini-day ${!date ? 'empty' : ''} ${
                  isToday(date) ? 'today' : ''
                } ${isSelected(date) ? 'selected' : ''}`}
                onClick={() => handleMiniDateClick(date)}
                disabled={!date}
              >
                {date ? date.getDate() : ''}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <h4>Filters</h4>
        
        {/* Task Type Filters */}
        <div className="filter-group">
          <h5>Task Types</h5>
          {Object.entries(taskTypes).map(([key, type]) => (
            <label key={key} className="filter-item">
              <input
                type="checkbox"
                checked={filters.taskTypes.includes(key)}
                onChange={(e) => handleFilterChange('taskTypes', key, e.target.checked)}
              />
              <span 
                className="filter-color-indicator"
                style={{ backgroundColor: type.color }}
              ></span>
              <span className="filter-label">{type.label}</span>
            </label>
          ))}
        </div>

        {/* Staff Filters */}
        <div className="filter-group">
          <h5>Staff</h5>
          {staff.map((person) => (
            <label key={person.id} className="filter-item">
              <input
                type="checkbox"
                checked={filters.staff.includes(person.id)}
                onChange={(e) => handleFilterChange('staff', person.id, e.target.checked)}
              />
              <span 
                className="filter-color-indicator"
                style={{ backgroundColor: person.color }}
              ></span>
              <span className="filter-label">{person.name}</span>
              <span className="filter-role">{person.role}</span>
            </label>
          ))}
        </div>

        {/* Priority Filters */}
        <div className="filter-group">
          <h5>Priority</h5>
          {[
            { key: 'urgent', label: 'Urgent', color: '#EF4444' },
            { key: 'high', label: 'High', color: '#F59E0B' },
            { key: 'medium', label: 'Medium', color: '#10B981' },
            { key: 'low', label: 'Low', color: '#6B7280' }
          ].map((priority) => (
            <label key={priority.key} className="filter-item">
              <input
                type="checkbox"
                checked={filters.priorities.includes(priority.key)}
                onChange={(e) => handleFilterChange('priorities', priority.key, e.target.checked)}
              />
              <span 
                className="filter-color-indicator"
                style={{ backgroundColor: priority.color }}
              ></span>
              <span className="filter-label">{priority.label}</span>
            </label>
          ))}
        </div>

        {/* Clear Filters */}
        <button 
          className="clear-filters-btn"
          onClick={() => onFiltersChange('clear')}
        >
          Clear All Filters
        </button>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <h4>Quick Stats</h4>
        <div className="stat-item">
          <span className="stat-label">Today's Tasks</span>
          <span className="stat-value">5</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">This Week</span>
          <span className="stat-value">23</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Urgent</span>
          <span className="stat-value urgent">3</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarSidebar;
