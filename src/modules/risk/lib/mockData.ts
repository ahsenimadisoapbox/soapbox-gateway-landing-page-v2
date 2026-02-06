import { User, Risk, UserRole } from '../types/risk';
import { generateRiskId } from './storage';

export const mockUsers: User[] = [
  {
    id: 'user_1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@soapboxcloud.com',
    role: 'risk_reporter'
  },
  {
    id: 'user_2', 
    name: 'Michael Chen',
    email: 'michael.chen@soapboxcloud.com',
    role: 'risk_owner'
  },
  {
    id: 'user_3',
    name: 'Emily Davis',
    email: 'emily.davis@soapboxcloud.com', 
    role: 'risk_manager'
  },
  {
    id: 'user_4',
    name: 'Robert Wilson',
    email: 'robert.wilson@soapboxcloud.com',
    role: 'mitigation_owner'
  },
  {
    id: 'user_5',
    name: 'Lisa Rodriguez',
    email: 'lisa.rodriguez@soapboxcloud.com',
    role: 'compliance_officer'
  }
];

export const mockSites = [
  { id: 'site_1', name: 'Manufacturing Plant A', location: 'Austin, TX' },
  { id: 'site_2', name: 'Chemical Storage Facility', location: 'Houston, TX' },
  { id: 'site_3', name: 'Research Lab Complex', location: 'Dallas, TX' },
  { id: 'site_4', name: 'Distribution Center', location: 'San Antonio, TX' }
];

export const mockIncidents = [
  { id: 'INC_001', title: 'Chemical Spill in Warehouse B', date: new Date('2024-01-14') },
  { id: 'INC_002', title: 'Worker Injury on Assembly Line', date: new Date('2024-01-09') },
  { id: 'INC_003', title: 'Equipment Malfunction', date: new Date('2024-01-03') }
];

export const mockNotifications = [
  {
    id: 'notif_1',
    userId: 'user_2',
    type: 'risk_assigned',
    title: 'New Risk Assigned',
    message: 'Chemical Spill Risk in Storage Area has been assigned to you',
    riskId: 'RISK-2024-001',
    read: false,
    createdAt: new Date('2024-01-16T10:30:00')
  },
  {
    id: 'notif_2', 
    userId: 'user_2',
    type: 'assessment_due',
    title: 'Assessment Due Soon',
    message: 'Risk assessment for RISK-2024-002 is due in 2 days',
    riskId: 'RISK-2024-002',
    read: false,
    createdAt: new Date('2024-01-18T14:15:00')
  }
];

