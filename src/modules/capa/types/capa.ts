export type CapaType = "corrective" | "preventive";
export type CapaStatus = "open" | "in-progress" | "pending-review" | "closed" | "overdue";
export type CapaPriority = "critical" | "high" | "medium" | "low";
export type CapaSeverity = "severe" | "major" | "moderate" | "minor";
export type UserRole = "capa-reporter" | "ehs-officer" | "capa-owner" | "ehs-manager" | "compliance-officer" | "action-owner";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Action {
  id: string;
  capaId: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedToName: string;
  status: "pending" | "in-progress" | "completed" | "verified";
  dueDate: string;
  completionDate?: string;
  evidence?: string[];
  notes?: string;
}

export interface RootCauseAnalysis {
  methodology: "5-why" | "fishbone" | "fault-tree" | "other";
  findings: string;
  contributingFactors: string[];
  immediateCorrection?: string;
}

export interface Capa {
  id: string;
  title: string;
  description: string;
  type: CapaType;
  status: CapaStatus;
  priority: CapaPriority;
  severity: CapaSeverity;
  linkedIncidentId?: string;
  createdBy: string;
  createdByName: string;
  createdDate: string;
  owner?: string;
  ownerName?: string;
  dueDate: string;
  targetCompletionDate?: string;
  closureDate?: string;
  rootCauseAnalysis?: RootCauseAnalysis;
  actions: Action[];
  attachments?: string[];
  auditTrail: AuditEntry[];
  effectiveness?: "effective" | "partially-effective" | "not-effective" | "pending";
  verificationNotes?: string;
  category?: string;
  department?: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  userName: string;
  action: string;
  details: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  timestamp: string;
  read: boolean;
  capaId?: string;
}

export interface DashboardStats {
  totalOpen: number;
  totalClosed: number;
  totalOverdue: number;
  inProgress: number;
  dueThisWeek: number;
  criticalPriority: number;
  averageResolutionDays: number;
  effectivenessRate: number;
}
