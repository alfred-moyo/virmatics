// Sample telematics data for Virmatics Ltd
export const taskTypes = {
  installation: { color: '#3B82F6', label: 'Installation' },
  intervention: { color: '#EF4444', label: 'Intervention' },
  maintenance: { color: '#10B981', label: 'Maintenance' },
  inspection: { color: '#F59E0B', label: 'Inspection' },
  training: { color: '#8B5CF6', label: 'Training' },
  delivery: { color: '#06B6D4', label: 'Delivery' }
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
    type: 'installation',
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
    title: 'Fleet Diagnostics Check',
    type: 'maintenance',
    startTime: new Date(2024, 11, 20, 14, 0),
    endTime: new Date(2024, 11, 20, 16, 30),
    assignedStaff: staff[2],
    company: 'Bocus Transport',
    vehicle: 'VH-004 Volvo FH16',
    location: 'Client\'s Location',
    description: 'Routine diagnostic check and software update',
    deviceId: 'DIAG-2024-047'
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
    title: 'Driver Training Session',
    type: 'training',
    startTime: new Date(2024, 11, 22, 10, 0),
    endTime: new Date(2024, 11, 22, 12, 0),
    assignedStaff: staff[1],
    company: 'Blinds.mu Ltd',
    vehicle: '',
    location: 'Office',
    description: 'Telematics system usage training for new drivers',
    deviceId: null
  },
  {
    id: 5,
    title: 'Monthly Vehicle Inspection',
    type: 'inspection',
    startTime: new Date(2024, 11, 23, 13, 0),
    endTime: new Date(2024, 11, 23, 15, 0),
    assignedStaff: staff[4],
    company: 'Eastern Mix',
    vehicle: 'VH-003 Renault Traffic',
    location: 'Office',
    description: 'Comprehensive vehicle and telematics system inspection',
    deviceId: 'INSP-2024-089'
  },
  {
    id: 6,
    title: 'New Device Delivery',
    type: 'delivery',
    startTime: new Date(2024, 11, 24, 9, 0),
    endTime: new Date(2024, 11, 24, 10, 30),
    assignedStaff: staff[0],
    company: 'Panagora',
    vehicle: 'FL-001 Toyota Hilux',
    location: 'Client\'s Location',
    description: 'Deliver and setup new telematics hardware',
    deviceId: 'DEL-2024-156'
  },
  // Week view events
  {
    id: 7,
    title: 'System Software Update',
    type: 'maintenance',
    startTime: new Date(2024, 11, 19, 16, 0),
    endTime: new Date(2024, 11, 19, 18, 0),
    assignedStaff: staff[2],
    company: 'Agiliss Ltd',
    vehicle: 'VH-001 Mercedes Sprinter',
    location: 'Office',
    description: 'Update telematics software to latest version',
    deviceId: 'UPD-2024-078'
  },
  {
    id: 8,
    title: 'Camera System Installation',
    type: 'installation',
    startTime: new Date(2024, 11, 25, 11, 0),
    endTime: new Date(2024, 11, 25, 14, 0),
    assignedStaff: staff[1],
    company: 'Bocus Transport',
    vehicle: 'VH-002 Ford Transit',
    location: 'Client\'s Location',
    description: 'Install dashcam and rear-view camera system',
    deviceId: 'CAM-2024-034'
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