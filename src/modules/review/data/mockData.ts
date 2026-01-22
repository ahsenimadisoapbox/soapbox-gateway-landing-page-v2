// Mock data for the Management Review Module

export interface Review {
  id: string;
  title: string;
  period: string;
  status: 'planned' | 'in-progress' | 'completed' | 'closed';
  scheduledDate: string;
  site: string;
  participants: string[];
  progress: number;
  createdBy: string;
  createdAt: string;
}

export interface Action {
  id: string;
  title: string;
  description: string;
  owner: string;
  dueDate: string;
  status: 'open' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  reviewId: string;
  category: string;
  completedDate?: string;
}

export interface CAPA {
  id: string;
  title: string;
  description: string;
  type: 'corrective' | 'preventive';
  status: 'open' | 'investigation' | 'implementation' | 'verification' | 'closed';
  owner: string;
  dueDate: string;
  rootCause?: string;
  sourceType: string;
  sourceId: string;
  effectiveness?: 'effective' | 'ineffective' | 'pending';
}

export interface Decision {
  id: string;
  reviewId: string;
  title: string;
  description: string;
  category: 'resource' | 'process' | 'product' | 'compliance' | 'strategic';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  decision: string;
  madeBy: string;
  madeAt: string;
  actionRequired: boolean;
}

export interface Attendance {
  id: string;
  reviewId: string;
  participantId: string;
  participantName: string;
  role: string;
  mandatory: boolean;
  status: 'present' | 'absent' | 'excused';
  justification?: string;
}

export interface ISOInput {
  clause: string;
  title: string;
  description: string;
  status: 'pending' | 'reviewed' | 'completed';
  evidence: string[];
  conclusion?: string;
}

export const mockReviews: Review[] = [
  { id: 'MR-2025-Q1', title: 'Q1 2025 Management Review', period: 'Q1 2025', status: 'in-progress', scheduledDate: '2025-03-15', site: 'Headquarters', participants: ['John Doe', 'Sarah Chen', 'Mike Rodriguez'], progress: 65, createdBy: 'John Doe', createdAt: '2025-01-05' },
  { id: 'MR-2024-Q4', title: 'Q4 2024 Management Review', period: 'Q4 2024', status: 'closed', scheduledDate: '2024-12-20', site: 'Headquarters', participants: ['John Doe', 'Sarah Chen', 'Jennifer Walsh'], progress: 100, createdBy: 'John Doe', createdAt: '2024-10-01' },
  { id: 'MR-2024-Q3', title: 'Q3 2024 Management Review', period: 'Q3 2024', status: 'closed', scheduledDate: '2024-09-18', site: 'Manufacturing Plant A', participants: ['Sarah Chen', 'David Kim'], progress: 100, createdBy: 'Sarah Chen', createdAt: '2024-07-15' },
  { id: 'MR-2025-Q2', title: 'Q2 2025 Management Review', period: 'Q2 2025', status: 'planned', scheduledDate: '2025-06-15', site: 'All Sites', participants: [], progress: 0, createdBy: 'John Doe', createdAt: '2025-01-10' },
];

export const mockActions: Action[] = [
  { id: 'ACT-001', title: 'Update Risk Assessment Matrix', description: 'Review and update the organizational risk assessment matrix based on Q4 findings', owner: 'Sarah Chen', dueDate: '2025-02-28', status: 'in-progress', priority: 'high', reviewId: 'MR-2025-Q1', category: 'Risk Management' },
  { id: 'ACT-002', title: 'Implement Customer Feedback System', description: 'Deploy new customer satisfaction tracking tool', owner: 'Mike Rodriguez', dueDate: '2025-03-31', status: 'open', priority: 'medium', reviewId: 'MR-2025-Q1', category: 'Customer Satisfaction' },
  { id: 'ACT-003', title: 'Conduct Training Needs Analysis', description: 'Assess training requirements across all departments', owner: 'Jennifer Walsh', dueDate: '2025-01-20', status: 'overdue', priority: 'high', reviewId: 'MR-2024-Q4', category: 'Resources' },
  { id: 'ACT-004', title: 'Review Supplier Performance', description: 'Quarterly supplier audit and performance review', owner: 'David Kim', dueDate: '2025-02-15', status: 'completed', priority: 'medium', reviewId: 'MR-2024-Q4', category: 'External Providers', completedDate: '2025-02-10' },
  { id: 'ACT-005', title: 'Update Document Control Procedure', description: 'Revise SOP for document control based on audit findings', owner: 'John Doe', dueDate: '2025-04-01', status: 'open', priority: 'low', reviewId: 'MR-2025-Q1', category: 'Documentation' },
];

