import React from 'react';
import EventCard from './EventCard';
import './MonthlyView.css';

const MonthlyView = ({ 
  currentDate, 
  onEventClick,
  filteredEvents,
  onDateSelect,
  onTimeSlotClick 
}) => {
  // Generate calendar grid
  const generateCalendarGrid = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];
    
    // Add days from previous month
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(year, month - 1, prevMonth.getDate() - i);
      days.push({ date: day, isCurrentMonth: false });
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ date, isCurrentMonth: true });
    }
    
    // Add days from next month to complete the grid (6 weeks = 42 days)
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({ date, isCurrentMonth: false });
    }

    return days;
  };

  const calendarDays = generateCalendarGrid(currentDate);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventsForDay = (date) => {
    return filteredEvents.filter(event => 
      event.startTime.toDateString() === date.toDateString()
    );
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelectedDate = (date) => {
    return date.toDateString() === currentDate.toDateString();
  };

  const formatMonthYear = () => {
    return currentDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const getTotalEventsInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return filteredEvents.filter(event => 
      event.startTime.getFullYear() === year && 
      event.startTime.getMonth() === month
    ).length;
  };

  const handleDayClick = (date) => {
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const handleDayDoubleClick = (date) => {
    if (onTimeSlotClick) {
      onTimeSlotClick(date);
    }
  };

  const getEventsByType = (dayEvents) => {
    const typeCount = {};
    dayEvents.forEach(event => {
      typeCount[event.type] = (typeCount[event.type] || 0) + 1;
    });
    return typeCount;
  };

  const renderEventIndicators = (dayEvents) => {
    if (dayEvents.length === 0) return null;

    const maxVisible = 3;
    const visibleEvents = dayEvents.slice(0, maxVisible);
    const remainingCount = dayEvents.length - maxVisible;

    return (
      <div className="event-indicators">
        {visibleEvents.map((event, index) => (
          <EventCard
            key={event.id}
            event={event}
            view="month"
            isCompact={true}
            onClick={onEventClick}
          />
        ))}
        {remainingCount > 0 && (
          <div className="more-events">
            +{remainingCount} more
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="monthly-view">
      <div className="monthly-header">
        <h2>{formatMonthYear()}</h2>
        <div className="monthly-summary">
          <span className="event-count">
            {getTotalEventsInMonth()} events this month
          </span>
        </div>
      </div>

      <div className="calendar-grid">
        {/* Day headers */}
        <div className="day-headers">
          {dayNames.map(day => (
            <div key={day} className="day-header">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="calendar-days">
          {calendarDays.map(({ date, isCurrentMonth }, index) => {
            const dayEvents = getEventsForDay(date);
            const today = isToday(date);
            const selected = isSelectedDate(date);
            
            return (
              <div
                key={index}
                className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${
                  today ? 'today' : ''
                } ${selected ? 'selected' : ''}`}
                onClick={() => handleDayClick(date)}
                onDoubleClick={() => handleDayDoubleClick(date)}
                title="Double-click to add event"
              >
                <div className="day-content">
                  <div className="day-number">
                    {date.getDate()}
                  </div>
                  
                  {isCurrentMonth && dayEvents.length > 0 && (
                    <div className="events-container">
                      {renderEventIndicators(dayEvents)}
                    </div>
                  )}
                  
                  {/* Event type indicators */}
                  {isCurrentMonth && dayEvents.length > 0 && (
                    <div className="event-type-dots">
                      {Object.entries(getEventsByType(dayEvents)).map(([type, count]) => (
                        <div
                          key={type}
                          className={`event-dot ${type}`}
                          title={`${count} ${type} events`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly statistics */}
      <div className="monthly-stats">
        <h3>Month Overview</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">
              {filteredEvents.filter(event => 
                event.startTime.getMonth() === currentDate.getMonth() &&
                event.startTime.getFullYear() === currentDate.getFullYear() &&
                event.type === 'installation'
              ).length}
            </div>
            <div className="stat-label">Installations</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">
              {filteredEvents.filter(event => 
                event.startTime.getMonth() === currentDate.getMonth() &&
                event.startTime.getFullYear() === currentDate.getFullYear() &&
                event.type === 'maintenance'
              ).length}
            </div>
            <div className="stat-label">Maintenance</div>
          </div>
          
          <div className="stat-card urgent">
            <div className="stat-number">
              {filteredEvents.filter(event => 
                event.startTime.getMonth() === currentDate.getMonth() &&
                event.startTime.getFullYear() === currentDate.getFullYear() &&
                event.priority === 'urgent'
              ).length}
            </div>
            <div className="stat-label">Urgent Tasks</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">
              {new Set(filteredEvents
                .filter(event => 
                  event.startTime.getMonth() === currentDate.getMonth() &&
                  event.startTime.getFullYear() === currentDate.getFullYear()
                )
                .map(event => event.assignedStaff.id)
              ).size}
            </div>
            <div className="stat-label">Active Staff</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="month-legend">
        <h4>Task Types</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-dot installation"></div>
            <span>Installation</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot intervention"></div>
            <span>Intervention</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot maintenance"></div>
            <span>Maintenance</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot inspection"></div>
            <span>Inspection</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot training"></div>
            <span>Training</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot delivery"></div>
            <span>Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyView;
