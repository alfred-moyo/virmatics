import React from 'react';
import './CalendarHeader.css';

const CalendarHeader = ({ 
  currentDate, 
  view, 
  onViewChange, 
  onNavigate, 
  onToday,
  onSearch,
  searchTerm,
  isDarkMode,
  onToggleDarkMode,
  onAddEvent
}) => {
  const formatDateTitle = () => {
    const options = { 
      year: 'numeric', 
      month: 'long',
      ...(view === 'day' && { day: 'numeric' })
    };
    return currentDate.toLocaleDateString('en-US', options);
  };

  const views = [
    { key: 'day', label: 'Day' },
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'timeline', label: 'Timeline' }
  ];

  return (
    <header className="calendar-header">
      <div className="header-left">
        <div className="company-brand">
          <h1>Virmatics</h1>
          <span>Fleet Management Calendar</span>
        </div>
        
        <div className="navigation-controls">
          <button 
            className="today-btn"
            onClick={onToday}
          >
            Today
          </button>
          
          <div className="nav-arrows">
            <button 
              className="nav-btn"
              onClick={() => onNavigate('prev')}
              aria-label="Previous period"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M10.707 3.293a1 1 0 0 1 0 1.414L7.414 8l3.293 3.293a1 1 0 1 1-1.414 1.414l-4-4a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0z"/>
              </svg>
            </button>
            <button 
              className="nav-btn"
              onClick={() => onNavigate('next')}
              aria-label="Next period"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M5.293 3.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 1 1-1.414-1.414L8.586 8 5.293 4.707a1 1 0 0 1 0-1.414z"/>
              </svg>
            </button>
          </div>
          
          <h2 className="date-title">{formatDateTitle()}</h2>
        </div>
      </div>

      <div className="header-center">
        <div className="search-container">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
          <input
            type="text"
            placeholder="Search events, staff, vehicles..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="header-right">
        <button 
          className="add-event-btn"
          onClick={onAddEvent}
          aria-label="Add new event"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z"/>
          </svg>
          Add Event
        </button>

        <div className="view-selector">
          {views.map(({ key, label }) => (
            <button
              key={key}
              className={`view-btn ${view === key ? 'active' : ''}`}
              onClick={() => onViewChange(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <button 
          className="theme-toggle"
          onClick={onToggleDarkMode}
          aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        >
          {isDarkMode ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L2.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
            </svg>
          )}
        </button>
      </div>
    </header>
  );
};

export default CalendarHeader;
