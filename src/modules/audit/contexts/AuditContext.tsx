import React, { createContext, useContext, useState, ReactNode } from 'react';

/* =======================
   TYPES
======================= */

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

interface AuditContextType {
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

/* =======================
   MOCK DATA
======================= */

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
];

const initialChecklists: ChecklistTemplate[] = [
  {
    id: 'ISO-9001-2023',
    name: 'ISO 9001:2023 Compliance Checklist',
    sections: [],
  },
];

const initialUsers: User[] = [
  { id: '1', name: 'John Smith', email: 'john.smith@soapbox.com', role: 'Lead Auditor', status: 'Active' },
];

const initialNotifications: Notification[] = [
  {
    id: 'not-1',
    type: 'warning',
    message: 'CAPA-001 is due in 3 days',
    date: '2025-10-03',
    read: false,
  },
];

/* =======================
   CONTEXT
======================= */

const AuditContext = createContext<AuditContextType | undefined>(undefined);

/* =======================
   PROVIDER
======================= */

export function AuditProvider({ children }: { children: ReactNode }) {
  const [audits, setAudits] = useState(initialAudits);
  const [findings, setFindings] = useState(initialFindings);
  const [capas, setCAPAs] = useState(initialCAPAs);
  const [checklists, setChecklists] = useState(initialChecklists);
  const [users, setUsers] = useState(initialUsers);
  const [notifications, setNotifications] = useState(initialNotifications);
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

  const addChecklist = (checklist: ChecklistTemplate) =>
    setChecklists(prev => [...prev, checklist]);

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
    <AuditContext.Provider
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
    </AuditContext.Provider>
  );
}

/* =======================
   HOOK
======================= */

export function useAudit() {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error('useAudit must be used within AuditProvider');
  }
  return context;
}
