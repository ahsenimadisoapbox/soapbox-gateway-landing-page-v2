// Mock data for SoapBox.Cloud Calibration & Equipment Management Module

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  initials: string;
  status: 'active' | 'inactive';
}

export interface Equipment {
  id: string;
  assetId: string;
  name: string;
  description: string;
  category: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  location: string;
  site: string;
  department: string;
  status: 'draft' | 'active' | 'due' | 'overdue' | 'restricted' | 'retired';
  criticality: 'critical' | 'high' | 'medium' | 'low';
  riskScore: number;
  calibrationDue: string;
  lastCalibration: string;
  calibrationInterval: number;
  qualificationStatus: 'pending' | 'iq_complete' | 'oq_complete' | 'pq_complete' | 'qualified';
  pmDue: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalibrationTask {
  id: string;
  equipmentId: string;
  equipmentName: string;
  assetId: string;
  taskType: 'scheduled' | 'unscheduled' | 'verification';
  status: 'pending' | 'in_progress' | 'completed' | 'oot' | 'cancelled';
  dueDate: string;
  assignedTo: string;
  method: string;
  procedure: string;
  result?: 'pass' | 'oot';
  completedDate?: string;
  reviewedBy?: string;
  reviewDate?: string;
}

export interface OOTInvestigation {
  id: string;
  calibrationTaskId: string;
  equipmentId: string;
  equipmentName: string;
  assetId: string;
  status: 'open' | 'investigation' | 'pending_review' | 'closed';
  rootCause?: string;
  impactAssessment?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  createdAt: string;
  closedAt?: string;
}

export interface PMTask {
  id: string;
  equipmentId: string;
  equipmentName: string;
  assetId: string;
  taskType: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  dueDate: string;
  assignedTo: string;
  procedure: string;
  findings?: string;
  completedDate?: string;
}

export interface TimelineEvent {
  id: string;
  equipmentId: string;
  type: 'qualification' | 'calibration' | 'oot' | 'pm' | 'ncr' | 'capa' | 'release' | 'restriction' | 'status_change';
  title: string;
  description: string;
  performedBy: string;
  timestamp: string;
  signature?: string;
}

export interface Notification {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  link?: string;
}

// Mock Users
export const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@company.com', role: 'Compliance Manager', initials: 'JD', status: 'active' },
  { id: '2', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'QA Manager', initials: 'SC', status: 'active' },
  { id: '3', name: 'Mike Rodriguez', email: 'mike.rodriguez@company.com', role: 'Calibration Technician', initials: 'MR', status: 'active' },
  { id: '4', name: 'Jennifer Walsh', email: 'jennifer.walsh@company.com', role: 'Equipment Admin', initials: 'JW', status: 'active' },
  { id: '5', name: 'David Kim', email: 'david.kim@company.com', role: 'Auditor', initials: 'DK', status: 'active' },
  { id: '6', name: 'Lisa Thompson', email: 'lisa.thompson@company.com', role: 'Maintenance Technician', initials: 'LT', status: 'active' },
];

