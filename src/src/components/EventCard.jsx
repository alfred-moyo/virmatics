import React, { useState } from 'react';
import { taskTypes } from '../data/sampleData';
import './EventCard.css';

const EventCard = ({ 
  event, 
  view = 'week', 
  isCompact = false,
  onClick,
  isDraggable = false,
  onDragStart,
  onDragEnd 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDuration = () => {
    const duration = (event.endTime - event.startTime) / (1000 * 60);
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    
    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  const getPriorityIcon = () => {
    switch (event.priority) {
      case 'urgent':
        return (
          <svg className="priority-icon urgent" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z"/>
          </svg>
        );
      case 'high':
        return (
          <svg className="priority-icon high" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 1L8 5H4L6 1ZM6 7C6.55 7 7 7.45 7 8C7 8.55 6.55 9 6 9C5.45 9 5 8.55 5 8C5 7.45 5.45 7 6 7Z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const getTaskTypeIcon = () => {
    const iconMap = {
      installation: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          <path d="M7 1L2 6H5V13H9V6H12L7 1Z"/>
        </svg>
      ),
      intervention: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          <path d="M7 0C3.13 0 0 3.13 0 7C0 10.87 3.13 14 7 14C10.87 14 14 10.87 14 7C14 3.13 10.87 0 7 0ZM7.7 10.3L7 11L6.3 10.3L3.7 7.7L4.3 7.1L7 9.8L9.7 7.1L10.3 7.7L7.7 10.3Z"/>
        </svg>
      ),
      maintenance: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          <path d="M7 0L8.5 3L12 3.5L9.5 6L10 9.5L7 8L4 9.5L4.5 6L2 3.5L5.5 3L7 0Z"/>
        </svg>
      ),
      inspection: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          <path d="M7 1C4.24 1 2 3.24 2 6C2 8.76 4.24 11 7 11C9.76 11 12 8.76 12 6C12 3.24 9.76 1 7 1ZM6 9L3 6L4.41 4.59L6 6.17L9.59 2.58L11 4L6 9Z"/>
        </svg>
      ),
      training: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          <path d="M7 0L0 4L7 8L14 4L7 0ZM2 6L7 9L12 6V10H14V6L7 9L2 6Z"/>
        </svg>
      ),
      delivery: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          <path d="M0 2V12H2V11H12V12H14V6H10V2H0ZM8 4V6H2V4H8ZM3 8.5C3 7.67 3.67 7 4.5 7C5.33 7 6 7.67 6 8.5C6 9.33 5.33 10 4.5 10C3.67 10 3 9.33 3 8.5ZM8 8.5C8 7.67 8.67 7 9.5 7C10.33 7 11 7.67 11 8.5C11 9.33 10.33 10 9.5 10C8.67 10 8 9.33 8 8.5Z"/>
        </svg>
      )
    };
    return iconMap[event.type] || null;
  };

  const cardStyle = {
    '--task-color': taskTypes[event.type]?.color || '#6B7280',
    '--task-color-light': `${taskTypes[event.type]?.color}20` || '#6B728020'
  };

  const handleDragStart = (e) => {
    if (onDragStart) {
      onDragStart(e, event);
    }
  };

  const handleDragEnd = (e) => {
    if (onDragEnd) {
      onDragEnd(e, event);
    }
  };

  return (
    <div
      className={`event-card ${view} ${isCompact ? 'compact' : ''} ${event.priority}`}
      style={cardStyle}
      onClick={() => onClick && onClick(event)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="event-header">
        <div className="event-title-row">
          <div className="task-type-icon">
            {getTaskTypeIcon()}
          </div>
          <span className="event-title">{event.title}</span>
          {getPriorityIcon()}
        </div>
        
        {!isCompact && (
          <div className="event-time">
            {formatTime(event.startTime)} - {formatTime(event.endTime)}
            <span className="duration">({formatDuration()})</span>
          </div>
        )}
      </div>

      {!isCompact && (
        <div className="event-details">
          <div className="detail-row">
            <svg className="detail-icon" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 0C4.89 0 4 0.89 4 2C4 3.11 4.89 4 6 4C7.11 4 8 3.11 8 2C8 0.89 7.11 0 6 0ZM6 10C4.67 10 2 10.67 2 12V14H10V12C10 10.67 7.33 10 6 10Z"/>
            </svg>
            <span>{event.assignedStaff.name}</span>
          </div>
          
          {event.vehicle && (
            <div className="detail-row">
              <svg className="detail-icon" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M2 7H1V9H2C2 9.55 2.45 10 3 10C3.55 10 4 9.55 4 9H8C8 9.55 8.45 10 9 10C9.55 10 10 9.55 10 9H11V7H10V5L8 2H4V7H2ZM6 3H7.5L9 5H6V3ZM3 8.5C3.55 8.5 4 8.05 4 7.5C4 6.95 3.55 6.5 3 6.5C2.45 6.5 2 6.95 2 7.5C2 8.05 2.45 8.5 3 8.5ZM9 8.5C9.55 8.5 10 8.05 10 7.5C10 6.95 9.55 6.5 9 6.5C8.45 6.5 8 6.95 8 7.5C8 8.05 8.45 8.5 9 8.5Z"/>
              </svg>
              <span>{event.vehicle.id} - {event.vehicle.make} {event.vehicle.model}</span>
            </div>
          )}
          
          <div className="detail-row">
            <svg className="detail-icon" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 0C3.79 0 2 1.79 2 4C2 7 6 12 6 12C6 12 10 7 10 4C10 1.79 8.21 0 6 0ZM6 5.5C5.17 5.5 4.5 4.83 4.5 4C4.5 3.17 5.17 2.5 6 2.5C6.83 2.5 7.5 3.17 7.5 4C7.5 4.83 6.83 5.5 6 5.5Z"/>
            </svg>
            <span>{event.location}</span>
          </div>
        </div>
      )}

      {/* Hover Tooltip */}
      {isHovered && isCompact && (
        <div className="event-tooltip">
          <div className="tooltip-header">
            <strong>{event.title}</strong>
            <span className="tooltip-time">
              {formatTime(event.startTime)} - {formatTime(event.endTime)}
            </span>
          </div>
          <div className="tooltip-details">
            <div><strong>Staff:</strong> {event.assignedStaff.name}</div>
            {event.vehicle && (
              <div><strong>Vehicle:</strong> {event.vehicle.id} - {event.vehicle.make} {event.vehicle.model}</div>
            )}
            <div><strong>Location:</strong> {event.location}</div>
            <div><strong>Priority:</strong> {event.priority}</div>
            {event.deviceId && (
              <div><strong>Device:</strong> {event.deviceId}</div>
            )}
          </div>
        </div>
      )}

      {/* Task type label */}
      <div className="task-type-label">
        {taskTypes[event.type]?.label}
      </div>
    </div>
  );
};

export default EventCard;
