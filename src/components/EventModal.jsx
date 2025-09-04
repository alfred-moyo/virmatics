import React, { useState, useEffect } from 'react';
import { staff, taskTypes, vehicles } from '../data/sampleData';
import { getMauritiusTime } from '../utils/timezone';
import './EventModal.css';

const EventModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  event = null, 
  initialDate = null,
  initialTime = null 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'newInstallation',
    assignedStaff: staff[0]?.id || 1,
    company: '',
    vehicle: '',
    location: 'Office',
    description: '',
    deviceId: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when modal opens or event changes
  useEffect(() => {
    if (isOpen) {
      if (event) {
        // Edit mode - populate with existing event data
        const startDate = new Date(event.startTime);
        const endDate = new Date(event.endTime);
        
        setFormData({
          title: event.title,
          type: event.type,
          assignedStaff: event.assignedStaff.id,
          company: event.company || '',
          vehicle: event.vehicle?.info || event.vehicle?.id || '',
          location: event.location,
          description: event.description || '',
          deviceId: event.deviceId || '',
          startDate: startDate.toISOString().split('T')[0],
          startTime: startDate.toTimeString().slice(0, 5),
          endDate: endDate.toISOString().split('T')[0],
          endTime: endDate.toTimeString().slice(0, 5)
        });
      } else {
        // Create mode - initialize with defaults
        const startDate = new Date(initialDate);
        const endDate = new Date(initialDate);
        
        // If initial time is provided, use it; otherwise default to current time
        if (initialTime) {
          startDate.setHours(initialTime.hours || 9, initialTime.minutes || 0);
        } else {
          startDate.setHours(9, 0); // Default to 9 AM
        }
        endDate.setTime(startDate.getTime() + (2 * 60 * 60 * 1000)); // Default 2-hour duration
        
        setFormData({
          title: '',
          type: 'installation',
          assignedStaff: staff[0]?.id || 1,
          company: '',
          vehicle: '',
          location: 'Office',
          description: '',
          deviceId: '',
          startDate: startDate.toISOString().split('T')[0],
          startTime: startDate.toTimeString().slice(0, 5),
          endDate: endDate.toISOString().split('T')[0],
          endTime: endDate.toTimeString().slice(0, 5)
        });
      }
      setErrors({});
    }
  }, [isOpen, event, initialDate, initialTime]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
    
    // Auto-adjust end time when start time changes
    if (field === 'startTime' && formData.startDate === formData.endDate) {
      const [hours, minutes] = value.split(':').map(Number);
      const endTime = new Date();
      endTime.setHours(hours + 2, minutes); // Default 2-hour duration
      
      setFormData(prev => ({
        ...prev,
        endTime: endTime.toTimeString().slice(0, 5)
      }));
    }
    
    // Auto-adjust end date when start date changes
    if (field === 'startDate') {
      setFormData(prev => ({
        ...prev,
        endDate: value
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.company.trim()) {
      newErrors.company = 'Company is required';
    }
    
    if (!formData.location) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    
    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }
    
    // Validate that end time is after start time
    if (formData.startDate && formData.startTime && formData.endDate && formData.endTime) {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
      
      if (endDateTime <= startDateTime) {
        newErrors.endTime = 'End time must be after start time';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
      const selectedStaff = staff.find(s => s.id === parseInt(formData.assignedStaff));
      
      const eventData = {
        id: event?.id || Date.now(), // Use existing ID or generate new one
        title: formData.title.trim(),
        type: formData.type,
        startTime: startDateTime,
        endTime: endDateTime,
        assignedStaff: selectedStaff,
        company: formData.company.trim(),
        vehicle: formData.vehicle.trim() || null,
        location: formData.location,
        description: formData.description.trim(),
        deviceId: formData.deviceId.trim() || null
      };
      
      await onSave(eventData);
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      setErrors({ submit: 'Failed to save event. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!event || !onDelete) return;
    
    const confirmDelete = window.confirm(`Are you sure you want to delete "${event.title}"? This action cannot be undone.`);
    if (!confirmDelete) return;
    
    setIsSubmitting(true);
    try {
      await onDelete(event);
      onClose();
    } catch (error) {
      console.error('Error deleting event:', error);
      setErrors({ submit: 'Failed to delete event. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="event-modal-overlay" onKeyDown={handleKeyDown}>
      <div className="event-modal">
        <div className="modal-header">
          <h2>{event ? 'Edit Event' : 'Create New Event'}</h2>
          <button 
            className="close-btn"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            {/* Title */}
            <div className="form-group full-width">
              <label htmlFor="title">Event Title *</label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., GPS Tracker Installation"
                className={errors.title ? 'error' : ''}
                disabled={isSubmitting}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            {/* Task Type */}
            <div className="form-group">
              <label htmlFor="type">Task Type *</label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                disabled={isSubmitting}
              >
                {Object.entries(taskTypes).map(([key, type]) => (
                  <option key={key} value={key}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Company */}
            <div className="form-group">
              <label htmlFor="company">Company *</label>
              <input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="e.g., Panagora"
                className={errors.company ? 'error' : ''}
                disabled={isSubmitting}
              />
              {errors.company && <span className="error-message">{errors.company}</span>}
            </div>

            {/* Assigned Staff */}
            <div className="form-group">
              <label htmlFor="staff">Assigned Staff *</label>
              <select
                id="staff"
                value={formData.assignedStaff}
                onChange={(e) => handleInputChange('assignedStaff', parseInt(e.target.value))}
                disabled={isSubmitting}
              >
                {staff.map(person => (
                  <option key={person.id} value={person.id}>
                    {person.name} - {person.role}
                  </option>
                ))}
              </select>
            </div>

            {/* Vehicle */}
            <div className="form-group">
              <label htmlFor="vehicle">Vehicle</label>
              <input
                id="vehicle"
                type="text"
                value={formData.vehicle}
                onChange={(e) => handleInputChange('vehicle', e.target.value)}
                placeholder="e.g., VH-001 Mercedes Sprinter, Fleet Car ABC123"
                disabled={isSubmitting}
              />
            </div>

            {/* Location */}
            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <select
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={errors.location ? 'error' : ''}
                disabled={isSubmitting}
              >
                <option value="Office">Office</option>
                <option value="Client's Location">Client's Location</option>
                <option value="Other">Other</option>
              </select>
              {errors.location && <span className="error-message">{errors.location}</span>}
            </div>

            {/* Start Date & Time */}
            <div className="form-group">
              <label htmlFor="startDate">Start Date *</label>
              <input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className={errors.startDate ? 'error' : ''}
                disabled={isSubmitting}
              />
              {errors.startDate && <span className="error-message">{errors.startDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="startTime">Start Time *</label>
              <input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className={errors.startTime ? 'error' : ''}
                disabled={isSubmitting}
              />
              {errors.startTime && <span className="error-message">{errors.startTime}</span>}
            </div>

            {/* End Date & Time */}
            <div className="form-group">
              <label htmlFor="endDate">End Date *</label>
              <input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className={errors.endDate ? 'error' : ''}
                disabled={isSubmitting}
              />
              {errors.endDate && <span className="error-message">{errors.endDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="endTime">End Time *</label>
              <input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                className={errors.endTime ? 'error' : ''}
                disabled={isSubmitting}
              />
              {errors.endTime && <span className="error-message">{errors.endTime}</span>}
            </div>

            {/* Device ID */}
            <div className="form-group">
              <label htmlFor="deviceId">Device ID</label>
              <input
                id="deviceId"
                type="text"
                value={formData.deviceId}
                onChange={(e) => handleInputChange('deviceId', e.target.value)}
                placeholder="e.g., GPS-2024-001"
                disabled={isSubmitting}
              />
            </div>

            {/* Description */}
            <div className="form-group full-width">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Additional details about the task..."
                rows={3}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {errors.submit && (
            <div className="error-message submit-error">{errors.submit}</div>
          )}

          <div className="modal-actions">
            {event ? (
              // Edit mode - show delete and update buttons
              <>
                <button 
                  type="button" 
                  className="btn-danger"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Deleting...' : 'Delete'}
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Event'}
                </button>
              </>
            ) : (
              // Create mode - show cancel and create buttons
              <>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Event'}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
