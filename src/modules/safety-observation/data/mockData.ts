// Mock data for the Safety Observation Reporting Module

export interface Inspection {
  id: string;
  title: string;
  type: string;
  location: string;
  assignedTo: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  createdAt: string;
}

export interface Compliance {
  id: string;
  requirement: string;
  regulation: string;
  status: 'compliant' | 'non-compliant' | 'pending-review';
  lastReview: string;
  nextReview: string;
  owner: string;
  notes: string;
}

export interface Assessment {
  id: string;
  name: string;
  type: string;
  score: number;
  maxScore: number;
  assessor: string;
  date: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  findings: number;
}

export interface Control {
  id: string;
  name: string;
  category: string;
  effectiveness: 'effective' | 'partially-effective' | 'ineffective';
  owner: string;
  lastTested: string;
  nextTest: string;
  description: string;
}

export interface Mitigation {
  id: string;
  risk: string;
  action: string;
  owner: string;
  dueDate: string;
  status: 'open' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  progress: number;
}

export interface Audit {
  id: string;
  name: string;
  type: 'internal' | 'external';
  auditor: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  findings: number;
  scope: string;
}

export interface Closure {
  id: string;
  itemType: string;
  itemId: string;
  closedBy: string;
  closedDate: string;
  reason: string;
  evidence: string;
  verified: boolean;
}

export const inspections: Inspection[] = [
  {
    id: 'INS-001',
    title: 'Monthly Safety Walkthrough - Building A',
    type: 'Safety',
    location: 'Building A - Floor 1',
    assignedTo: 'Sarah Johnson',
    dueDate: '2025-12-20',
    status: 'pending',
    priority: 'high',
    description: 'Regular monthly safety inspection covering fire exits, equipment, and general safety.',
    createdAt: '2025-12-01',
  },
  {
    id: 'INS-002',
    title: 'Equipment Compliance Check',
    type: 'Compliance',
    location: 'Manufacturing Floor',
    assignedTo: 'Mike Williams',
    dueDate: '2025-12-18',
    status: 'in-progress',
    priority: 'medium',
    description: 'Verify all manufacturing equipment meets current safety standards.',
    createdAt: '2025-12-05',
  },
  {
    id: 'INS-003',
    title: 'Fire Safety Inspection',
    type: 'Fire Safety',
    location: 'All Buildings',
    assignedTo: 'John Doe',
    dueDate: '2025-12-10',
    status: 'overdue',
    priority: 'critical',
    description: 'Annual fire safety inspection required by regulations.',
    createdAt: '2025-11-15',
  },
  {
    id: 'INS-004',
    title: 'Chemical Storage Review',
    type: 'Hazmat',
    location: 'Storage Facility B',
    assignedTo: 'Sarah Johnson',
    dueDate: '2025-12-25',
    status: 'pending',
    priority: 'high',
    description: 'Review chemical storage procedures and container integrity.',
    createdAt: '2025-12-10',
  },
  {
    id: 'INS-005',
    title: 'PPE Compliance Audit',
    type: 'Compliance',
    location: 'All Departments',
    assignedTo: 'Mike Williams',
    dueDate: '2025-12-15',
    status: 'completed',
    priority: 'medium',
    description: 'Audit personal protective equipment usage across all departments.',
    createdAt: '2025-12-01',
  },
];

export const compliances: Compliance[] = [
  {
    id: 'CMP-001',
    requirement: 'OSHA Fire Safety Standards',
    regulation: 'OSHA 29 CFR 1910.155-165',
    status: 'compliant',
    lastReview: '2025-11-15',
    nextReview: '2026-05-15',
    owner: 'John Doe',
    notes: 'All fire safety equipment inspected and certified.',
  },
  {
    id: 'CMP-002',
    requirement: 'Chemical Handling Procedures',
    regulation: 'OSHA 29 CFR 1910.1200',
    status: 'pending-review',
    lastReview: '2025-09-01',
    nextReview: '2025-12-20',
    owner: 'Sarah Johnson',
    notes: 'Pending review of updated SDS documentation.',
  },
  {
    id: 'CMP-003',
    requirement: 'Electrical Safety Standards',
    regulation: 'NFPA 70E',
    status: 'non-compliant',
    lastReview: '2025-10-01',
    nextReview: '2025-12-15',
    owner: 'Mike Williams',
    notes: 'Arc flash labeling needs updating on Panel 3B.',
  },
  {
    id: 'CMP-004',
    requirement: 'Emergency Response Plan',
    regulation: 'OSHA 29 CFR 1910.38',
    status: 'compliant',
    lastReview: '2025-11-01',
    nextReview: '2026-05-01',
    owner: 'John Doe',
    notes: 'Emergency drills conducted quarterly.',
  },
];

