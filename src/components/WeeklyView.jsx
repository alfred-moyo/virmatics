import React, { useState } from 'react';
import EventCard from './EventCard';
import { getMauritiusTime, isTodayInMauritius } from '../utils/timezone';
import './WeeklyView.css';

const WeeklyView = ({ 
  currentDate, 
  onEventClick,
  filteredEvents,
  onEventDrop,
  onTimeSlotClick 
}) => {
  const [draggedEvent, setDraggedEvent] = useState(null);
  const [dragOverInfo, setDragOverInfo] = useState(null);

  // Generate week dates
  const getWeekDates = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day; // Adjust to Sunday
    start.setDate(diff);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(start);
      weekDate.setDate(start.getDate() + i);
      weekDates.push(weekDate);
    }
    return weekDates;
  };

  const weekDates = getWeekDates(currentDate);
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const hours = Array.from({ length: 10 }, (_, i) => i + 8); // 8am to 5pm (8-17)

  const formatHour = (hour) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  };

  const getEventsForDay = (date) => {
    return filteredEvents.filter(event => 
      event.startTime.toDateString() === date.toDateString()
    );
  };

  const getEventsForHour = (date, hour) => {
    const dayEvents = getEventsForDay(date);
    return dayEvents.filter(event => {
      const eventHour = event.startTime.getHours();
      const eventEndHour = event.endTime.getHours();
      const eventEndMinute = event.endTime.getMinutes();
      
      return eventHour <= hour && (eventEndHour > hour || (eventEndHour === hour && eventEndMinute > 0));
    });
  };

  const getEventPosition = (event, hour) => {
    const eventStart = event.startTime;
    const eventEnd = event.endTime;
    
    let top = 0;
    let height = 60; // Default hour height

    if (eventStart.getHours() === hour) {
      top = (eventStart.getMinutes() / 60) * 60;
    }

    const eventDuration = (eventEnd - eventStart) / (1000 * 60); // Duration in minutes
    if (eventStart.getHours() === hour) {
      height = Math.min((eventDuration / 60) * 60, 60 - top);
    } else if (eventEnd.getHours() === hour) {
      height = (eventEnd.getMinutes() / 60) * 60;
    }

    return {
      top: `${top}px`,
      height: `${Math.max(height, 20)}px`
    };
  };

  const isToday = (date) => {
    return isTodayInMauritius(date);
  };

  const isCurrentHour = (hour) => {
    const now = getMauritiusTime();
    return now.getHours() === hour &&
           hour >= 8 && hour < 17; // Only within work hours
  };

  const getCurrentTimePosition = () => {
    const now = getMauritiusTime();
    const currentDayIndex = weekDates.findIndex(date => 
      isTodayInMauritius(date)
    );
    
    if (currentDayIndex === -1) return null;
    
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    // Only show current time indicator if within work hours (8am-5pm)
    if (hour < 8 || hour >= 17) {
      return null;
    }
    
    return {
      dayIndex: currentDayIndex,
      hour,
      position: (minute / 60) * 60
    };
  };

  const currentTime = getCurrentTimePosition();

  const handleDragStart = (e, event) => {
    setDraggedEvent(event);
    e.dataTransfer.setData('text/plain', JSON.stringify(event));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = (e) => {
    setDraggedEvent(null);
    setDragOverInfo(null);
  };

  const handleDragOver = (e, dayIndex, hour) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverInfo({ dayIndex, hour });
  };

  const handleDragLeave = (e) => {
    // Only clear if we're leaving the entire drop zone
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverInfo(null);
    }
  };

  const handleDrop = (e, dayIndex, hour) => {
    e.preventDefault();
    setDragOverInfo(null);
    
    if (!draggedEvent) return;

    const targetDate = weekDates[dayIndex];
    const newStartTime = new Date(targetDate);
    newStartTime.setHours(hour, 0, 0, 0);
    
    if (onEventDrop) {
      onEventDrop(draggedEvent, newStartTime);
    }
    
    setDraggedEvent(null);
  };

  const formatWeekRange = () => {
    const start = weekDates[0];
    const end = weekDates[6];
    
    const startStr = start.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    const endStr = end.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
    
    return `${startStr} - ${endStr}`;
  };

  return (
    <div className="weekly-view">
      <div className="weekly-header">
        <h2>Week of {formatWeekRange()}</h2>
        <div className="weekly-summary">
          <span className="event-count">
            {filteredEvents.filter(event => 
              weekDates.some(date => date.toDateString() === event.startTime.toDateString())
            ).length} events this week
          </span>
        </div>
      </div>

      <div className="week-grid">
        {/* Day columns */}
        {weekDates.map((date, dayIndex) => (
          <div key={dayIndex} className={`day-column ${isToday(date) ? 'today' : ''}`}>
            {/* Day header */}
            <div className="day-header">
              <div className="day-name">{dayNames[dayIndex]}</div>
              <div className={`day-number ${isToday(date) ? 'today' : ''}`}>
                {date.getDate()}
              </div>
              <div className="day-events-count">
                {getEventsForDay(date).length} events
              </div>
            </div>

            {/* Hour slots */}
            {hours.map(hour => {
              const hourEvents = getEventsForHour(date, hour);
              const isNow = isToday(date) && isCurrentHour(hour);
              const isDragOver = dragOverInfo?.dayIndex === dayIndex && dragOverInfo?.hour === hour;
              
              return (
                <div 
                  key={hour} 
                  className={`hour-slot ${isNow ? 'current-hour' : ''} ${isDragOver ? 'drag-over' : ''}`}
                  onDragOver={(e) => handleDragOver(e, dayIndex, hour)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, dayIndex, hour)}
                  onDoubleClick={() => onTimeSlotClick && onTimeSlotClick(date, hour)}
                  title="Double-click to add event"
                >
                  {/* Current time indicator */}
                  {currentTime && 
                   currentTime.dayIndex === dayIndex && 
                   currentTime.hour === hour && (
                    <div 
                      className="current-time-line"
                      style={{ top: `${currentTime.position}px` }}
                    >
                      <div className="time-line"></div>
                    </div>
                  )}

                  {/* Events for this hour */}
                  <div className="hour-events">
                    {hourEvents.map((event) => {
                      const position = getEventPosition(event, hour);
                      const isEventStart = event.startTime.getHours() === hour;
                      const isDragging = draggedEvent?.id === event.id;
                      
                      // Only render the event card at its start hour
                      if (isEventStart) {
                        return (
                          <div
                            key={event.id}
                            className={`positioned-event ${isDragging ? 'dragging' : ''}`}
                            style={position}
                          >
                            <EventCard
                              event={event}
                              view="week"
                              onClick={onEventClick}
                              isDraggable={true}
                              onDragStart={handleDragStart}
                              onDragEnd={handleDragEnd}
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
        ))}

        {/* Time column */}
        <div className="time-column">
          <div className="time-header"></div>
          {hours.map(hour => (
            <div key={hour} className="time-slot">
              <span className="time-label">{formatHour(hour)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Drag preview */}
      {draggedEvent && (
        <div className="drag-preview">
          <EventCard
            event={draggedEvent}
            view="week"
            isCompact={true}
          />
        </div>
      )}
    </div>
  );
};

export default WeeklyView;
