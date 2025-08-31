import React, { useState, useEffect, useCallback } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarSidebar from './CalendarSidebar';
import DailyView from './DailyView';
import WeeklyView from './WeeklyView';
import MonthlyView from './MonthlyView';
import TimelineView from './TimelineView';
import EventModal from './EventModal';
import { sampleEvents, staff, taskTypes } from '../data/sampleData';
import './Calendar.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week');
  const [events, setEvents] = useState(sampleEvents);
  const [filteredEvents, setFilteredEvents] = useState(sampleEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventModalInitialDate, setEventModalInitialDate] = useState(new Date());
  
  const [filters, setFilters] = useState({
    taskTypes: Object.keys(taskTypes),
    staff: staff.map(s => s.id),
    priorities: ['urgent', 'high', 'medium', 'low']
  });

  // Initialize dark mode from system preference or localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('virmatics-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(prefersDark);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('virmatics-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Filter events based on search term and filters
  useEffect(() => {
    let filtered = [...events];

    // Apply text search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(term) ||
        event.assignedStaff.name.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term) ||
        (event.vehicle && event.vehicle.id.toLowerCase().includes(term)) ||
        (event.vehicle && `${event.vehicle.make} ${event.vehicle.model}`.toLowerCase().includes(term)) ||
        (event.deviceId && event.deviceId.toLowerCase().includes(term)) ||
        event.description.toLowerCase().includes(term)
      );
    }

    // Apply task type filters
    filtered = filtered.filter(event => filters.taskTypes.includes(event.type));

    // Apply staff filters
    filtered = filtered.filter(event => filters.staff.includes(event.assignedStaff.id));

    // Apply priority filters
    filtered = filtered.filter(event => filters.priorities.includes(event.priority));

    setFilteredEvents(filtered);
  }, [events, searchTerm, filters]);

  // Handle view changes
  const handleViewChange = useCallback((newView) => {
    setView(newView);
    setIsMobileSidebarOpen(false);
  }, []);

  // Handle date navigation
  const handleNavigate = useCallback((direction) => {
    const newDate = new Date(currentDate);
    
    switch (view) {
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'timeline':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      default:
        break;
    }
    
    setCurrentDate(newDate);
  }, [currentDate, view]);

  // Handle today button
  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  // Handle date selection from sidebar
  const handleDateSelect = useCallback((date) => {
    setCurrentDate(date);
    setIsMobileSidebarOpen(false);
  }, []);

  // Handle search
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  // Handle filter changes
  const handleFiltersChange = useCallback((filterType, value, checked) => {
    if (filterType === 'clear') {
      setFilters({
        taskTypes: Object.keys(taskTypes),
        staff: staff.map(s => s.id),
        priorities: ['urgent', 'high', 'medium', 'low']
      });
      return;
    }

    setFilters(prev => {
      const newFilters = { ...prev };
      
      if (checked) {
        if (!newFilters[filterType].includes(value)) {
          newFilters[filterType] = [...newFilters[filterType], value];
        }
      } else {
        newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
      }
      
      return newFilters;
    });
  }, []);

  // Handle event click - now opens edit modal
  const handleEventClick = useCallback((event) => {
    setSelectedEvent(event);
    setEventModalInitialDate(event.startTime);
    setIsEventModalOpen(true);
  }, []);

  // Handle add event button click
  const handleAddEvent = useCallback(() => {
    setSelectedEvent(null);
    setEventModalInitialDate(currentDate);
    setIsEventModalOpen(true);
  }, [currentDate]);

  // Handle event modal close
  const handleEventModalClose = useCallback(() => {
    setIsEventModalOpen(false);
    setSelectedEvent(null);
  }, []);

  // Handle event save (create or update)
  const handleEventSave = useCallback((eventData) => {
    if (selectedEvent) {
      // Update existing event
      const updatedEvents = events.map(event => 
        event.id === selectedEvent.id ? eventData : event
      );
      setEvents(updatedEvents);
    } else {
      // Create new event
      setEvents(prev => [...prev, eventData]);
    }
  }, [events, selectedEvent]);

  // Handle event drag and drop
  const handleEventDrop = useCallback((eventData, newStartTime) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventData.id) {
        const duration = event.endTime - event.startTime;
        return {
          ...event,
          ...eventData,
          startTime: newStartTime,
          endTime: new Date(newStartTime.getTime() + duration)
        };
      }
      return event;
    });
    
    setEvents(updatedEvents);
  }, [events]);

  // Handle dark mode toggle
  const handleToggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  // Handle sidebar toggle
  const handleToggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev);
  }, []);

  // Handle mobile sidebar toggle
  const handleToggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(prev => !prev);
  }, []);

  // Handle time slot click (for creating new events)
  const handleTimeSlotClick = useCallback((date, hour = null) => {
    setSelectedEvent(null);
    setEventModalInitialDate(date);
    
    // If hour is provided, set initial time
    if (hour !== null) {
      const newDate = new Date(date);
      newDate.setHours(hour, 0, 0, 0);
      setEventModalInitialDate(newDate);
    }
    
    setIsEventModalOpen(true);
  }, []);

  // Render current view
  const renderCurrentView = () => {
    const viewProps = {
      currentDate,
      onEventClick: handleEventClick,
      filteredEvents,
      onEventDrop: handleEventDrop,
      onDateSelect: handleDateSelect,
      onTimeSlotClick: handleTimeSlotClick
    };

    switch (view) {
      case 'day':
        return <DailyView {...viewProps} />;
      case 'week':
        return <WeeklyView {...viewProps} />;
      case 'month':
        return <MonthlyView {...viewProps} />;
      case 'timeline':
        return <TimelineView {...viewProps} />;
      default:
        return <WeeklyView {...viewProps} />;
    }
  };

  return (
    <div className="calendar">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={handleViewChange}
        onNavigate={handleNavigate}
        onToday={handleToday}
        onSearch={handleSearch}
        searchTerm={searchTerm}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onAddEvent={handleAddEvent}
      />
      
      <div className="calendar-content">
        <CalendarSidebar
          currentDate={currentDate}
          onDateSelect={handleDateSelect}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />
        
        <main className="calendar-main">
          {renderCurrentView()}
        </main>
      </div>

      {/* Mobile sidebar backdrop */}
      {isMobileSidebarOpen && (
        <div 
          className="mobile-sidebar-backdrop"
          onClick={handleToggleMobileSidebar}
        />
      )}

      {/* Mobile sidebar toggle button */}
      <button 
        className="mobile-sidebar-toggle"
        onClick={handleToggleMobileSidebar}
        aria-label="Toggle sidebar"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={handleEventModalClose}
        onSave={handleEventSave}
        event={selectedEvent}
        initialDate={eventModalInitialDate}
      />

      {/* Loading state overlay - for future use */}
      {false && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading calendar...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