// Mock Equipment
export const mockEquipment: Equipment[] = [
  {
    id: '1',
    assetId: 'EQ-2024-001',
    name: 'Digital Pressure Gauge',
    description: 'High-precision digital pressure measurement device',
    category: 'Measurement',
    manufacturer: 'Fluke',
    model: 'DPG-700',
    serialNumber: 'FLK-2024-78901',
    location: 'Lab A - Room 101',
    site: 'Main Facility',
    department: 'Quality Control',
    status: 'active',
    criticality: 'critical',
    riskScore: 85,
    calibrationDue: '2024-02-15',
    lastCalibration: '2024-01-15',
    calibrationInterval: 30,
    qualificationStatus: 'qualified',
    pmDue: '2024-03-01',
    createdAt: '2023-06-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    assetId: 'EQ-2024-002',
    name: 'Analytical Balance',
    description: 'Precision analytical balance for laboratory use',
    category: 'Measurement',
    manufacturer: 'Mettler Toledo',
    model: 'XPE205',
    serialNumber: 'MT-2023-45678',
    location: 'Lab B - Room 205',
    site: 'Main Facility',
    department: 'R&D',
    status: 'due',
    criticality: 'critical',
    riskScore: 92,
    calibrationDue: '2024-01-20',
    lastCalibration: '2023-12-20',
    calibrationInterval: 30,
    qualificationStatus: 'qualified',
    pmDue: '2024-02-15',
    createdAt: '2023-04-10',
    updatedAt: '2023-12-20',
  },
  {
    id: '3',
    assetId: 'EQ-2024-003',
    name: 'Temperature Controller',
    description: 'Industrial temperature control unit',
    category: 'Control',
    manufacturer: 'Omega',
    model: 'CN77000',
    serialNumber: 'OMG-2023-12345',
    location: 'Production - Line 3',
    site: 'Manufacturing Plant',
    department: 'Production',
    status: 'overdue',
    criticality: 'high',
    riskScore: 78,
    calibrationDue: '2024-01-01',
    lastCalibration: '2023-10-01',
    calibrationInterval: 90,
    qualificationStatus: 'qualified',
    pmDue: '2024-01-15',
    createdAt: '2022-11-20',
    updatedAt: '2023-10-01',
  },
  {
    id: '4',
    assetId: 'EQ-2024-004',
    name: 'pH Meter',
    description: 'Digital pH measurement instrument',
    category: 'Measurement',
    manufacturer: 'Hanna Instruments',
    model: 'HI5221',
    serialNumber: 'HAN-2024-98765',
    location: 'Lab A - Room 102',
    site: 'Main Facility',
    department: 'Quality Control',
    status: 'restricted',
    criticality: 'high',
    riskScore: 70,
    calibrationDue: '2024-01-10',
    lastCalibration: '2023-12-10',
    calibrationInterval: 30,
    qualificationStatus: 'qualified',
    pmDue: '2024-02-01',
    createdAt: '2023-08-05',
    updatedAt: '2024-01-12',
  },
  {
    id: '5',
    assetId: 'EQ-2024-005',
    name: 'Viscometer',
    description: 'Rotational viscosity measurement device',
    category: 'Measurement',
    manufacturer: 'Brookfield',
    model: 'DV2T',
    serialNumber: 'BRK-2023-55555',
    location: 'Lab C - Room 301',
    site: 'Main Facility',
    department: 'R&D',
    status: 'active',
    criticality: 'medium',
    riskScore: 55,
    calibrationDue: '2024-03-15',
    lastCalibration: '2024-01-15',
    calibrationInterval: 60,
    qualificationStatus: 'qualified',
    pmDue: '2024-04-01',
    createdAt: '2023-02-28',
    updatedAt: '2024-01-15',
  },
  {
    id: '6',
    assetId: 'EQ-2024-006',
    name: 'Spectrophotometer',
    description: 'UV-Vis spectrophotometer for analytical testing',
    category: 'Analysis',
    manufacturer: 'Agilent',
    model: 'Cary 60',
    serialNumber: 'AGI-2022-11111',
    location: 'Lab B - Room 206',
    site: 'Main Facility',
    department: 'Quality Control',
    status: 'draft',
    criticality: 'critical',
    riskScore: 88,
    calibrationDue: '2024-04-01',
    lastCalibration: '',
    calibrationInterval: 90,
    qualificationStatus: 'pending',
    pmDue: '2024-05-01',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
  },
  {
    id: '7',
    assetId: 'EQ-2023-007',
    name: 'HPLC System',
    description: 'High-performance liquid chromatography system',
    category: 'Analysis',
    manufacturer: 'Waters',
    model: 'Alliance e2695',
    serialNumber: 'WAT-2021-22222',
    location: 'Lab B - Room 207',
    site: 'Main Facility',
    department: 'Quality Control',
    status: 'retired',
    criticality: 'critical',
    riskScore: 0,
    calibrationDue: '',
    lastCalibration: '2023-06-15',
    calibrationInterval: 180,
    qualificationStatus: 'qualified',
    pmDue: '',
    createdAt: '2021-03-15',
    updatedAt: '2023-12-01',
  },
];

