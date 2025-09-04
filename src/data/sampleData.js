// Sample telematics data for Virmatics Ltd
export const taskTypes = {
  newInstallation: { color: '#3B82F6', label: 'New Installation' },
  intervention: { color: '#EF4444', label: 'Intervention' },
  removal: { color: '#F59E0B', label: 'Removal' },
  swapping: { color: '#8B5CF6', label: 'Swapping' }
};

export const staff = [
  { id: 1, name: 'Lovikesh', role: 'Supervisor', color: '#3B82F6' },
  { id: 2, name: 'Mansoor', role: 'Senior Technician', color: '#10B981' },
  { id: 3, name: 'Shaahid', role: 'Technician', color: '#F59E0B' },
  { id: 4, name: 'Saafaraz', role: 'Technician', color: '#EF4444' },
  { id: 5, name: 'Samuel', role: 'Support Technician', color: '#8B5CF6' }
];

export const vehicles = [
  { id: 'VH-001', make: 'Mercedes', model: 'Sprinter', year: 2023, type: 'Van' },
  { id: 'VH-002', make: 'Ford', model: 'Transit', year: 2022, type: 'Van' },
  { id: 'VH-003', make: 'Renault', model: 'Traffic', year: 2023, type: 'Van' },
  { id: 'VH-004', make: 'Volvo', model: 'FH16', year: 2022, type: 'Truck' },
  { id: 'FL-001', make: 'Toyota', model: 'Hilux', year: 2023, type: 'Fleet Car' }
];

export const sampleEvents = [
  {
    id: 1,
    title: 'GPS Tracker Installation',
    type: 'newInstallation',
    startTime: new Date(2024, 11, 20, 9, 0),
    endTime: new Date(2024, 11, 20, 11, 0),
    assignedStaff: staff[0],
    company: 'Aahana & Teeyana Co Ltd',
    vehicle: 'VH-001 Mercedes Sprinter',
    location: 'Office',
    description: 'Install new GPS tracking system on Mercedes Sprinter',
    deviceId: 'GPS-2024-001'
  },
  {
    id: 2,
    title: 'Device Swapping - Old to New Model',
    type: 'swapping',
    startTime: new Date(2024, 11, 20, 14, 0),
    endTime: new Date(2024, 11, 20, 16, 30),
    assignedStaff: staff[2],
    company: 'Bocus Transport',
    vehicle: 'VH-004 Volvo FH16',
    location: 'Client\'s Location',
    description: 'Replace old tracking device with new model',
    deviceId: 'SWAP-2024-047'
  },
  {
    id: 3,
    title: 'Emergency Repair - Fuel Sensor',
    type: 'intervention',
    startTime: new Date(2024, 11, 21, 8, 30),
    endTime: new Date(2024, 11, 21, 12, 0),
    assignedStaff: staff[3],
    company: 'Mautourco',
    vehicle: 'VH-002 Ford Transit',
    location: 'Other',
    description: 'Fuel sensor malfunction requiring immediate attention',
    deviceId: 'FUEL-2024-023'
  },
  {
    id: 4,
    title: 'Telematics Device Removal',
    type: 'removal',
    startTime: new Date(2024, 11, 22, 10, 0),
    endTime: new Date(2024, 11, 22, 12, 0),
    assignedStaff: staff[1],
    company: 'Blinds.mu Ltd',
    vehicle: 'VH-002 Ford Transit',
    location: 'Client\'s Location',
    description: 'Remove telematics device from vehicle end of contract',
    deviceId: 'REM-2024-089'
  },
  {
    id: 5,
    title: 'Emergency Device Intervention',
    type: 'intervention',
    startTime: new Date(2024, 11, 23, 13, 0),
    endTime: new Date(2024, 11, 23, 15, 0),
    assignedStaff: staff[4],
    company: 'Eastern Mix',
    vehicle: 'VH-003 Renault Traffic',
    location: 'Client\'s Location',
    description: 'Fix malfunctioning telematics device and restore connectivity',
    deviceId: 'INT-2024-089'
  },
  {
    id: 6,
    title: 'Fleet Management System Installation',
    type: 'newInstallation',
    startTime: new Date(2024, 11, 24, 9, 0),
    endTime: new Date(2024, 11, 24, 10, 30),
    assignedStaff: staff[0],
    company: 'Panagora',
    vehicle: 'FL-001 Toyota Hilux',
    location: 'Client\'s Location',
    description: 'Install new fleet management telematics system',
    deviceId: 'FMS-2024-156'
  },
  // Week view events
  {
    id: 7,
    title: 'Device Swapping - Upgrade',
    type: 'swapping',
    startTime: new Date(2024, 11, 19, 16, 0),
    endTime: new Date(2024, 11, 19, 17, 0),
    assignedStaff: staff[2],
    company: 'Agiliss Ltd',
    vehicle: 'VH-001 Mercedes Sprinter',
    location: 'Office',
    description: 'Swap existing device with upgraded model',
    deviceId: 'SWP-2024-078'
  },
  {
    id: 8,
    title: 'Camera System Installation',
    type: 'newInstallation',
    startTime: new Date(2024, 11, 25, 11, 0),
    endTime: new Date(2024, 11, 25, 14, 0),
    assignedStaff: staff[1],
    company: 'Bocus Transport',
    vehicle: 'VH-002 Ford Transit',
    location: 'Client\'s Location',
    description: 'Install dashcam and rear-view camera system',
    deviceId: 'CAM-2024-034'
  },
  {
    id: 9,
    title: 'Contract End Device Removal',
    type: 'removal',
    startTime: new Date(2024, 11, 26, 9, 0),
    endTime: new Date(2024, 11, 26, 10, 30),
    assignedStaff: staff[3],
    company: 'Transport Solutions Ltd',
    vehicle: 'VH-003 Renault Traffic',
    location: 'Client\'s Location',
    description: 'Remove all tracking devices due to contract termination',
    deviceId: 'REM-2024-156'
  },
  {
    id: 10,
    title: 'Hardware Upgrade Swap',
    type: 'swapping',
    startTime: new Date(2024, 11, 27, 14, 0),
    endTime: new Date(2024, 11, 27, 16, 0),
    assignedStaff: staff[4],
    company: 'Maritime Logistics',
    vehicle: 'VH-004 Volvo FH16',
    location: 'Office',
    description: 'Replace Gen 2 device with Gen 3 advanced tracking unit',
    deviceId: 'SWP-2024-203'
  }
];

// Helper functions
export const getEventsByDate = (date) => {
  return sampleEvents.filter(event => 
    event.startTime.toDateString() === date.toDateString()
  );
};

export const getEventsByWeek = (startDate) => {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  
  return sampleEvents.filter(event => 
    event.startTime >= startDate && event.startTime <= endDate
  );
};

export const getEventsByMonth = (year, month) => {
  return sampleEvents.filter(event => 
    event.startTime.getFullYear() === year && 
    event.startTime.getMonth() === month
  );
};