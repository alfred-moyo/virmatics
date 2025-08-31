import React from 'react';
import EventCard from './EventCard';
import { getEventsByDate } from '../data/sampleData';
import './DailyView.css';

const DailyView = ({ 
  currentDate, 
  onEventClick,
  filteredEvents,
  onEventDrop,
  onTimeSlotClick 
}) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const dayEvents = filteredEvents.filter(event => 
    event.startTime.toDateString() === currentDate.toDateString()
  );

  const formatHour = (hour) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  };

  const getEventsForHour = (hour) => {
    return dayEvents.filter(event => {
      const eventHour = event.startTime.getHours();
      const eventEndHour = event.endTime.getHours();
      const eventEndMinute = event.endTime.getMinutes();
      
      // Event overlaps with this hour
      return eventHour <= hour && (eventEndHour > hour || (eventEndHour === hour && eventEndMinute > 0));
    });
  };

  const getEventPosition = (event, hour) => {
    const eventStart = event.startTime;
    const eventEnd = event.endTime;
    const hourStart = new Date(currentDate);
    hourStart.setHours(hour, 0, 0, 0);
    const hourEnd = new Date(currentDate);
    hourEnd.setHours(hour + 1, 0, 0, 0);

    // Calculate position within the hour slot
    let top = 0;
    let height = 60; // Default hour height in minutes

    if (eventStart.getHours() === hour) {
      top = eventStart.getMinutes();
    }

    if (eventEnd <= hourEnd) {
      if (eventStart.getHours() === hour) {
        height = eventEnd.getMinutes() - eventStart.getMinutes();
      } else {
        height = eventEnd.getMinutes();
      }
    } else if (eventStart.getHours() === hour) {
      height = 60 - eventStart.getMinutes();
    }

    return {
      top: `${top}px`,
      height: `${Math.max(height, 20)}px`, // Minimum height of 20px
      minHeight: '20px'
    };
  };

  const formatDateTitle = () => {
    return currentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isCurrentHour = (hour) => {
    const now = new Date();
    return now.toDateString() === currentDate.toDateString() && 
           now.getHours() === hour;
  };

  const getCurrentTimePosition = () => {
    const now = new Date();
    if (now.toDateString() !== currentDate.toDateString()) {
      return null;
    }
    
    const hour = now.getHours();
    const minute = now.getMinutes();
    return {
      hour,
      position: minute
    };
  };

  const currentTime = getCurrentTimePosition();

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, hour) => {
    e.preventDefault();
    const eventData = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    // Calculate new time based on drop position
    const newStartTime = new Date(currentDate);
    newStartTime.setHours(hour, 0, 0, 0);
    
    if (onEventDrop) {
      onEventDrop(eventData, newStartTime);
    }
  };

  return (
    <div className="daily-view">
      <div className="daily-header">
        <h2>{formatDateTitle()}</h2>
        <div className="daily-summary">
          <span className="event-count">{dayEvents.length} events scheduled</span>
        </div>
      </div>

      <div className="time-grid">
        <div className="time-column">
          {hours.map(hour => (
            <div key={hour} className="time-slot">
              <span className="time-label">{formatHour(hour)}</span>
            </div>
          ))}
        </div>

        <div className="events-column">
          {hours.map(hour => {
            const hourEvents = getEventsForHour(hour);
            const isNow = isCurrentHour(hour);
            
            return (
              <div 
                key={hour} 
                className={`hour-slot ${isNow ? 'current-hour' : ''}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, hour)}
                onDoubleClick={() => onTimeSlotClick && onTimeSlotClick(currentDate, hour)}
                title="Double-click to add event"
              >
                {/* Current time indicator */}
                {currentTime && currentTime.hour === hour && (
                  <div 
                    className="current-time-line"
                    style={{ top: `${currentTime.position}px` }}
                  >
                    <div className="time-dot"></div>
                    <div className="time-line"></div>
                  </div>
                )}

                {/* Events for this hour */}
                <div className="hour-events">
                  {hourEvents.map((event, index) => {
                    const position = getEventPosition(event, hour);
                    const isEventStart = event.startTime.getHours() === hour;
                    
                    // Only render the event card at its start hour to avoid duplicates
                    if (isEventStart) {
                      return (
                        <div
                          key={event.id}
                          className="positioned-event"
                          style={position}
                        >
                          <EventCard
                            event={event}
                            view="day"
                            onClick={onEventClick}
                            isDraggable={true}
                            onDragStart={(e, eventData) => {
                              e.dataTransfer.setData('text/plain', JSON.stringify(eventData));
                            }}
                          />
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>

                {/* Hour divider */}
                <div className="hour-divider"></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* All-day events section */}
      {dayEvents.some(event => 
        event.startTime.getHours() === 0 && 
        event.endTime.getHours() === 23 && 
        event.endTime.getMinutes() === 59
      ) && (
        <div className="all-day-section">
          <h3>All Day</h3>
          <div className="all-day-events">
            {dayEvents
              .filter(event => 
                event.startTime.getHours() === 0 && 
                event.endTime.getHours() === 23 && 
                event.endTime.getMinutes() === 59
              )
              .map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  view="day"
                  onClick={onEventClick}
                />
              ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {dayEvents.length === 0 && (
        <div className="empty-day">
          <div className="empty-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="currentColor">
              <path d="M38 6H34V4C34 2.9 33.1 2 32 2C30.9 2 30 2.9 30 4V6H18V4C18 2.9 17.1 2 16 2C14.9 2 14 2.9 14 4V6H10C7.79 6 6.01 7.79 6.01 10L6 42C6 44.21 7.79 46 10 46H38C40.21 46 42 44.21 42 42V10C42 7.79 40.21 6 38 6ZM38 42H10V16H38V42ZM24 26C21.79 26 20 27.79 20 30C20 32.21 21.79 34 24 34C26.21 34 28 32.21 28 30C28 27.79 26.21 26 24 26Z"/>
            </svg>
          </div>
          <h3>No events scheduled</h3>
          <p>This day is free of scheduled telematics tasks.</p>
        </div>
      )}
    </div>
  );
};

export default DailyView;