export const mockCAPAs: CAPA[] = [
  { id: 'CAPA-015', title: 'Non-conformance in Calibration Process', description: 'Systematic failure in calibration scheduling leading to expired calibrations', type: 'corrective', status: 'investigation', owner: 'Sarah Chen', dueDate: '2025-03-15', rootCause: 'Inadequate scheduling system', sourceType: 'Review', sourceId: 'MR-2025-Q1', effectiveness: 'pending' },
  { id: 'CAPA-014', title: 'Customer Complaint Trend Analysis', description: 'Recurring complaints about product packaging', type: 'preventive', status: 'implementation', owner: 'Mike Rodriguez', dueDate: '2025-02-28', rootCause: 'Packaging material quality variation', sourceType: 'Review', sourceId: 'MR-2024-Q4', effectiveness: 'pending' },
  { id: 'CAPA-013', title: 'Training Record Gaps', description: 'Missing training records for new equipment operators', type: 'corrective', status: 'verification', owner: 'Jennifer Walsh', dueDate: '2025-01-31', rootCause: 'Manual tracking process inadequate', sourceType: 'Audit', sourceId: 'AUD-2024-008', effectiveness: 'effective' },
  { id: 'CAPA-012', title: 'Risk Assessment Updates', description: 'Risk assessments not updated after process changes', type: 'preventive', status: 'closed', owner: 'John Doe', dueDate: '2024-12-15', rootCause: 'No automated trigger for updates', sourceType: 'Review', sourceId: 'MR-2024-Q3', effectiveness: 'effective' },
];

export const mockDecisions: Decision[] = [
  { id: 'DEC-001', reviewId: 'MR-2025-Q1', title: 'Approve Budget Increase for Quality Lab', description: 'Additional funding for lab equipment upgrade', category: 'resource', riskLevel: 'medium', decision: 'Approved $50,000 budget increase', madeBy: 'John Doe', madeAt: '2025-01-15', actionRequired: true },
  { id: 'DEC-002', reviewId: 'MR-2025-Q1', title: 'Implement New Supplier Qualification Process', description: 'Enhanced supplier evaluation criteria', category: 'process', riskLevel: 'high', decision: 'Implement phased rollout starting Q2', madeBy: 'Sarah Chen', madeAt: '2025-01-15', actionRequired: true },
  { id: 'DEC-003', reviewId: 'MR-2024-Q4', title: 'Defer Product Line Expansion', description: 'Postpone new product introduction', category: 'strategic', riskLevel: 'low', decision: 'Defer to H2 2025', madeBy: 'John Doe', madeAt: '2024-12-20', actionRequired: false },
];

export const mockISOInputs: ISOInput[] = [
  { clause: '9.3.2(a)', title: 'Status of Actions from Previous Reviews', description: 'Review status of actions from previous management reviews', status: 'completed', evidence: ['Previous review minutes', 'Action tracker report'], conclusion: 'All critical actions completed. 2 low-priority items carried forward.' },
  { clause: '9.3.2(b)', title: 'Changes in External and Internal Issues', description: 'Review changes that are relevant to the QMS', status: 'completed', evidence: ['Context analysis update', 'SWOT analysis'], conclusion: 'New regulatory requirements identified. Updated risk register accordingly.' },
  { clause: '9.3.2(c)', title: 'Customer Satisfaction and Feedback', description: 'Information on customer satisfaction and feedback from relevant interested parties', status: 'reviewed', evidence: ['Customer survey results', 'Complaint log', 'NPS scores'], conclusion: '' },
  { clause: '9.3.2(d)', title: 'Quality Objectives and Performance', description: 'The extent to which quality objectives have been met', status: 'pending', evidence: [], conclusion: '' },
  { clause: '9.3.2(e)', title: 'Process Performance and Product Conformity', description: 'Process performance and conformity of products and services', status: 'pending', evidence: [], conclusion: '' },
  { clause: '9.3.2(f)', title: 'Nonconformities and Corrective Actions', description: 'Nonconformities and corrective actions', status: 'pending', evidence: [], conclusion: '' },
  { clause: '9.3.2(g)', title: 'Monitoring and Measurement Results', description: 'Monitoring and measurement results', status: 'pending', evidence: [], conclusion: '' },
  { clause: '9.3.2(h)', title: 'Audit Results', description: 'Results of internal and external audits', status: 'pending', evidence: [], conclusion: '' },
  { clause: '9.3.2(i)', title: 'External Provider Performance', description: 'Performance of external providers', status: 'pending', evidence: [], conclusion: '' },
  { clause: '9.3.2(j)', title: 'Resource Adequacy', description: 'Adequacy of resources', status: 'pending', evidence: [], conclusion: '' },
  { clause: '9.3.2(k)', title: 'Risk and Opportunity Actions', description: 'Effectiveness of actions taken to address risks and opportunities', status: 'pending', evidence: [], conclusion: '' },
  { clause: '9.3.2(l)', title: 'Improvement Opportunities', description: 'Opportunities for improvement', status: 'pending', evidence: [], conclusion: '' },
];

