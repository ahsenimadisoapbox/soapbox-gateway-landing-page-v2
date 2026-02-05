export type NCRStatus = 
  | 'Draft'
  | 'Submitted'
  | 'Validated'
  | 'Under Investigation'
  | 'RCA Submitted'
  | 'RCA Approved'
  | 'CAPA In Progress'
  | 'CAPA Completed'
  | 'Verification Pending'
  | 'Closed';

export type Severity = 'Critical' | 'Major' | 'Minor';

export type Category = 
  | 'Process Deviation'
  | 'Equipment Failure'
  | 'Documentation Error'
  | 'Training Gap'
  | 'Supplier Issue'
  | 'Environmental'
  | 'Safety Hazard'
  | 'Quality Control'
  | 'Regulatory Non-Compliance'
  | 'Other';

export type UserRole = 
  | 'Reporter'
  | 'Supervisor'
  | 'EHS Officer'
  | 'Investigator'
  | 'Approver'
  | 'Corp HSE'
  | 'Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
}

export interface NCR {
  id: string;
  title: string;
  description: string;
  category: Category;
  severity: Severity;
  status: NCRStatus;
  reportedBy: string;
  reportedDate: string;
  location: string;
  gpsCoordinates?: { lat: number; lng: number };
  hazardType?: string;
  requirementReference?: string;
  witnesses?: string[];
  isConfidential: boolean;
  assignedInvestigator?: string;
  dueDate?: string;
  site: string;
  evidenceFiles?: string[];
  containmentActions?: string;
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details?: string;
}

export interface RCA {
  id: string;
  ncrId: string;
  type: '5-Whys' | 'Fishbone';
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  createdBy: string;
  createdDate: string;
  whys?: WhyItem[];
  fishbone?: FishboneData;
  evidence?: string[];
  conclusion?: string;
}

export interface WhyItem {
  level: number;
  question: string;
  answer: string;
}

export interface FishboneData {
  problem: string;
  categories: {
    name: string;
    causes: string[];
  }[];
}

export interface CAPA {
  id: string;
  ncrId: string;
  title: string;
  description: string;
  type: 'Corrective' | 'Preventive';
  assignedTo: string;
  dueDate: string;
  status: 'Open' | 'In Progress' | 'Awaiting Verification' | 'Closed';
  evidence?: string[];
  completedDate?: string;
  verificationNotes?: string;
}

export interface Verification {
  id: string;
  ncrId: string;
  verifier: string;
  verificationDate: string;
  effectivenessRating: 'Effective' | 'Partially Effective' | 'Not Effective';
  beforeEvidence?: string[];
  afterEvidence?: string[];
  comments: string;
  status: 'Pending' | 'Verified' | 'Reopened';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  timestamp: string;
  link?: string;
}
