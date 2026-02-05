// Mock Data for Soapbox Cloud - Complaints & Customer Feedback Module

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  initials: string;
}

export interface Complaint {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
  category: string;
  subCategory: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  status: 'New' | 'Triaged' | 'Investigating' | 'Pending RCA' | 'Pending Resolution' | 'Resolved' | 'Closed' | 'Rejected';
  slaStatus: 'ok' | 'warning' | 'breached';
  slaDueDate: string;
  owner?: string;
  assignee?: string;
  site: string;
  productName: string;
  productCode: string;
  batchNumber?: string;
  regulatoryFlag: boolean;
  createdAt: string;
  updatedAt: string;
  acknowledgedAt?: string;
  investigationStartedAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  source: 'Portal' | 'Email' | 'Phone' | 'Internal' | 'API';
  linkedCapa?: string;
  linkedIncident?: string;
  linkedNcr?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface AuditLogEntry {
  id: string;
  complaintId: string;
  action: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  performedBy: string;
  performedAt: string;
  ipAddress?: string;
}

export interface Communication {
  id: string;
  complaintId: string;
  type: 'Email' | 'Portal' | 'SMS' | 'Phone' | 'Internal';
  direction: 'Inbound' | 'Outbound';
  subject: string;
  content: string;
  sender: string;
  recipient: string;
  createdAt: string;
  attachments?: string[];
}

export interface Attachment {
  id: string;
  complaintId: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
  isCustomerVisible: boolean;
  category: 'Evidence' | 'Documentation' | 'Communication' | 'Resolution' | 'Other';
}

export const currentUser: User = {
  id: 'user-001',
  name: 'John Doe',
  email: 'john.doe@company.com',
  role: 'Compliance Manager',
  initials: 'JD',
};

export const mockUsers: User[] = [
  currentUser,
  { id: 'user-002', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'QA Manager', initials: 'SC' },
  { id: 'user-003', name: 'Mike Rodriguez', email: 'mike.rodriguez@company.com', role: 'EHS Officer', initials: 'MR' },
  { id: 'user-004', name: 'Jennifer Walsh', email: 'jennifer.walsh@company.com', role: 'Investigator', initials: 'JW' },
  { id: 'user-005', name: 'David Kim', email: 'david.kim@company.com', role: 'Auditor', initials: 'DK' },
  { id: 'user-006', name: 'Emily Carter', email: 'emily.carter@company.com', role: 'CSA', initials: 'EC' },
  { id: 'user-007', name: 'Robert Johnson', email: 'robert.johnson@company.com', role: 'Regulatory Officer', initials: 'RJ' },
  { id: 'user-008', name: 'Lisa Martinez', email: 'lisa.martinez@company.com', role: 'Triage Officer', initials: 'LM' },
];

export const mockComplaints: Complaint[] = [
  {
    id: 'CMP-2025-0001',
    customerId: 'CUST-001',
    customerName: 'Acme Healthcare Inc.',
    customerEmail: 'quality@acmehealthcare.com',
    subject: 'Device malfunction during critical procedure',
    description: 'The XR-500 monitoring device failed to display readings during a patient procedure. Device was reset but issue persisted.',
    category: 'Product Quality',
    subCategory: 'Device Malfunction',
    severity: 'Critical',
    priority: 'P1',
    status: 'Investigating',
    slaStatus: 'warning',
    slaDueDate: '2025-01-08',
    owner: 'Sarah Chen',
    assignee: 'Jennifer Walsh',
    site: 'Boston Manufacturing',
    productName: 'XR-500 Monitor',
    productCode: 'XR-500-A1',
    batchNumber: 'BTH-2024-1205',
    regulatoryFlag: true,
    createdAt: '2025-01-03T10:30:00Z',
    updatedAt: '2025-01-06T14:20:00Z',
    acknowledgedAt: '2025-01-03T11:00:00Z',
    investigationStartedAt: '2025-01-04T09:00:00Z',
    source: 'Portal',
    linkedIncident: 'INC-2025-0042',
  },
  {
    id: 'CMP-2025-0002',
    customerId: 'CUST-002',
    customerName: 'Metro General Hospital',
    customerEmail: 'procurement@metrogeneral.org',
    subject: 'Packaging damage on delivery',
    description: 'Multiple units arrived with visible damage to outer packaging. Inner packaging appears intact but customer requests inspection.',
    category: 'Logistics',
    subCategory: 'Shipping Damage',
    severity: 'Medium',
    priority: 'P3',
    status: 'Triaged',
    slaStatus: 'ok',
    slaDueDate: '2025-01-12',
    owner: 'Emily Carter',
    site: 'Chicago Distribution',
    productName: 'Surgical Kit Pro',
    productCode: 'SKP-200',
    batchNumber: 'BTH-2024-1198',
    regulatoryFlag: false,
    createdAt: '2025-01-05T14:00:00Z',
    updatedAt: '2025-01-06T09:15:00Z',
    acknowledgedAt: '2025-01-05T14:30:00Z',
    source: 'Email',
  },
  {
    id: 'CMP-2025-0003',
    customerId: 'CUST-003',
    customerName: 'Valley Medical Center',
    customerEmail: 'operations@valleymed.net',
    subject: 'Calibration drift detected in laboratory equipment',
    description: 'Quality control tests revealed calibration drift beyond acceptable range in LabPro-3000 analyzer. Affecting patient sample results.',
    category: 'Product Quality',
    subCategory: 'Calibration Issue',
    severity: 'High',
    priority: 'P2',
    status: 'Pending RCA',
    slaStatus: 'ok',
    slaDueDate: '2025-01-10',
    owner: 'Sarah Chen',
    assignee: 'Mike Rodriguez',
    site: 'San Diego Lab',
    productName: 'LabPro-3000 Analyzer',
    productCode: 'LP-3000-X',
    batchNumber: 'BTH-2024-1150',
    regulatoryFlag: true,
    createdAt: '2025-01-02T08:45:00Z',
    updatedAt: '2025-01-06T16:00:00Z',
    acknowledgedAt: '2025-01-02T09:15:00Z',
    investigationStartedAt: '2025-01-03T10:00:00Z',
    source: 'Internal',
    linkedCapa: 'CAPA-2025-0012',
  },
  {
    id: 'CMP-2025-0004',
    customerId: 'CUST-004',
    customerName: 'Premier Diagnostics LLC',
    customerEmail: 'support@premierdiag.com',
    subject: 'Software update caused data display errors',
    description: 'After latest software update v2.3.1, test results are displaying incorrectly on the DiagMax interface. Rolled back to previous version.',
    category: 'Software',
    subCategory: 'Display Error',
    severity: 'High',
    priority: 'P2',
    status: 'New',
    slaStatus: 'ok',
    slaDueDate: '2025-01-11',
    site: 'Remote Support',
    productName: 'DiagMax Software',
    productCode: 'DMS-2.3',
    regulatoryFlag: false,
    createdAt: '2025-01-06T11:30:00Z',
    updatedAt: '2025-01-06T11:30:00Z',
    source: 'Phone',
  },
  {
    id: 'CMP-2025-0005',
    customerId: 'CUST-005',
    customerName: 'Coastal Clinic Group',
    customerEmail: 'admin@coastalclinic.com',
    subject: 'Documentation discrepancy in IFU',
    description: 'Instructions for Use document references outdated sterilization procedure. Current procedure differs from documentation.',
    category: 'Documentation',
    subCategory: 'IFU Error',
    severity: 'Low',
    priority: 'P4',
    status: 'Resolved',
    slaStatus: 'ok',
    slaDueDate: '2025-01-08',
    owner: 'Robert Johnson',
    assignee: 'David Kim',
    site: 'Corporate HQ',
    productName: 'SterileMax Autoclave',
    productCode: 'SMA-400',
    regulatoryFlag: true,
    createdAt: '2024-12-28T15:00:00Z',
    updatedAt: '2025-01-05T10:00:00Z',
    acknowledgedAt: '2024-12-28T15:30:00Z',
    investigationStartedAt: '2024-12-29T09:00:00Z',
    resolvedAt: '2025-01-05T10:00:00Z',
    source: 'Portal',
  },
  {
    id: 'CMP-2025-0006',
    customerId: 'CUST-006',
    customerName: 'Northern Health System',
    customerEmail: 'quality.assurance@northernhealth.org',
    subject: 'Allergic reaction reported with skin contact',
    description: 'Patient reported mild allergic reaction after contact with disposable sensor pads. Material composition review requested.',
    category: 'Safety',
    subCategory: 'Adverse Reaction',
    severity: 'Critical',
    priority: 'P1',
    status: 'Investigating',
    slaStatus: 'breached',
    slaDueDate: '2025-01-05',
    owner: 'Sarah Chen',
    assignee: 'Jennifer Walsh',
    site: 'Boston Manufacturing',
    productName: 'BioSense Pads',
    productCode: 'BSP-100',
    batchNumber: 'BTH-2024-1180',
    regulatoryFlag: true,
    createdAt: '2025-01-01T09:00:00Z',
    updatedAt: '2025-01-06T08:30:00Z',
    acknowledgedAt: '2025-01-01T09:30:00Z',
    investigationStartedAt: '2025-01-02T08:00:00Z',
    source: 'Email',
    linkedIncident: 'INC-2025-0038',
    linkedNcr: 'NCR-2025-0015',
  },
  {
    id: 'CMP-2025-0007',
    customerId: 'CUST-007',
    customerName: 'Pacific Research Institute',
    customerEmail: 'purchasing@pacificresearch.edu',
    subject: 'Positive feedback on new product line',
    description: 'Customer expressed high satisfaction with the new ResearchPro line. Requested early access to upcoming features.',
    category: 'Feedback',
    subCategory: 'Positive Feedback',
    severity: 'Low',
    priority: 'P4',
    status: 'Closed',
    slaStatus: 'ok',
    slaDueDate: '2025-01-04',
    owner: 'Emily Carter',
    site: 'Corporate HQ',
    productName: 'ResearchPro Suite',
    productCode: 'RPS-500',
    regulatoryFlag: false,
    createdAt: '2024-12-30T13:00:00Z',
    updatedAt: '2025-01-03T11:00:00Z',
    acknowledgedAt: '2024-12-30T13:30:00Z',
    resolvedAt: '2025-01-02T14:00:00Z',
    closedAt: '2025-01-03T11:00:00Z',
    source: 'Portal',
  },
  {
    id: 'CMP-2025-0008',
    customerId: 'CUST-008',
    customerName: 'Midwest Medical Supplies',
    customerEmail: 'orders@midwestmed.com',
    subject: 'Incomplete order fulfillment',
    description: 'Order #ORD-45892 was missing 3 units of product SKU-MX-200. Customer requires immediate reshipment.',
    category: 'Logistics',
    subCategory: 'Order Fulfillment',
    severity: 'Medium',
    priority: 'P3',
    status: 'Pending Resolution',
    slaStatus: 'warning',
    slaDueDate: '2025-01-07',
    owner: 'Emily Carter',
    assignee: 'Lisa Martinez',
    site: 'Chicago Distribution',
    productName: 'MedKit Essential',
    productCode: 'MKE-200',
    regulatoryFlag: false,
    createdAt: '2025-01-04T16:20:00Z',
    updatedAt: '2025-01-06T12:00:00Z',
    acknowledgedAt: '2025-01-04T16:45:00Z',
    investigationStartedAt: '2025-01-05T08:00:00Z',
    source: 'Phone',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    title: 'SLA Breach Alert',
    message: 'Complaint CMP-2025-0006 has breached SLA deadline',
    type: 'error',
    read: false,
    createdAt: '2025-01-06T08:30:00Z',
    link: '/complaints/CMP-2025-0006',
  },
  {
    id: 'notif-002',
    title: 'New Assignment',
    message: 'You have been assigned to investigate CMP-2025-0004',
    type: 'info',
    read: false,
    createdAt: '2025-01-06T11:35:00Z',
    link: '/complaints/CMP-2025-0004',
  },
  {
    id: 'notif-003',
    title: 'RCA Approval Required',
    message: 'Root cause analysis for CMP-2025-0003 pending your approval',
    type: 'warning',
    read: false,
    createdAt: '2025-01-06T16:05:00Z',
    link: '/complaints/CMP-2025-0003',
  },
  {
    id: 'notif-004',
    title: 'Complaint Resolved',
    message: 'CMP-2025-0005 has been successfully resolved',
    type: 'success',
    read: true,
    createdAt: '2025-01-05T10:05:00Z',
    link: '/complaints/CMP-2025-0005',
  },
];

export const mockAuditLog: AuditLogEntry[] = [
  {
    id: 'audit-001',
    complaintId: 'CMP-2025-0001',
    action: 'Created',
    performedBy: 'System',
    performedAt: '2025-01-03T10:30:00Z',
    ipAddress: '192.168.1.100',
  },
  {
    id: 'audit-002',
    complaintId: 'CMP-2025-0001',
    action: 'Status Changed',
    field: 'status',
    oldValue: 'New',
    newValue: 'Triaged',
    performedBy: 'Lisa Martinez',
    performedAt: '2025-01-03T11:00:00Z',
    ipAddress: '192.168.1.105',
  },
  {
    id: 'audit-003',
    complaintId: 'CMP-2025-0001',
    action: 'Assigned',
    field: 'assignee',
    newValue: 'Jennifer Walsh',
    performedBy: 'Sarah Chen',
    performedAt: '2025-01-04T09:00:00Z',
    ipAddress: '192.168.1.110',
  },
  {
    id: 'audit-004',
    complaintId: 'CMP-2025-0001',
    action: 'Status Changed',
    field: 'status',
    oldValue: 'Triaged',
    newValue: 'Investigating',
    performedBy: 'Jennifer Walsh',
    performedAt: '2025-01-04T09:15:00Z',
    ipAddress: '192.168.1.112',
  },
  {
    id: 'audit-005',
    complaintId: 'CMP-2025-0001',
    action: 'Attachment Added',
    field: 'attachments',
    newValue: 'device_log_20250104.pdf',
    performedBy: 'Jennifer Walsh',
    performedAt: '2025-01-05T14:30:00Z',
    ipAddress: '192.168.1.112',
  },
];

export const mockCommunications: Communication[] = [
  {
    id: 'comm-001',
    complaintId: 'CMP-2025-0001',
    type: 'Email',
    direction: 'Inbound',
    subject: 'Re: Device Malfunction Report',
    content: 'Thank you for acknowledging our complaint. We have attached additional photos of the device display during the malfunction.',
    sender: 'quality@acmehealthcare.com',
    recipient: 'complaints@soapbox.cloud',
    createdAt: '2025-01-04T08:45:00Z',
    attachments: ['malfunction_photos.zip'],
  },
  {
    id: 'comm-002',
    complaintId: 'CMP-2025-0001',
    type: 'Email',
    direction: 'Outbound',
    subject: 'Investigation Update - CMP-2025-0001',
    content: 'Dear Acme Healthcare Team, We are actively investigating your reported issue. Our team has identified a potential firmware issue and is conducting root cause analysis.',
    sender: 'jennifer.walsh@soapbox.cloud',
    recipient: 'quality@acmehealthcare.com',
    createdAt: '2025-01-05T16:00:00Z',
  },
];

export const mockAttachments: Attachment[] = [
  {
    id: 'attach-001',
    complaintId: 'CMP-2025-0001',
    fileName: 'device_log_20250104.pdf',
    fileSize: '2.4 MB',
    fileType: 'PDF',
    uploadedBy: 'Jennifer Walsh',
    uploadedAt: '2025-01-05T14:30:00Z',
    isCustomerVisible: false,
    category: 'Evidence',
  },
  {
    id: 'attach-002',
    complaintId: 'CMP-2025-0001',
    fileName: 'malfunction_photos.zip',
    fileSize: '15.8 MB',
    fileType: 'ZIP',
    uploadedBy: 'Customer',
    uploadedAt: '2025-01-04T08:45:00Z',
    isCustomerVisible: true,
    category: 'Evidence',
  },
  {
    id: 'attach-003',
    complaintId: 'CMP-2025-0001',
    fileName: 'initial_investigation_report.docx',
    fileSize: '456 KB',
    fileType: 'DOCX',
    uploadedBy: 'Jennifer Walsh',
    uploadedAt: '2025-01-06T10:00:00Z',
    isCustomerVisible: false,
    category: 'Documentation',
  },
];

export const categories = [
  'Product Quality',
  'Safety',
  'Logistics',
  'Documentation',
  'Software',
  'Service',
  'Feedback',
];

export const subCategories: Record<string, string[]> = {
  'Product Quality': ['Device Malfunction', 'Calibration Issue', 'Manufacturing Defect', 'Material Issue'],
  'Safety': ['Adverse Reaction', 'Injury Report', 'Near Miss', 'Safety Concern'],
  'Logistics': ['Shipping Damage', 'Order Fulfillment', 'Delivery Delay', 'Wrong Item'],
  'Documentation': ['IFU Error', 'Label Issue', 'Missing Documentation', 'Translation Error'],
  'Software': ['Display Error', 'Performance Issue', 'Data Loss', 'Integration Problem'],
  'Service': ['Response Time', 'Technical Support', 'Training Request', 'Account Issue'],
  'Feedback': ['Positive Feedback', 'Suggestion', 'Feature Request', 'General Comment'],
};

export const sites = [
  'Boston Manufacturing',
  'Chicago Distribution',
  'San Diego Lab',
  'Corporate HQ',
  'Remote Support',
  'Berlin Facility',
  'Tokyo Office',
];

export const rcaMethods = [
  { id: '5whys', name: '5 Whys', description: 'Ask "why" five times to drill down to root cause' },
  { id: 'fishbone', name: 'Fishbone (Ishikawa)', description: 'Categorize potential causes of problems' },
  { id: 'fmea', name: 'FMEA', description: 'Failure Mode and Effects Analysis' },
  { id: 'fault-tree', name: 'Fault Tree Analysis', description: 'Top-down deductive failure analysis' },
];

export const regulations = [
  { id: 'fda-mdr', name: 'FDA MDR', description: 'Medical Device Reporting (21 CFR Part 803)' },
  { id: 'eu-mdr', name: 'EU MDR', description: 'European Medical Device Regulation' },
  { id: 'iso-13485', name: 'ISO 13485', description: 'Medical Devices Quality Management' },
  { id: 'iso-9001', name: 'ISO 9001', description: 'Quality Management Systems' },
  { id: 'iatf-16949', name: 'IATF 16949', description: 'Automotive Quality Management' },
];

export const dashboardKPIs = {
  openComplaints: 6,
  highCritical: 3,
  slaAtRisk: 2,
  slaBreached: 1,
  avgResolutionDays: 4.2,
  csatScore: 4.3,
  npsScore: 42,
  totalThisMonth: 8,
  totalLastMonth: 12,
  resolvedThisMonth: 2,
};