export const mockAttendance: Attendance[] = [
  { id: 'ATT-001', reviewId: 'MR-2025-Q1', participantId: '1', participantName: 'John Doe', role: 'Compliance Manager', mandatory: true, status: 'present' },
  { id: 'ATT-002', reviewId: 'MR-2025-Q1', participantId: '2', participantName: 'Sarah Chen', role: 'Quality Head', mandatory: true, status: 'present' },
  { id: 'ATT-003', reviewId: 'MR-2025-Q1', participantId: '3', participantName: 'Mike Rodriguez', role: 'EHS Officer', mandatory: false, status: 'excused', justification: 'On-site emergency at Plant B' },
  { id: 'ATT-004', reviewId: 'MR-2025-Q1', participantId: '4', participantName: 'Jennifer Walsh', role: 'Process Owner', mandatory: true, status: 'present' },
  { id: 'ATT-005', reviewId: 'MR-2025-Q1', participantId: '5', participantName: 'David Kim', role: 'Auditor', mandatory: false, status: 'absent' },
];

export const dashboardStats = {
  totalReviews: 12,
  reviewsCompleted: 9,
  activeActions: 15,
  overdueActions: 3,
  openCAPAs: 4,
  pendingDecisions: 7,
  complianceScore: 94,
  maturityLevel: 4.2,
  nextReviewDate: '2025-03-15',
  daysUntilNextReview: 58,
};

export const calendarEvents = [
  { id: 'CAL-001', title: 'Q1 2025 Management Review', date: '2025-03-15', type: 'review', status: 'scheduled' },
  { id: 'CAL-002', title: 'Action ACT-001 Due', date: '2025-02-28', type: 'action', status: 'upcoming' },
  { id: 'CAL-003', title: 'CAPA-015 Due', date: '2025-03-15', type: 'capa', status: 'upcoming' },
  { id: 'CAL-004', title: 'Q2 2025 Management Review', date: '2025-06-15', type: 'review', status: 'planned' },
];

export const orgUnits = [
  { id: 'ORG-001', name: 'Headquarters', type: 'site', location: 'New York, NY', manager: 'John Doe' },
  { id: 'ORG-002', name: 'Manufacturing Plant A', type: 'site', location: 'Detroit, MI', manager: 'Mike Rodriguez' },
  { id: 'ORG-003', name: 'Manufacturing Plant B', type: 'site', location: 'Austin, TX', manager: 'Jennifer Walsh' },
  { id: 'ORG-004', name: 'R&D Center', type: 'site', location: 'San Francisco, CA', manager: 'David Kim' },
  { id: 'ORG-005', name: 'Quality Department', type: 'department', location: 'All Sites', manager: 'Sarah Chen' },
];

export const roles = [
  { id: 'ROLE-001', name: 'Administrator', permissions: ['all'], userCount: 2 },
  { id: 'ROLE-002', name: 'Compliance Manager', permissions: ['reviews', 'actions', 'capa', 'reports'], userCount: 3 },
  { id: 'ROLE-003', name: 'Quality Head', permissions: ['reviews', 'actions', 'capa', 'reports', 'settings'], userCount: 2 },
  { id: 'ROLE-004', name: 'Process Owner', permissions: ['actions', 'capa'], userCount: 8 },
  { id: 'ROLE-005', name: 'Auditor', permissions: ['reviews.view', 'reports.view'], userCount: 4 },
  { id: 'ROLE-006', name: 'Viewer', permissions: ['reviews.view'], userCount: 12 },
];

export const helpArticles = [
  { id: 'HELP-001', category: 'Getting Started', title: 'Introduction to Management Review Module', description: 'Learn the basics of the Management Review governance workflow', duration: '5 min read' },
  { id: 'HELP-002', category: 'Getting Started', title: 'Creating Your First Review', description: 'Step-by-step guide to creating and scheduling a management review', duration: '8 min read' },
  { id: 'HELP-003', category: 'ISO Compliance', title: 'Understanding ISO 9001 Clause 9.3', description: 'Detailed breakdown of ISO 9001:2015 Clause 9.3 requirements', duration: '15 min read' },
  { id: 'HELP-004', category: 'ISO Compliance', title: 'Preparing Evidence for Reviews', description: 'Best practices for gathering and presenting review evidence', duration: '10 min read' },
  { id: 'HELP-005', category: 'Actions & CAPA', title: 'Managing Review Actions', description: 'How to create, track, and close review actions effectively', duration: '7 min read' },
  { id: 'HELP-006', category: 'Actions & CAPA', title: 'CAPA Workflow Guide', description: 'Complete guide to the CAPA lifecycle from identification to closure', duration: '12 min read' },
  { id: 'HELP-007', category: 'Reports', title: 'Generating Audit Evidence Packs', description: 'How to create comprehensive evidence packages for audits', duration: '6 min read' },
  { id: 'HELP-008', category: 'Administration', title: 'User and Role Management', description: 'Setting up users, roles, and permissions', duration: '10 min read' },
];

export const trainingVideos = [
  { id: 'VID-001', title: 'Management Review Overview', duration: '12:30', category: 'Getting Started', thumbnail: '' },
  { id: 'VID-002', title: 'ISO 9.3 Input Review Walkthrough', duration: '18:45', category: 'ISO Compliance', thumbnail: '' },
  { id: 'VID-003', title: 'Creating Effective CAPAs', duration: '15:20', category: 'Actions & CAPA', thumbnail: '' },
  { id: 'VID-004', title: 'Dashboard and Reporting', duration: '10:15', category: 'Reports', thumbnail: '' },
];