export const assessments: Assessment[] = [
  {
    id: 'ASS-001',
    name: 'Q4 Safety Culture Assessment',
    type: 'Culture',
    score: 85,
    maxScore: 100,
    assessor: 'John Doe',
    date: '2025-12-01',
    status: 'approved',
    findings: 3,
  },
  {
    id: 'ASS-002',
    name: 'Workplace Hazard Assessment',
    type: 'Hazard',
    score: 72,
    maxScore: 100,
    assessor: 'Sarah Johnson',
    date: '2025-12-10',
    status: 'submitted',
    findings: 7,
  },
  {
    id: 'ASS-003',
    name: 'Ergonomic Risk Assessment',
    type: 'Ergonomic',
    score: 0,
    maxScore: 100,
    assessor: 'Mike Williams',
    date: '2025-12-15',
    status: 'draft',
    findings: 0,
  },
];

export const controls: Control[] = [
  {
    id: 'CTL-001',
    name: 'Fire Suppression System',
    category: 'Fire Safety',
    effectiveness: 'effective',
    owner: 'Facilities Team',
    lastTested: '2025-11-01',
    nextTest: '2026-02-01',
    description: 'Automatic fire suppression system covering all buildings.',
  },
  {
    id: 'CTL-002',
    name: 'Chemical Spill Containment',
    category: 'Hazmat',
    effectiveness: 'partially-effective',
    owner: 'EHS Team',
    lastTested: '2025-10-15',
    nextTest: '2026-01-15',
    description: 'Spill containment berms and absorbent materials.',
  },
  {
    id: 'CTL-003',
    name: 'Access Control System',
    category: 'Security',
    effectiveness: 'effective',
    owner: 'Security Team',
    lastTested: '2025-12-01',
    nextTest: '2026-03-01',
    description: 'Badge-based access control for restricted areas.',
  },
];

export const mitigations: Mitigation[] = [
  {
    id: 'MIT-001',
    risk: 'Slip and Fall Hazards',
    action: 'Install anti-slip flooring in wet areas',
    owner: 'Facilities Team',
    dueDate: '2025-12-30',
    status: 'in-progress',
    priority: 'high',
    progress: 65,
  },
  {
    id: 'MIT-002',
    risk: 'Chemical Exposure',
    action: 'Upgrade ventilation system in Lab C',
    owner: 'EHS Team',
    dueDate: '2026-01-15',
    status: 'open',
    priority: 'high',
    progress: 20,
  },
  {
    id: 'MIT-003',
    risk: 'Electrical Hazards',
    action: 'Replace outdated electrical panels',
    owner: 'Maintenance Team',
    dueDate: '2025-12-10',
    status: 'overdue',
    priority: 'medium',
    progress: 80,
  },
];

export const audits: Audit[] = [
  {
    id: 'AUD-001',
    name: 'Annual Safety Compliance Audit',
    type: 'external',
    auditor: 'SafetyFirst Consulting',
    startDate: '2025-12-15',
    endDate: '2025-12-20',
    status: 'planned',
    findings: 0,
    scope: 'Full facility safety compliance review',
  },
  {
    id: 'AUD-002',
    name: 'Internal Process Audit',
    type: 'internal',
    auditor: 'John Doe',
    startDate: '2025-11-01',
    endDate: '2025-11-15',
    status: 'completed',
    findings: 5,
    scope: 'Safety procedures and documentation review',
  },
  {
    id: 'AUD-003',
    name: 'Environmental Compliance Audit',
    type: 'external',
    auditor: 'Green Compliance LLC',
    startDate: '2025-12-05',
    endDate: '2025-12-08',
    status: 'in-progress',
    findings: 2,
    scope: 'Waste management and emissions compliance',
  },
];

export const closures: Closure[] = [
  {
    id: 'CLO-001',
    itemType: 'Inspection',
    itemId: 'INS-005',
    closedBy: 'John Doe',
    closedDate: '2025-12-12',
    reason: 'All findings addressed and verified',
    evidence: 'Photos and sign-off documents attached',
    verified: true,
  },
  {
    id: 'CLO-002',
    itemType: 'Mitigation',
    itemId: 'MIT-004',
    closedBy: 'Sarah Johnson',
    closedDate: '2025-12-10',
    reason: 'Control implemented and tested',
    evidence: 'Test results and implementation report',
    verified: true,
  },
];

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

export const systemUsers: SystemUser[] = [
  {
    id: 'USR-001',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    role: 'Compliance Manager',
    department: 'EHS',
    status: 'active',
    lastLogin: '2025-12-15',
  },
  {
    id: 'USR-002',
    name: 'Mike Rodriguez',
    email: 'mike.rodriguez@company.com',
    role: 'EHS Officer',
    department: 'EHS',
    status: 'active',
    lastLogin: '2025-12-14',
  },
  {
    id: 'USR-003',
    name: 'Jennifer Walsh',
    email: 'jennifer.walsh@company.com',
    role: 'Department Head',
    department: 'Operations',
    status: 'active',
    lastLogin: '2025-12-13',
  },
  {
    id: 'USR-004',
    name: 'David Kim',
    email: 'david.kim@company.com',
    role: 'Auditor',
    department: 'Compliance',
    status: 'active',
    lastLogin: '2025-12-12',
  },
];
