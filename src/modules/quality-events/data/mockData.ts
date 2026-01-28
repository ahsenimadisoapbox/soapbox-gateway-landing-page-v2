// Mock Data for Soapbox Cloud - Quality Events & Incident Management Module

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  avatar?: string;
  department: string;
  status: 'active' | 'inactive';
}

export interface QualityEvent {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'submitted' | 'triage' | 'validated' | 'closed' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  source: string;
  reporter: User;
  assignee?: User;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  riskScore: number;
  location: string;
  department: string;
  attachments: number;
  comments: number;
}

export interface Incident {
  id: string;
  eventId: string;
  title: string;
  description: string;
  status: 'open' | 'containment' | 'investigation' | 'corrective-action' | 'effectiveness' | 'lessons-learned' | 'review' | 'closed';
  severity: 'minor' | 'major' | 'critical';
  owner: User;
  qaApprover?: User;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  rootCause?: string;
  containmentActions: string[];
  correctiveActions: CorrectiveAction[];
  impactAssessment?: ImpactAssessment;
}

export interface CorrectiveAction {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'verified';
  assignee: User;
  dueDate: string;
  completedDate?: string;
  effectiveness?: 'effective' | 'partially-effective' | 'ineffective';
}

export interface ImpactAssessment {
  productImpact: boolean;
  customerImpact: boolean;
  regulatoryImpact: boolean;
  financialImpact: boolean;
  description: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  user: User;
  timestamp: string;
  details: string;
  oldValue?: string;
  newValue?: string;
}