// Mock Calibration Tasks
export const mockCalibrationTasks: CalibrationTask[] = [
  {
    id: 'CAL-001',
    equipmentId: '1',
    equipmentName: 'Digital Pressure Gauge',
    assetId: 'EQ-2024-001',
    taskType: 'scheduled',
    status: 'pending',
    dueDate: '2024-02-15',
    assignedTo: 'Mike Rodriguez',
    method: 'Comparison Method',
    procedure: 'SOP-CAL-001',
  },
  {
    id: 'CAL-002',
    equipmentId: '2',
    equipmentName: 'Analytical Balance',
    assetId: 'EQ-2024-002',
    taskType: 'scheduled',
    status: 'in_progress',
    dueDate: '2024-01-20',
    assignedTo: 'Mike Rodriguez',
    method: 'Gravimetric Method',
    procedure: 'SOP-CAL-002',
  },
  {
    id: 'CAL-003',
    equipmentId: '3',
    equipmentName: 'Temperature Controller',
    assetId: 'EQ-2024-003',
    taskType: 'scheduled',
    status: 'completed',
    dueDate: '2024-01-01',
    assignedTo: 'Mike Rodriguez',
    method: 'RTD Comparison',
    procedure: 'SOP-CAL-003',
    result: 'oot',
    completedDate: '2024-01-02',
  },
  {
    id: 'CAL-004',
    equipmentId: '4',
    equipmentName: 'pH Meter',
    assetId: 'EQ-2024-004',
    taskType: 'verification',
    status: 'completed',
    dueDate: '2024-01-10',
    assignedTo: 'Lisa Thompson',
    method: 'Buffer Solution Method',
    procedure: 'SOP-CAL-004',
    result: 'pass',
    completedDate: '2024-01-10',
    reviewedBy: 'Sarah Chen',
    reviewDate: '2024-01-11',
  },
];

// Mock OOT Investigations
export const mockOOTInvestigations: OOTInvestigation[] = [
  {
    id: 'OOT-001',
    calibrationTaskId: 'CAL-003',
    equipmentId: '3',
    equipmentName: 'Temperature Controller',
    assetId: 'EQ-2024-003',
    status: 'investigation',
    rootCause: 'Sensor drift detected beyond acceptable limits',
    impactAssessment: 'Products manufactured between Dec 15 - Jan 2 require review',
    createdAt: '2024-01-02',
  },
  {
    id: 'OOT-002',
    calibrationTaskId: 'CAL-005',
    equipmentId: '4',
    equipmentName: 'pH Meter',
    assetId: 'EQ-2024-004',
    status: 'open',
    createdAt: '2024-01-12',
  },
];

// Mock PM Tasks
export const mockPMTasks: PMTask[] = [
  {
    id: 'PM-001',
    equipmentId: '1',
    equipmentName: 'Digital Pressure Gauge',
    assetId: 'EQ-2024-001',
    taskType: 'Routine Maintenance',
    status: 'pending',
    dueDate: '2024-03-01',
    assignedTo: 'Lisa Thompson',
    procedure: 'SOP-PM-001',
  },
  {
    id: 'PM-002',
    equipmentId: '2',
    equipmentName: 'Analytical Balance',
    assetId: 'EQ-2024-002',
    taskType: 'Cleaning & Inspection',
    status: 'pending',
    dueDate: '2024-02-15',
    assignedTo: 'Lisa Thompson',
    procedure: 'SOP-PM-002',
  },
  {
    id: 'PM-003',
    equipmentId: '3',
    equipmentName: 'Temperature Controller',
    assetId: 'EQ-2024-003',
    taskType: 'Sensor Replacement',
    status: 'overdue',
    dueDate: '2024-01-15',
    assignedTo: 'Lisa Thompson',
    procedure: 'SOP-PM-003',
  },
];

