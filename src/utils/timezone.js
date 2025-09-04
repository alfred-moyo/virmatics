/**
 * Timezone utilities for Mauritius Standard Time (MST)
 * Mauritius is UTC+4 year-round (no daylight saving)
 */

/**
 * Get current date and time in Mauritius timezone (UTC+4)
 * @returns {Date} Current date in Mauritius timezone
 */
export const getMauritiusTime = () => {
  const now = new Date();
  
  // Get current UTC time
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  
  // Add 4 hours for Mauritius timezone (UTC+4)
  const mauritiusTime = new Date(utc + (4 * 3600000));
  
  return mauritiusTime;
};

/**
 * Get current date in Mauritius timezone, useful for date comparisons
 * @returns {Date} Today's date in Mauritius timezone
 */
export const getMauritiusToday = () => {
  const mauritiusTime = getMauritiusTime();
  return new Date(mauritiusTime.getFullYear(), mauritiusTime.getMonth(), mauritiusTime.getDate());
};

/**
 * Convert any date to Mauritius timezone
 * @param {Date} date - The date to convert
 * @returns {Date} Date in Mauritius timezone
 */
export const toMauritiusTime = (date) => {
  if (!date) return null;
  
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  const mauritiusTime = new Date(utc + (4 * 3600000));
  
  return mauritiusTime;
};

/**
 * Check if a date is today in Mauritius timezone
 * @param {Date} date - Date to check
 * @returns {boolean} True if the date is today in Mauritius timezone
 */
export const isTodayInMauritius = (date) => {
  if (!date) return false;
  
  const today = getMauritiusToday();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

/**
 * Format time in Mauritius timezone
 * @param {Date} date - Date to format
 * @returns {string} Formatted time string
 */
export const formatMauritiusTime = (date) => {
  if (!date) return '';
  
  const mauritiusTime = toMauritiusTime(date);
  return mauritiusTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};