// Mock Users
export const mockUsers: User[] = [
  { id: '1', name: 'John Smith', email: 'john.smith@company.com', role: 'Compliance Manager', initials: 'JS', department: 'Quality Assurance', status: 'active' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah.johnson@company.com', role: 'EHS Officer', initials: 'SJ', department: 'EHS', status: 'active' },
  { id: '3', name: 'Mike Williams', email: 'mike.williams@company.com', role: 'Auditor', initials: 'MW', department: 'Internal Audit', status: 'active' },
  { id: '4', name: 'Emily Davis', email: 'emily.davis@company.com', role: 'QA Manager', initials: 'ED', department: 'Quality Assurance', status: 'active' },
  { id: '5', name: 'Robert Chen', email: 'robert.chen@company.com', role: 'Production Lead', initials: 'RC', department: 'Production', status: 'active' },
  { id: '6', name: 'Lisa Anderson', email: 'lisa.anderson@company.com', role: 'Department Head', initials: 'LA', department: 'Operations', status: 'active' },
  { id: '7', name: 'David Kim', email: 'david.kim@company.com', role: 'Quality Engineer', initials: 'DK', department: 'Engineering', status: 'active' },
  { id: '8', name: 'Jennifer Walsh', email: 'jennifer.walsh@company.com', role: 'Regulatory Affairs', initials: 'JW', department: 'Regulatory', status: 'active' },
];

export const currentUser: User = mockUsers[0];

// Mock Quality Events
export const mockQualityEvents: QualityEvent[] = [
  {
    id: 'QE-2025-001',
    title: 'Temperature deviation in cold storage unit B3',
    description: 'Temperature recorded at 12°C exceeding the 8°C threshold for 45 minutes during night shift.',
    status: 'triage',
    priority: 'high',
    category: 'Environmental Control',
    source: 'Automated Monitoring',
    reporter: mockUsers[4],
    assignee: mockUsers[1],
    createdAt: '2025-01-15T08:30:00Z',
    updatedAt: '2025-01-15T10:15:00Z',
    dueDate: '2025-01-17T17:00:00Z',
    riskScore: 72,
    location: 'Building A - Cold Storage',
    department: 'Production',
    attachments: 3,
    comments: 5,
  },
  {
    id: 'QE-2025-002',
    title: 'Missing signature on batch release documentation',
    description: 'Batch 2025-B-0892 was released without the required secondary QA review signature.',
    status: 'validated',
    priority: 'medium',
    category: 'Documentation',
    source: 'Internal Audit',
    reporter: mockUsers[2],
    assignee: mockUsers[3],
    createdAt: '2025-01-14T14:22:00Z',
    updatedAt: '2025-01-15T09:00:00Z',
    dueDate: '2025-01-18T17:00:00Z',
    riskScore: 45,
    location: 'Quality Lab',
    department: 'Quality Assurance',
    attachments: 1,
    comments: 8,
  },
  {
    id: 'QE-2025-003',
    title: 'Supplier certificate expiration notice',
    description: 'ISO certification for supplier SUP-0234 expires in 30 days without renewal confirmation.',
    status: 'submitted',
    priority: 'low',
    category: 'Supplier Quality',
    source: 'Supplier Management System',
    reporter: mockUsers[7],
    createdAt: '2025-01-15T11:00:00Z',
    updatedAt: '2025-01-15T11:00:00Z',
    dueDate: '2025-02-15T17:00:00Z',
    riskScore: 28,
    location: 'N/A',
    department: 'Procurement',
    attachments: 2,
    comments: 1,
  },
  {
    id: 'QE-2025-004',
    title: 'Customer complaint - Product discoloration',
    description: 'Customer reported unusual discoloration on product batch 2024-C-1156. Photos attached.',
    status: 'escalated',
    priority: 'critical',
    category: 'Customer Complaint',
    source: 'Customer Service',
    reporter: mockUsers[5],
    assignee: mockUsers[0],
    createdAt: '2025-01-13T09:45:00Z',
    updatedAt: '2025-01-15T14:30:00Z',
    dueDate: '2025-01-16T12:00:00Z',
    riskScore: 89,
    location: 'Customer Site',
    department: 'Customer Service',
    attachments: 5,
    comments: 12,
  },
  {
    id: 'QE-2025-005',
    title: 'Calibration overdue for pressure gauge PG-445',
    description: 'Pressure gauge PG-445 in mixing area is 7 days past calibration due date.',
    status: 'closed',
    priority: 'medium',
    category: 'Equipment',
    source: 'Calibration System',
    reporter: mockUsers[6],
    assignee: mockUsers[6],
    createdAt: '2025-01-10T16:00:00Z',
    updatedAt: '2025-01-14T11:20:00Z',
    dueDate: '2025-01-12T17:00:00Z',
    riskScore: 35,
    location: 'Building B - Mixing Area',
    department: 'Production',
    attachments: 2,
    comments: 4,
  },
  {
    id: 'QE-2025-006',
    title: 'Process deviation during batch mixing',
    description: 'Mixing time exceeded specification by 15 minutes due to operator error.',
    status: 'draft',
    priority: 'medium',
    category: 'Process Deviation',
    source: 'Operator Report',
    reporter: mockUsers[4],
    createdAt: '2025-01-15T15:30:00Z',
    updatedAt: '2025-01-15T15:30:00Z',
    dueDate: '2025-01-20T17:00:00Z',
    riskScore: 42,
    location: 'Building B - Mixing Area',
    department: 'Production',
    attachments: 0,
    comments: 0,
  },
];

// Mock Incidents
export const mockIncidents: Incident[] = [
  {
    id: 'INC-2025-001',
    eventId: 'QE-2025-004',
    title: 'Product Quality Issue - Batch Discoloration',
    description: 'Escalated from QE-2025-004. Multiple customer units affected. Root cause investigation initiated.',
    status: 'investigation',
    severity: 'critical',
    owner: mockUsers[0],
    qaApprover: mockUsers[3],
    createdAt: '2025-01-13T15:00:00Z',
    updatedAt: '2025-01-15T16:00:00Z',
    dueDate: '2025-01-20T17:00:00Z',
    containmentActions: ['Quarantine remaining batch inventory', 'Issue customer advisory', 'Halt production line 3'],
    correctiveActions: [
      {
        id: 'CA-001',
        title: 'Update raw material inspection procedure',
        description: 'Add visual inspection step for incoming materials',
        status: 'in-progress',
        assignee: mockUsers[3],
        dueDate: '2025-01-22T17:00:00Z',
      },
      {
        id: 'CA-002',
        title: 'Retrain operators on color acceptance criteria',
        description: 'Conduct refresher training for all production operators',
        status: 'pending',
        assignee: mockUsers[4],
        dueDate: '2025-01-25T17:00:00Z',
      },
    ],
    impactAssessment: {
      productImpact: true,
      customerImpact: true,
      regulatoryImpact: false,
      financialImpact: true,
      description: 'Estimated 500 units affected. Customer satisfaction impact. Potential recall costs.',
    },
  },
  {
    id: 'INC-2025-002',
    eventId: 'QE-2024-089',
    title: 'Equipment Failure - Sterilization Unit',
    description: 'Sterilization unit SU-02 failed validation check. All batches processed between Jan 5-7 under review.',
    status: 'corrective-action',
    severity: 'major',
    owner: mockUsers[6],
    qaApprover: mockUsers[3],
    createdAt: '2025-01-08T10:00:00Z',
    updatedAt: '2025-01-14T09:00:00Z',
    dueDate: '2025-01-25T17:00:00Z',
    rootCause: 'Heating element degradation due to lack of preventive maintenance.',
    containmentActions: ['Quarantine affected batches', 'Switch to backup unit SU-03'],
    correctiveActions: [
      {
        id: 'CA-003',
        title: 'Replace heating element',
        description: 'Install new heating element and validate',
        status: 'completed',
        assignee: mockUsers[6],
        dueDate: '2025-01-12T17:00:00Z',
        completedDate: '2025-01-11T14:00:00Z',
      },
      {
        id: 'CA-004',
        title: 'Update PM schedule',
        description: 'Increase preventive maintenance frequency',
        status: 'in-progress',
        assignee: mockUsers[6],
        dueDate: '2025-01-20T17:00:00Z',
      },
    ],
    impactAssessment: {
      productImpact: true,
      customerImpact: false,
      regulatoryImpact: true,
      financialImpact: true,
      description: '12 batches quarantined pending investigation. Equipment downtime costs incurred.',
    },
  },
  {
    id: 'INC-2025-003',
    eventId: 'QE-2025-007',
    title: 'Chemical Spill in Mixing Area',
    description: 'Accidental spillage of solvent during transfer operations. Immediate containment required.',
    status: 'containment',
    severity: 'major',
    owner: mockUsers[1],
    qaApprover: mockUsers[3],
    createdAt: '2025-01-16T08:00:00Z',
    updatedAt: '2025-01-16T10:00:00Z',
    dueDate: '2025-01-18T17:00:00Z',
    containmentActions: ['Evacuate affected area', 'Deploy spill kit', 'Notify EHS team'],
    correctiveActions: [],
    impactAssessment: {
      productImpact: false,
      customerImpact: false,
      regulatoryImpact: true,
      financialImpact: true,
      description: 'Environmental compliance issue. Cleanup costs estimated at $5,000.',
    },
  },
  {
    id: 'INC-2025-004',
    eventId: 'QE-2025-008',
    title: 'Raw Material Contamination Detected',
    description: 'Incoming raw material lot RM-2025-445 failed purity testing. Quarantine initiated.',
    status: 'open',
    severity: 'critical',
    owner: mockUsers[7],
    qaApprover: mockUsers[3],
    createdAt: '2025-01-17T09:30:00Z',
    updatedAt: '2025-01-17T11:00:00Z',
    dueDate: '2025-01-19T17:00:00Z',
    containmentActions: ['Quarantine lot RM-2025-445', 'Hold affected production batches'],
    correctiveActions: [],
    impactAssessment: {
      productImpact: true,
      customerImpact: false,
      regulatoryImpact: true,
      financialImpact: true,
      description: 'Potential batch rejection. Supplier audit required.',
    },
  },
  {
    id: 'INC-2025-005',
    eventId: 'QE-2025-009',
    title: 'Packaging Label Mismatch',
    description: 'Wrong labels applied to batch 2025-P-0123. Customer shipment on hold.',
    status: 'containment',
    severity: 'minor',
    owner: mockUsers[4],
    qaApprover: mockUsers[3],
    createdAt: '2025-01-17T14:00:00Z',
    updatedAt: '2025-01-17T15:30:00Z',
    dueDate: '2025-01-20T17:00:00Z',
    containmentActions: ['Hold shipment', 'Segregate mislabeled units', 'Verify remaining inventory'],
    correctiveActions: [],
    impactAssessment: {
      productImpact: true,
      customerImpact: true,
      regulatoryImpact: false,
      financialImpact: false,
      description: 'Delayed shipment. Relabeling required for 200 units.',
    },
  },
  {
    id: 'INC-2025-006',
    eventId: 'QE-2025-010',
    title: 'Power Outage Impact on Cold Storage',
    description: 'Unplanned power outage affected cold storage units for 2 hours. Temperature excursion recorded.',
    status: 'open',
    severity: 'major',
    owner: mockUsers[5],
    qaApprover: mockUsers[3],
    createdAt: '2025-01-18T06:00:00Z',
    updatedAt: '2025-01-18T08:00:00Z',
    dueDate: '2025-01-21T17:00:00Z',
    containmentActions: ['Assess affected inventory', 'Document temperature logs', 'Activate backup generators'],
    correctiveActions: [],
    impactAssessment: {
      productImpact: true,
      customerImpact: false,
      regulatoryImpact: true,
      financialImpact: true,
      description: 'Potential product spoilage. Stability testing required.',
    },
  },
  {
    id: 'INC-2025-007',
    eventId: 'QE-2025-011',
    title: 'CAPA Effectiveness Review - Training Program',
    description: 'Review of corrective actions for operator training deficiencies.',
    status: 'effectiveness',
    severity: 'minor',
    owner: mockUsers[3],
    qaApprover: mockUsers[0],
    createdAt: '2025-01-05T10:00:00Z',
    updatedAt: '2025-01-15T14:00:00Z',
    dueDate: '2025-01-22T17:00:00Z',
    rootCause: 'Inadequate operator training on new equipment.',
    containmentActions: ['Suspend affected operators from equipment operation'],
    correctiveActions: [
      {
        id: 'CA-005',
        title: 'Develop comprehensive training module',
        description: 'Create hands-on training program for new equipment',
        status: 'completed',
        assignee: mockUsers[4],
        dueDate: '2025-01-10T17:00:00Z',
        completedDate: '2025-01-09T16:00:00Z',
      },
      {
        id: 'CA-006',
        title: 'Conduct training sessions',
        description: 'Train all affected operators',
        status: 'completed',
        assignee: mockUsers[4],
        dueDate: '2025-01-15T17:00:00Z',
        completedDate: '2025-01-14T12:00:00Z',
      },
    ],
    impactAssessment: {
      productImpact: false,
      customerImpact: false,
      regulatoryImpact: false,
      financialImpact: false,
      description: 'Training improvements implemented.',
    },
  },
  {
    id: 'INC-2025-008',
    eventId: 'QE-2025-012',
    title: 'Documentation Control Improvement',
    description: 'Lessons learned from multiple documentation errors in Q4 2024.',
    status: 'lessons-learned',
    severity: 'minor',
    owner: mockUsers[2],
    qaApprover: mockUsers[0],
    createdAt: '2025-01-02T09:00:00Z',
    updatedAt: '2025-01-16T11:00:00Z',
    dueDate: '2025-01-25T17:00:00Z',
    rootCause: 'Lack of standardized document review checklist.',
    containmentActions: ['Manual review of all pending documents'],
    correctiveActions: [
      {
        id: 'CA-007',
        title: 'Create standardized review checklist',
        description: 'Develop and implement document review checklist',
        status: 'verified',
        assignee: mockUsers[2],
        dueDate: '2025-01-08T17:00:00Z',
        completedDate: '2025-01-07T15:00:00Z',
        effectiveness: 'effective',
      },
    ],
    impactAssessment: {
      productImpact: false,
      customerImpact: false,
      regulatoryImpact: false,
      financialImpact: false,
      description: 'Process improvement initiative.',
    },
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  { id: '1', title: 'Event Escalated', message: 'QE-2025-004 has been escalated to incident status', type: 'warning', read: false, createdAt: '2025-01-15T14:30:00Z', link: '/incidents/INC-2025-001' },
  { id: '2', title: 'SLA Warning', message: 'QE-2025-001 is approaching SLA deadline', type: 'warning', read: false, createdAt: '2025-01-15T12:00:00Z', link: '/events/QE-2025-001' },
  { id: '3', title: 'New Assignment', message: 'You have been assigned to QE-2025-002', type: 'info', read: false, createdAt: '2025-01-15T09:00:00Z', link: '/events/QE-2025-002' },
  { id: '4', title: 'Action Completed', message: 'Corrective action CA-003 has been marked complete', type: 'success', read: true, createdAt: '2025-01-14T16:00:00Z', link: '/incidents/INC-2025-002' },
  { id: '5', title: 'Approval Required', message: 'QE-2025-005 requires your QA approval for closure', type: 'info', read: true, createdAt: '2025-01-14T11:00:00Z', link: '/events/QE-2025-005' },
];

// Mock Audit Log
export const mockAuditLog: AuditLogEntry[] = [
  { id: '1', action: 'Status Changed', entity: 'Quality Event', entityId: 'QE-2025-004', user: mockUsers[0], timestamp: '2025-01-15T14:30:00Z', details: 'Event escalated to incident', oldValue: 'validated', newValue: 'escalated' },
  { id: '2', action: 'Assigned', entity: 'Quality Event', entityId: 'QE-2025-001', user: mockUsers[1], timestamp: '2025-01-15T10:15:00Z', details: 'Event assigned for triage', newValue: 'Sarah Johnson' },
  { id: '3', action: 'Comment Added', entity: 'Quality Event', entityId: 'QE-2025-002', user: mockUsers[3], timestamp: '2025-01-15T09:00:00Z', details: 'Added clarification request' },
  { id: '4', action: 'Risk Score Updated', entity: 'Quality Event', entityId: 'QE-2025-004', user: mockUsers[0], timestamp: '2025-01-14T16:00:00Z', details: 'Risk assessment completed', oldValue: '65', newValue: '89' },
  { id: '5', action: 'Attachment Added', entity: 'Incident', entityId: 'INC-2025-001', user: mockUsers[4], timestamp: '2025-01-14T14:00:00Z', details: 'Uploaded photos from production line' },
];

// Dashboard Stats
export const dashboardStats = {
  openEvents: 4,
  criticalEvents: 1,
  openIncidents: 2,
  slaBreaches: 1,
  pendingApprovals: 3,
  completedThisMonth: 12,
  avgResolutionTime: 3.5,
  trendDirection: 'improving' as const,
};

// Risk Matrix Data
export const riskMatrixData = {
  categories: ['Severity', 'Probability', 'Detectability'],
  levels: [
    { level: 1, label: 'Negligible', color: 'success' },
    { level: 2, label: 'Minor', color: 'success' },
    { level: 3, label: 'Moderate', color: 'warning' },
    { level: 4, label: 'Major', color: 'warning' },
    { level: 5, label: 'Critical', color: 'destructive' },
  ],
};

// SLA Rules
export const slaRules = [
  { id: '1', name: 'Critical Event Triage', priority: 'critical', targetHours: 4, escalationHours: 2 },
  { id: '2', name: 'High Priority Event Triage', priority: 'high', targetHours: 24, escalationHours: 12 },
  { id: '3', name: 'Medium Priority Event Resolution', priority: 'medium', targetHours: 72, escalationHours: 48 },
  { id: '4', name: 'Low Priority Event Resolution', priority: 'low', targetHours: 168, escalationHours: 120 },
  { id: '5', name: 'Incident Investigation', priority: 'all', targetHours: 120, escalationHours: 96 },
];

// Organization Settings
export const organizationSettings = {
  name: 'Soapbox Industries',
  timezone: 'America/New_York',
  dateFormat: 'MM/DD/YYYY',
  fiscalYearStart: 'January',
  sites: ['Headquarters', 'Building A', 'Building B', 'Quality Lab', 'Warehouse'],
  departments: ['Quality Assurance', 'Production', 'EHS', 'Engineering', 'Regulatory', 'Internal Audit', 'Procurement', 'Customer Service'],
};

// Help & Training Resources
export const trainingResources = [
  { id: '1', title: 'Getting Started with Quality Events', type: 'video', duration: '15 min', url: '#' },
  { id: '2', title: 'Risk Assessment Guide', type: 'document', pages: 24, url: '#' },
  { id: '3', title: 'Incident Management Workflow', type: 'video', duration: '22 min', url: '#' },
  { id: '4', title: 'SPC & Quality Analytics Overview', type: 'document', pages: 18, url: '#' },
  { id: '5', title: 'Corrective Action Best Practices', type: 'video', duration: '18 min', url: '#' },
  { id: '6', title: 'Audit Trail and Compliance', type: 'document', pages: 12, url: '#' },
];