export const mockRisks: Risk[] = [
  {
    id: generateRiskId(),
    title: 'Chemical Spill Risk in Storage Area',
    description: 'Potential for hazardous chemical spill due to aging storage containers in Warehouse B',
    category: 'environmental',
    reportedBy: 'user_1',
    assignedTo: 'user_2',
    status: 'under_assessment',
    severity: 'high',
    evidence: ['inspection_report_001.pdf', 'storage_photos.jpg'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
    dueDate: new Date('2024-02-15'),
    mitigationActions: [],
    auditRequired: true,
    closureRequested: false,
    site: 'site_2',
    incidentId: 'INC_001',
    riskScore: 15,
    residualScore: null
  },
  {
    id: generateRiskId(),
    title: 'Ergonomic Injury Risk - Assembly Line',
    description: 'Workers reporting back strain from repetitive lifting motions on Line 3',
    category: 'safety',
    reportedBy: 'user_1',
    assignedTo: 'user_2',
    status: 'mitigation_in_progress',
    severity: 'medium',
    evidence: ['ergonomic_assessment.pdf'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20'),
    dueDate: new Date('2024-02-10'),
    mitigationActions: [
      {
        id: 'mit_1',
        riskId: '',
        title: 'Install lifting assistance equipment',
        description: 'Purchase and install mechanical lifting aids for Line 3',
        assignedTo: 'user_4',
        dueDate: new Date('2024-02-05'),
        priority: 'high',
        status: 'in_progress',
        progress: 65,
        evidence: ['purchase_order.pdf'],
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-20')
      }
    ],
    auditRequired: false,
    closureRequested: false,
    site: 'site_1',
    incidentId: 'INC_002',
    riskScore: 12,
    residualScore: null
  },
  {
    id: generateRiskId(),
    title: 'Regulatory Compliance Gap - Air Emissions',
    description: 'New EPA regulations require additional monitoring equipment installation',
    category: 'regulatory',
    reportedBy: 'user_5',
    assignedTo: 'user_2',
    status: 'approved_for_mitigation',
    severity: 'high',
    evidence: ['epa_notice.pdf', 'current_emissions_data.xlsx'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-18'),
    dueDate: new Date('2024-03-01'),
    mitigationActions: [],
    auditRequired: true,
    closureRequested: false,
    site: 'site_1',
    riskScore: 18,
    residualScore: null
  },
  {
    id: generateRiskId(),
    title: 'Fire Safety System Maintenance',
    description: 'Annual inspection revealed issues with fire suppression system in Building C',
    category: 'safety',
    reportedBy: 'user_3',
    assignedTo: 'user_2',
    status: 'ready_for_closure',
    severity: 'high',
    evidence: ['fire_inspection.pdf', 'repair_photos.jpg'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-25'),
    dueDate: new Date('2024-01-30'),
    mitigationActions: [
      {
        id: 'mit_2',
        riskId: '',
        title: 'Replace faulty sprinkler heads',
        description: 'Replace all identified faulty sprinkler heads in Building C',
        assignedTo: 'user_4',
        dueDate: new Date('2024-01-25'),
        priority: 'high',
        status: 'completed',
        progress: 100,
        evidence: ['completion_cert.pdf'],
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-25')
      }
    ],
    auditRequired: true,
    closureRequested: true,
    site: 'site_3',
    riskScore: 16,
    residualScore: 4
  },
  {
    id: generateRiskId(),
    title: 'Electrical Hazard - Junction Box',
    description: 'Exposed wiring detected in main electrical junction box',
    category: 'safety',
    reportedBy: 'user_1',
    assignedTo: 'user_2',
    status: 'closed',
    severity: 'critical',
    evidence: ['electrical_photos.jpg', 'repair_invoice.pdf'],
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-22'),
    dueDate: new Date('2024-01-10'),
    mitigationActions: [
      {
        id: 'mit_3',
        riskId: '',
        title: 'Emergency electrical repair',
        description: 'Immediate repair of exposed wiring and junction box replacement',
        assignedTo: 'user_4',
        dueDate: new Date('2024-01-08'),
        priority: 'critical',
        status: 'completed',
        progress: 100,
        evidence: ['completion_photos.jpg', 'electrical_cert.pdf'],
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-08')
      }
    ],
    auditRequired: true,
    closureRequested: false,
    site: 'site_1',
    riskScore: 20,
    residualScore: 2
  }
];

export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames = {
    risk_reporter: 'Risk Reporter',
    risk_owner: 'Risk Owner',
    risk_manager: 'Risk Manager', 
    mitigation_owner: 'Mitigation Owner',
    compliance_officer: 'Compliance Officer'
  };
  
  return roleNames[role];
};

export const getRolePermissions = (role: UserRole) => {
  const permissions = {
    risk_reporter: {
      canCreateRisk: true,
      canEditRisk: false,
      canAssessRisk: false,
      canApproveRisk: false,
      canAssignMitigation: false,
      canUpdateMitigation: false,
      canAudit: false,
      canClose: false
    },
    risk_owner: {
      canCreateRisk: true,
      canEditRisk: true,
      canAssessRisk: true,
      canApproveRisk: false,
      canAssignMitigation: false,
      canUpdateMitigation: false,
      canAudit: false,
      canClose: false
    },
    risk_manager: {
      canCreateRisk: true,
      canEditRisk: true,
      canAssessRisk: true,
      canApproveRisk: true,
      canAssignMitigation: true,
      canUpdateMitigation: false,
      canAudit: false,
      canClose: true
    },
    mitigation_owner: {
      canCreateRisk: false,
      canEditRisk: false,
      canAssessRisk: false,
      canApproveRisk: false,
      canAssignMitigation: false,
      canUpdateMitigation: true,
      canAudit: false,
      canClose: false
    },
    compliance_officer: {
      canCreateRisk: true,
      canEditRisk: false,
      canAssessRisk: false,
      canApproveRisk: false,
      canAssignMitigation: false,
      canUpdateMitigation: false,
      canAudit: true,
      canClose: true
    }
  };
  
  return permissions[role];
};