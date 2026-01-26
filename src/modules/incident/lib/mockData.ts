export type IncidentStatus = 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'PENDING_APPROVAL' | 'CLOSED' | 'REJECTED';
export type IncidentSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type IncidentPriority = 'Low' | 'Medium' | 'High';
export type IncidentCategory = 'Safety' | 'Security' | 'IT' | 'Other';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Reporter' | 'Investigator' | 'Manager';
}

export interface Incident {
  id: string;
  title: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  priority: IncidentPriority;
  site: string;
  reportedBy: User;
  assignedTo?: User;
  reportedDate: string;
  slaDue: string;
  status: IncidentStatus;
  description: string;
  evidence: string[];
  updates: IncidentUpdate[];
  escalationLevel: number;
  resolutionDetails?: string;
  rootCause?: string;
}

export interface IncidentUpdate {
  id: string;
  timestamp: string;
  user: User;
  action: string;
  comment?: string;
}

export const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@company.com', role: 'Manager' },
  { id: '2', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'Investigator' },
  { id: '3', name: 'Mike Rodriguez', email: 'mike.rodriguez@company.com', role: 'Investigator' },
  { id: '4', name: 'Jennifer Walsh', email: 'jennifer.walsh@company.com', role: 'Reporter' },
  { id: '5', name: 'David Kim', email: 'david.kim@company.com', role: 'Manager' },
];

export const mockIncidents: Incident[] = [
  {
    id: 'INC-2024-001',
    title: 'Server Room Temperature Anomaly',
    category: 'IT',
    severity: 'Critical',
    priority: 'High',
    site: 'Building A - Floor 3',
    reportedBy: mockUsers[3],
    assignedTo: mockUsers[1],
    reportedDate: '2024-01-15T08:30:00',
    slaDue: '2024-01-15T16:30:00',
    status: 'IN_PROGRESS',
    description: 'Temperature in server room exceeded 30°C. Cooling system appears to be malfunctioning.',
    evidence: ['temperature-log.pdf', 'server-room-photo.jpg'],
    escalationLevel: 1,
    updates: [
      {
        id: 'u1',
        timestamp: '2024-01-15T09:00:00',
        user: mockUsers[1],
        action: 'Status changed to IN_PROGRESS',
        comment: 'Investigating cooling system failure. HVAC team notified.',
      },
    ],
  },
  {
    id: 'INC-2024-002',
    title: 'Unauthorized Access Attempt',
    category: 'Security',
    severity: 'High',
    priority: 'High',
    site: 'Building B - Lobby',
    reportedBy: mockUsers[3],
    assignedTo: mockUsers[2],
    reportedDate: '2024-01-14T14:22:00',
    slaDue: '2024-01-15T14:22:00',
    status: 'ASSIGNED',
    description: 'Security cameras detected unauthorized access attempt at Building B entrance.',
    evidence: ['security-footage.mp4', 'access-log.pdf'],
    escalationLevel: 0,
    updates: [
      {
        id: 'u2',
        timestamp: '2024-01-14T14:30:00',
        user: mockUsers[0],
        action: 'Assigned to Mike Rodriguez',
      },
    ],
  },
  {
    id: 'INC-2024-003',
    title: 'Chemical Spill in Lab 4',
    category: 'Safety',
    severity: 'Critical',
    priority: 'High',
    site: 'Research Lab - Floor 2',
    reportedBy: mockUsers[3],
    reportedDate: '2024-01-13T11:15:00',
    slaDue: '2024-01-13T15:15:00',
    status: 'CLOSED',
    description: 'Minor chemical spill during experiment. Area evacuated and cleaned.',
    evidence: ['spill-report.pdf', 'cleanup-photos.jpg'],
    escalationLevel: 0,
    resolutionDetails: 'Area cleaned and decontaminated. All personnel safe. Safety protocols reviewed.',
    rootCause: 'Improper handling of chemical container',
    updates: [
      {
        id: 'u3',
        timestamp: '2024-01-13T15:00:00',
        user: mockUsers[1],
        action: 'Incident resolved and closed',
        comment: 'All cleanup procedures completed successfully.',
      },
    ],
  },
  {
    id: 'INC-2024-004',
    title: 'Fire Alarm System Malfunction',
    category: 'Safety',
    severity: 'High',
    priority: 'High',
    site: 'Building C - All Floors',
    reportedBy: mockUsers[3],
    reportedDate: '2024-01-12T09:00:00',
    slaDue: '2024-01-13T09:00:00',
    status: 'PENDING_APPROVAL',
    description: 'Fire alarm system triggered false alarm. System needs inspection.',
    evidence: ['alarm-log.pdf'],
    escalationLevel: 0,
    resolutionDetails: 'Fire alarm system inspected and recalibrated by certified technician.',
    updates: [
      {
        id: 'u4',
        timestamp: '2024-01-12T16:00:00',
        user: mockUsers[1],
        action: 'Submitted for approval',
      },
    ],
  },
  {
    id: 'INC-2024-005',
    title: 'Network Outage - East Wing',
    category: 'IT',
    severity: 'Medium',
    priority: 'Medium',
    site: 'Building A - East Wing',
    reportedBy: mockUsers[3],
    reportedDate: '2024-01-10T13:45:00',
    slaDue: '2024-01-11T13:45:00',
    status: 'NEW',
    description: 'Complete network outage affecting East Wing offices.',
    evidence: [],
    escalationLevel: 0,
    updates: [],
  },
];
