export type UserRole = 
  | 'risk_reporter' 
  | 'risk_owner' 
  | 'risk_manager' 
  | 'mitigation_owner' 
  | 'compliance_officer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type RiskCategory = 
  | 'safety' 
  | 'environmental' 
  | 'operational' 
  | 'financial' 
  | 'regulatory' 
  | 'strategic';

export type RiskStatus = 
  | 'new'
  | 'draft' 
  | 'submitted' 
  | 'under_assessment' 
  | 'manager_review'
  | 'under_review' 
  | 'approved' 
  | 'approved_for_mitigation'
  | 'rework_requested'
  | 'rejected' 
  | 'mitigation_assigned' 
  | 'mitigation_in_progress' 
  | 'ready_for_closure'
  | 'under_audit' 
  | 'closure_requested' 
  | 'closed' 
  | 'archived';

export type SeverityLevel = 'negligible' | 'low' | 'medium' | 'high' | 'critical';

export interface RiskAssessment {
  method: 'qualitative' | 'quantitative' | 'hybrid' | string;
  impact: number; // 1-5
  likelihood: number; // 1-5
  detectability: number; // 1-5
  recommendations: string;
  assessedBy: string;
  assessedAt: Date;
  status: 'draft' | 'submitted';
}

export interface MitigationAction {
  id: string;
  riskId: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue' | 'not_started' | 'blocked';
  progress: number; // 0-100
  evidence: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  category: RiskCategory;
  reportedBy: string;
  assignedTo: string;
  status: RiskStatus;
  severity: SeverityLevel;
  evidence: string[];
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date;
  mitigationActions: MitigationAction[];
  auditRequired: boolean;
  closureRequested: boolean;
  assessment?: RiskAssessment;
  site?: string;
  incidentId?: string;
  riskScore?: number;
  residualScore?: number | null;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  riskId?: string;
  read: boolean;
  createdAt: Date;
}

export interface AuditRecord {
  id: string;
  riskId: string;
  action: string;
  userId: string;
  timestamp: Date;
  details: Record<string, any>;
}