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
  { id: 1, name: 'John Mitchell', role: 'Senior Technician', color: '#3B82F6' },
  { id: 2, name: 'Sarah Johnson', role: 'Installation Specialist', color: '#10B981' },
  { id: 3, name: 'Mike Chen', role: 'Field Engineer', color: '#F59E0B' },
  { id: 4, name: 'Emma Rodriguez', role: 'Support Technician', color: '#EF4444' },
  { id: 5, name: 'David Thompson', role: 'Lead Installer', color: '#8B5CF6' }
];

export const vehicles = [
  { id: 'VH-001', make: 'Mercedes', model: 'Sprinter', year: 2023, type: 'Van' },
  { id: 'VH-002', make: 'Ford', model: 'Transit', year: 2022, type: 'Van' },
  { id: 'VH-003', make: 'Volvo', model: 'FH16', year: 2023, type: 'Truck' },
  { id: 'VH-004', make: 'Scania', model: 'R450', year: 2022, type: 'Truck' },
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
    vehicle: vehicles[0],
    location: 'Birmingham Depot',
    priority: 'high',
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
    vehicle: vehicles[2],
    location: 'Manchester Service Center',
    priority: 'medium',
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
    vehicle: vehicles[1],
    location: 'M25 Service Station',
    priority: 'urgent',
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
    vehicle: null,
    location: 'Virmatics Training Center',
    priority: 'medium',
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
    vehicle: vehicles[3],
    location: 'Leeds Distribution Hub',
    priority: 'medium',
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
    vehicle: vehicles[4],
    location: 'Client Site - London',
    priority: 'high',
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
    vehicle: vehicles[0],
    location: 'Remote',
    priority: 'low',
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
    vehicle: vehicles[1],
    location: 'Cardiff Warehouse',
    priority: 'high',
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
