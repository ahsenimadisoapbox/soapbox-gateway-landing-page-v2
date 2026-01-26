import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface Audit {
  id: string;
  title: string;
  type: 'Internal' | 'External' | 'Compliance' | 'ISO';
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Overdue';
  startDate: string;
  endDate: string;
  auditors: string[];
  checklist?: string;
  recurrence?: string;
}

export interface Finding {
  id: string;
  auditId: string;
  title: string;
  description: string;
  severity: 'Critical' | 'Major' | 'Minor';
  status: 'Open' | 'In Progress' | 'Closed';
  assignee: string;
  dueDate: string;
  riskId?: string;
  capaId?: string;
}

export interface CAPA {
  id: string;
  findingId: string;
  title: string;
  owner: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Overdue';
  progress: number;
  dueDate: string;
  createdAt: string;
}

export interface ChecklistTemplate {
  id: string;
  name: string;
  sections: ChecklistSection[];
}

export interface ChecklistSection {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  requirement: string;
  status?: 'Pass' | 'Fail' | 'NA';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'alert';
  message: string;
  date: string;
  read: boolean;
}

interface AppContextType {
  audits: Audit[];
  findings: Finding[];
  capas: CAPA[];
  checklists: ChecklistTemplate[];
  users: User[];
  notifications: Notification[];
  currentUser: User | null;
  setCurrentUser: (userId: string) => void;
  addAudit: (audit: Audit) => void;
  updateAudit: (id: string, updates: Partial<Audit>) => void;
  addFinding: (finding: Finding) => void;
  updateFinding: (id: string, updates: Partial<Finding>) => void;
  closeFinding: (id: string) => boolean;
  addCAPA: (capa: CAPA) => void;
  updateCAPA: (id: string, updates: Partial<CAPA>) => void;
  addChecklist: (checklist: ChecklistTemplate) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  markNotificationRead: (id: string) => void;
  archiveAllNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

// Mock Data
const initialAudits: Audit[] = [
  {
    id: 'AUD-001',
    title: 'ISO 9001 Annual Audit',
    type: 'ISO',
    status: 'Scheduled',
    startDate: '2025-11-15',
    endDate: '2025-11-20',
    auditors: ['John Smith', 'Sarah Johnson'],
    checklist: 'ISO-9001-2023',
  },
  {
    id: 'AUD-002',
    title: 'Internal Quality Audit Q4',
    type: 'Internal',
    status: 'In Progress',
    startDate: '2025-10-01',
    endDate: '2025-10-15',
    auditors: ['Mike Chen'],
    checklist: 'QA-Internal-v2',
  },
  {
    id: 'AUD-003',
    title: 'FDA Compliance Audit',
    type: 'Compliance',
    status: 'Completed',
    startDate: '2025-09-10',
    endDate: '2025-09-18',
    auditors: ['Sarah Johnson', 'Emily Davis'],
    checklist: 'FDA-CFR-2023',
  },
  {
    id: 'AUD-004',
    title: 'External Supplier Audit',
    type: 'External',
    status: 'Overdue',
    startDate: '2025-09-25',
    endDate: '2025-09-30',
    auditors: ['John Smith'],
    checklist: 'Supplier-QA-v1',
  },
  {
    id: 'AUD-005',
    title: 'ISO 27001 Security Audit',
    type: 'ISO',
    status: 'Scheduled',
    startDate: '2025-12-01',
    endDate: '2025-12-08',
    auditors: ['Mike Chen', 'Emily Davis'],
    checklist: 'ISO-27001-2023',
  },
];

const initialFindings: Finding[] = [
  {
    id: 'FND-001',
    auditId: 'AUD-002',
    title: 'Documentation Gap in Manufacturing Process',
    description: 'Critical procedure documentation missing from Assembly Line 3',
    severity: 'Major',
    status: 'Open',
    assignee: 'John Smith',
    dueDate: '2025-10-30',
    riskId: 'RISK-042',
    capaId: 'CAPA-001',
  },
  {
    id: 'FND-002',
    auditId: 'AUD-002',
    title: 'Equipment Calibration Overdue',
    description: 'Testing equipment in Lab 2 has not been calibrated for 6 months',
    severity: 'Critical',
    status: 'In Progress',
    assignee: 'Sarah Johnson',
    dueDate: '2025-10-25',
    riskId: 'RISK-013',
    capaId: 'CAPA-002',
  },
  {
    id: 'FND-003',
    auditId: 'AUD-003',
    title: 'Training Records Incomplete',
    description: 'Several staff members missing required safety training documentation',
    severity: 'Minor',
    status: 'Closed',
    assignee: 'Mike Chen',
    dueDate: '2025-09-20',
    riskId: 'RISK-008',
  },
  {
    id: 'FND-004',
    auditId: 'AUD-004',
    title: 'Non-Conforming Material Storage',
    description: 'Improper segregation of rejected materials in warehouse',
    severity: 'Major',
    status: 'Open',
    assignee: 'Emily Davis',
    dueDate: '2025-11-05',
    riskId: 'RISK-029',
    capaId: 'CAPA-003',
  },
  {
    id: 'FND-005',
    auditId: 'AUD-002',
    title: 'Environmental Control Out of Spec',
    description: 'Clean room humidity levels exceeded acceptable range',
    severity: 'Minor',
    status: 'In Progress',
    assignee: 'John Smith',
    dueDate: '2025-10-28',
    riskId: 'RISK-051',
  },
];

const initialCAPAs: CAPA[] = [
  {
    id: 'CAPA-001',
    findingId: 'FND-001',
    title: 'Update Manufacturing Documentation',
    owner: 'John Smith',
    status: 'In Progress',
    progress: 60,
    dueDate: '2025-10-28',
    createdAt: '2025-10-03',
  },
  {
    id: 'CAPA-002',
    findingId: 'FND-002',
    title: 'Implement Equipment Calibration Schedule',
    owner: 'Sarah Johnson',
    status: 'In Progress',
    progress: 40,
    dueDate: '2025-10-20',
    createdAt: '2025-09-25',
  },
  {
    id: 'CAPA-003',
    findingId: 'FND-004',
    title: 'Redesign Material Storage Layout',
    owner: 'Emily Davis',
    status: 'Not Started',
    progress: 0,
    dueDate: '2025-11-03',
    createdAt: '2025-10-01',
  },
  {
    id: 'CAPA-004',
    findingId: 'FND-001',
    title: 'Conduct Documentation Training',
    owner: 'Mike Chen',
    status: 'Overdue',
    progress: 25,
    dueDate: '2025-09-20',
    createdAt: '2025-08-15',
  },
  {
    id: 'CAPA-005',
    findingId: 'FND-002',
    title: 'Purchase New Calibration Equipment',
    owner: 'John Smith',
    status: 'Completed',
    progress: 100,
    dueDate: '2025-10-15',
    createdAt: '2025-09-28',
  },
];

const initialChecklists: ChecklistTemplate[] = [
  {
    id: 'ISO-9001-2023',
    name: 'ISO 9001:2023 Compliance Checklist',
    sections: [
      {
        id: 'sec-1',
        title: 'Quality Management System',
        items: [
          { id: 'item-1', requirement: 'QMS documented and maintained' },
          { id: 'item-2', requirement: 'Quality policy established' },
          { id: 'item-3', requirement: 'Management review process defined' },
        ],
      },
      {
        id: 'sec-2',
        title: 'Resource Management',
        items: [
          { id: 'item-4', requirement: 'Competency requirements identified' },
          { id: 'item-5', requirement: 'Training records maintained' },
        ],
      },
    ],
  },
  {
    id: 'FDA-CFR-2023',
    name: 'FDA CFR Part 11 Compliance',
    sections: [
      {
        id: 'sec-1',
        title: 'Electronic Records',
        items: [
          { id: 'item-1', requirement: 'System validation completed' },
          { id: 'item-2', requirement: 'Audit trail functionality verified' },
        ],
      },
    ],
  },
  {
    id: 'QA-Internal-v2',
    name: 'Internal Quality Audit Template',
    sections: [
      {
        id: 'sec-1',
        title: 'Document Control',
        items: [
          { id: 'item-1', requirement: 'Document approval process followed' },
          { id: 'item-2', requirement: 'Version control maintained' },
        ],
      },
    ],
  },
  {
    id: 'ISO-27001-2023',
    name: 'ISO 27001 Information Security',
    sections: [
      {
        id: 'sec-1',
        title: 'Security Controls',
        items: [
          { id: 'item-1', requirement: 'Access controls implemented' },
          { id: 'item-2', requirement: 'Incident response plan documented' },
        ],
      },
    ],
  },
];

const initialUsers: User[] = [
  { id: '1', name: 'John Smith', email: 'john.smith@soapbox.com', role: 'Lead Auditor', status: 'Active' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah.j@soapbox.com', role: 'Auditor', status: 'Active' },
  { id: '3', name: 'Mike Chen', email: 'mike.chen@soapbox.com', role: 'Compliance Officer', status: 'Active' },
  { id: '4', name: 'Emily Davis', email: 'emily.d@soapbox.com', role: 'Quality Manager', status: 'Active' },
  { id: '5', name: 'Admin User', email: 'admin@soapbox.com', role: 'Administrator', status: 'Active' },
];

const initialNotifications: Notification[] = [
  {
    id: 'not-1',
    type: 'warning',
    message: 'CAPA-001 is due in 3 days',
    date: '2025-10-03',
    read: false,
  },
  {
    id: 'not-2',
    type: 'alert',
    message: 'Finding FND-001 requires immediate attention',
    date: '2025-10-02',
    read: false,
  },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [audits, setAudits] = useState<Audit[]>(initialAudits);
  const [findings, setFindings] = useState<Finding[]>(initialFindings);
  const [capas, setCAPAs] = useState<CAPA[]>(initialCAPAs);
  const [checklists, setChecklists] = useState<ChecklistTemplate[]>(initialChecklists);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [currentUser, setCurrentUserState] = useState<User | null>(initialUsers[0]);

  const addAudit = (audit: Audit) => setAudits(prev => [...prev, audit]);
  const updateAudit = (id: string, updates: Partial<Audit>) =>
    setAudits(prev => prev.map(a => (a.id === id ? { ...a, ...updates } : a)));

  const addFinding = (finding: Finding) => setFindings(prev => [...prev, finding]);
  const updateFinding = (id: string, updates: Partial<Finding>) =>
    setFindings(prev => prev.map(f => (f.id === id ? { ...f, ...updates } : f)));

  const closeFinding = (id: string): boolean => {
    const finding = findings.find(f => f.id === id);
    if (!finding?.capaId) return false;
    
    const capa = capas.find(c => c.id === finding.capaId);
    if (capa?.status !== 'Completed') return false;
    
    updateFinding(id, { status: 'Closed' });
    return true;
  };

  const addCAPA = (capa: CAPA) => setCAPAs(prev => [...prev, capa]);
  const updateCAPA = (id: string, updates: Partial<CAPA>) =>
    setCAPAs(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));

  const addChecklist = (checklist: ChecklistTemplate) => setChecklists(prev => [...prev, checklist]);

  const updateUser = (id: string, updates: Partial<User>) =>
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...updates } : u)));

  const markNotificationRead = (id: string) =>
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));

  const archiveAllNotifications = () => setNotifications([]);

  const setCurrentUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) setCurrentUserState(user);
  };

  return (
    <AppContext.Provider
      value={{
        audits,
        findings,
        capas,
        checklists,
        users,
        notifications,
        currentUser,
        setCurrentUser,
        addAudit,
        updateAudit,
        addFinding,
        updateFinding,
        closeFinding,
        addCAPA,
        updateCAPA,
        addChecklist,
        updateUser,
        markNotificationRead,
        archiveAllNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