// Mock Timeline Events
export const mockTimelineEvents: TimelineEvent[] = [
  {
    id: 'TL-001',
    equipmentId: '1',
    type: 'qualification',
    title: 'IQ/OQ/PQ Completed',
    description: 'Equipment qualification completed successfully. All acceptance criteria met.',
    performedBy: 'Jennifer Walsh',
    timestamp: '2023-06-20T10:30:00Z',
    signature: 'JW-2023-06-20-10:30',
  },
  {
    id: 'TL-002',
    equipmentId: '1',
    type: 'calibration',
    title: 'Initial Calibration',
    description: 'First calibration performed. Result: PASS. All parameters within specification.',
    performedBy: 'Mike Rodriguez',
    timestamp: '2023-06-25T14:00:00Z',
    signature: 'MR-2023-06-25-14:00',
  },
  {
    id: 'TL-003',
    equipmentId: '1',
    type: 'status_change',
    title: 'Status: ACTIVE',
    description: 'Equipment activated and released for use.',
    performedBy: 'Sarah Chen',
    timestamp: '2023-06-25T16:00:00Z',
    signature: 'SC-2023-06-25-16:00',
  },
  {
    id: 'TL-004',
    equipmentId: '1',
    type: 'calibration',
    title: 'Scheduled Calibration',
    description: 'Routine calibration performed. Result: PASS.',
    performedBy: 'Mike Rodriguez',
    timestamp: '2024-01-15T09:00:00Z',
    signature: 'MR-2024-01-15-09:00',
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'N-001',
    type: 'warning',
    title: 'Calibration Due Soon',
    message: 'Analytical Balance (EQ-2024-002) calibration due in 2 days',
    read: false,
    timestamp: '2024-01-18T08:00:00Z',
    link: '/equipment/2',
  },
  {
    id: 'N-002',
    type: 'error',
    title: 'Equipment Overdue',
    message: 'Temperature Controller (EQ-2024-003) calibration is overdue',
    read: false,
    timestamp: '2024-01-15T08:00:00Z',
    link: '/equipment/3',
  },
  {
    id: 'N-003',
    type: 'info',
    title: 'OOT Investigation Required',
    message: 'New OOT investigation opened for Temperature Controller',
    read: true,
    timestamp: '2024-01-02T10:00:00Z',
    link: '/oot/OOT-001',
  },
];

// Dashboard KPIs
export const dashboardKPIs = {
  totalEquipment: mockEquipment.length,
  activeEquipment: mockEquipment.filter(e => e.status === 'active').length,
  overdueEquipment: mockEquipment.filter(e => e.status === 'overdue').length,
  dueEquipment: mockEquipment.filter(e => e.status === 'due').length,
  restrictedEquipment: mockEquipment.filter(e => e.status === 'restricted').length,
  ootCount: mockOOTInvestigations.filter(o => o.status !== 'closed').length,
  pendingCalibrations: mockCalibrationTasks.filter(c => c.status === 'pending').length,
  overduePM: mockPMTasks.filter(p => p.status === 'overdue').length,
};

// Sites and Departments
export const sites = ['Main Facility', 'Manufacturing Plant', 'R&D Center'];
export const departments = ['Quality Control', 'R&D', 'Production', 'Maintenance'];
export const categories = ['Measurement', 'Control', 'Analysis', 'Testing'];
export const criticalities = ['critical', 'high', 'medium', 'low'];
export const statuses = ['draft', 'active', 'due', 'overdue', 'restricted', 'retired'];

// Roles
export const roles = [
  'Calibration Technician',
  'Maintenance Technician',
  'Equipment Admin',
  'QA Reviewer',
  'QA Manager',
  'Compliance Manager',
  'Auditor',
  'Executive',
  'Super Admin',
];
