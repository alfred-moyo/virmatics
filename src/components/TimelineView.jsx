import React, { useState, useRef, useEffect } from 'react';
import EventCard from './EventCard';
import { staff, taskTypes } from '../data/sampleData';
import './TimelineView.css';

const TimelineView = ({ 
  currentDate, 
  onEventClick,
  filteredEvents,
  onEventDrop 
}) => {
  const [timelineRange, setTimelineRange] = useState(7); // days
  const [scrollPosition, setScrollPosition] = useState(0);
  const timelineRef = useRef(null);

  // Generate timeline dates
  const getTimelineDates = () => {
    const dates = [];
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - Math.floor(timelineRange / 2));
    
    for (let i = 0; i < timelineRange; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const timelineDates = getTimelineDates();
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const formatHour = (hour) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getEventsForStaffAndTime = (staffMember, date, hour) => {
    return filteredEvents.filter(event => 
      event.assignedStaff.id === staffMember.id &&
      event.startTime.toDateString() === date.toDateString() &&
      event.startTime.getHours() <= hour &&
      event.endTime.getHours() > hour
    );
  };

  const getEventPosition = (event, hour) => {
    const eventStart = event.startTime;
    const eventEnd = event.endTime;
    const eventDuration = (eventEnd - eventStart) / (1000 * 60); // minutes
    
    let left = 0;
    let width = 60; // Default hour width in minutes

    if (eventStart.getHours() === hour) {
      left = eventStart.getMinutes();
      width = Math.min(eventDuration, 60 - eventStart.getMinutes());
    } else if (eventEnd.getHours() === hour) {
      width = eventEnd.getMinutes();
    } else {
      // Event spans the entire hour
      width = 60;
    }

    return {
      left: `${(left / 60) * 100}%`,
      width: `${(width / 60) * 100}%`,
      minWidth: '20px'
    };
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getCurrentTimePosition = () => {
    const now = new Date();
    const todayIndex = timelineDates.findIndex(date => 
      date.toDateString() === now.toDateString()
    );
    
    if (todayIndex === -1) return null;
    
    const hour = now.getHours();
    const minute = now.getMinutes();
    return {
      dateIndex: todayIndex,
      hour,
      position: (minute / 60) * 100
    };
  };

  const currentTime = getCurrentTimePosition();

  const handleTimelineScroll = (direction) => {
    const scrollAmount = 200;
    const newPosition = scrollPosition + (direction === 'left' ? -scrollAmount : scrollAmount);
    
    if (timelineRef.current) {
      timelineRef.current.scrollLeft = Math.max(0, newPosition);
      setScrollPosition(Math.max(0, newPosition));
    }
  };

  const handleRangeChange = (newRange) => {
    setTimelineRange(parseInt(newRange));
  };

  const getStaffWorkload = (staffMember) => {
    const staffEvents = filteredEvents.filter(event => 
      event.assignedStaff.id === staffMember.id &&
      timelineDates.some(date => date.toDateString() === event.startTime.toDateString())
    );
    
    const totalHours = staffEvents.reduce((acc, event) => {
      const duration = (event.endTime - event.startTime) / (1000 * 60 * 60);
      return acc + duration;
    }, 0);
    
    return {
      events: staffEvents.length,
      hours: Math.round(totalHours * 10) / 10
    };
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, staffId, date, hour) => {
    e.preventDefault();
    const eventData = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    const newStartTime = new Date(date);
    newStartTime.setHours(hour, 0, 0, 0);
    
    // Update the staff assignment
    const updatedEvent = {
      ...eventData,
      assignedStaff: staff.find(s => s.id === staffId) || eventData.assignedStaff
    };
    
    if (onEventDrop) {
      onEventDrop(updatedEvent, newStartTime);
    }
  };

  useEffect(() => {
    // Auto-scroll to current time on mount
    if (currentTime && timelineRef.current) {
      const targetScroll = currentTime.dateIndex * 200; // Approximate width per day
      timelineRef.current.scrollLeft = targetScroll;
      setScrollPosition(targetScroll);
    }
  }, [currentTime]);

  return (
    <div className="timeline-view">
      <div className="timeline-header">
        <div className="timeline-title">
          <h2>Fleet Activities Timeline</h2>
          <p>Track staff assignments and vehicle activities across time</p>
        </div>
        
        <div className="timeline-controls">
          <div className="range-selector">
            <label>View Range:</label>
            <select value={timelineRange} onChange={(e) => handleRangeChange(e.target.value)}>
              <option value={3}>3 Days</option>
              <option value={7}>7 Days</option>
              <option value={14}>14 Days</option>
              <option value={30}>30 Days</option>
            </select>
          </div>
          
          <div className="scroll-controls">
            <button 
              className="scroll-btn"
              onClick={() => handleTimelineScroll('left')}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M10.707 3.293a1 1 0 0 1 0 1.414L7.414 8l3.293 3.293a1 1 0 1 1-1.414 1.414l-4-4a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0z"/>
              </svg>
            </button>
            <button 
              className="scroll-btn"
              onClick={() => handleTimelineScroll('right')}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M5.293 3.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 1 1-1.414-1.414L8.586 8 5.293 4.707a1 1 0 0 1 0-1.414z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="timeline-container" ref={timelineRef}>
        <div className="timeline-grid">
          {/* Header row with dates and hours */}
          <div className="timeline-dates-header">
            <div className="staff-column-header">Staff Member</div>
            {timelineDates.map((date, dateIndex) => (
              <div key={dateIndex} className={`date-section ${isToday(date) ? 'today' : ''}`}>
                <div className="date-label">{formatDate(date)}</div>
                <div className="hours-header">
                  {hours.map(hour => (
                    <div key={hour} className="hour-header">
                      {hour % 4 === 0 && <span>{formatHour(hour)}</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Staff rows */}
          {staff.map(staffMember => {
            const workload = getStaffWorkload(staffMember);
            
            return (
              <div key={staffMember.id} className="staff-row">
                <div className="staff-info">
                  <div className="staff-avatar" style={{ backgroundColor: staffMember.color }}>
                    {staffMember.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="staff-details">
                    <div className="staff-name">{staffMember.name}</div>
                    <div className="staff-role">{staffMember.role}</div>
                    <div className="staff-workload">
                      {workload.events} events, {workload.hours}h
                    </div>
                  </div>
                </div>

                <div className="timeline-slots">
                  {timelineDates.map((date, dateIndex) => (
                    <div key={dateIndex} className="date-slots">
                      {hours.map(hour => {
                        const hourEvents = getEventsForStaffAndTime(staffMember, date, hour);
                        const hasCurrentTime = currentTime?.dateIndex === dateIndex && currentTime?.hour === hour;
                        
                        return (
                          <div 
                            key={hour}
                            className={`time-slot ${hasCurrentTime ? 'current-time' : ''}`}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, staffMember.id, date, hour)}
                          >
                            {/* Current time indicator */}
                            {hasCurrentTime && (
                              <div 
                                className="current-time-indicator"
                                style={{ left: `${currentTime.position}%` }}
                              />
                            )}

                            {/* Events for this hour */}
                            {hourEvents.map(event => {
                              const position = getEventPosition(event, hour);
                              const isEventStart = event.startTime.getHours() === hour;
                              
                              if (isEventStart) {
                                return (
                                  <div
                                    key={event.id}
                                    className="timeline-event"
                                    style={position}
                                  >
                                    <EventCard
                                      event={event}
                                      view="timeline"
                                      isCompact={true}
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
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline legend and stats */}
      <div className="timeline-footer">
        <div className="timeline-legend">
          <h4>Task Types</h4>
          <div className="legend-items">
            {Object.entries(taskTypes).map(([key, type]) => (
              <div key={key} className="legend-item">
                <div 
                  className="legend-color"
                  style={{ backgroundColor: type.color }}
                />
                <span>{type.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="timeline-stats">
          <div className="stat-item">
            <span className="stat-label">Total Events</span>
            <span className="stat-value">
              {filteredEvents.filter(event => 
                timelineDates.some(date => date.toDateString() === event.startTime.toDateString())
              ).length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Active Staff</span>
            <span className="stat-value">{staff.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Avg. Hours/Staff</span>
            <span className="stat-value">
              {Math.round(
                staff.reduce((acc, s) => acc + getStaffWorkload(s).hours, 0) / staff.length * 10
              ) / 10}h
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineView;
