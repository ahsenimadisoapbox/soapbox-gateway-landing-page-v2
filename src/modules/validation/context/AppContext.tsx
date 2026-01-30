import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export type UserRole = 
  | 'Validation Lead'
  | 'QA / Compliance'
  | 'Test Executor'
  | 'Change Owner'
  | 'Auditor / Inspector'
  | 'Executive';

export type ValidationStatus = 'validated' | 'conditional' | 'required';

export type LifecycleStep = 
  | 'initiation'
  | 'intended-use'
  | 'risk-assessment'
  | 'strategy'
  | 'requirements'
  | 'test-protocols'
  | 'test-execution'
  | 'deviation-handling'
  | 'validation-summary'
  | 'release'
  | 'validated'
  | 'continuous';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  initials: string;
}

export interface ValidationProject {
  id: string;
  name: string;
  system: string;
  status: ValidationStatus;
  currentStep: LifecycleStep;
  leadId: string;
  createdAt: string;
  targetDate: string;
  completedSteps: LifecycleStep[];
  requirementsCount: number;
  testsCount: number;
  deviationsCount: number;
}

export interface Deviation {
  id: string;
  projectId: string;
  title: string;
  severity: 'Critical' | 'Major' | 'Minor';
  status: 'Open' | 'Under Investigation' | 'CAPA Required' | 'Closed';
  createdAt: string;
  assignedTo: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'action' | 'approval';
  read: boolean;
  createdAt: string;
  link?: string;
}

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  projects: ValidationProject[];
  deviations: Deviation[];
  notifications: Notification[];
  unreadNotificationsCount: number;
  markNotificationRead: (id: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

// Mock Data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'Validation Lead',
    initials: 'JD',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    role: 'QA / Compliance',
    initials: 'SC',
  },
  {
    id: '3',
    name: 'Mike Rodriguez',
    email: 'mike.rodriguez@company.com',
    role: 'Test Executor',
    initials: 'MR',
  },
  {
    id: '4',
    name: 'Jennifer Walsh',
    email: 'jennifer.walsh@company.com',
    role: 'Change Owner',
    initials: 'JW',
  },
  {
    id: '5',
    name: 'David Kim',
    email: 'david.kim@company.com',
    role: 'Auditor / Inspector',
    initials: 'DK',
  },
  {
    id: '6',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@company.com',
    role: 'Executive',
    initials: 'LT',
  },
];

const mockProjects: ValidationProject[] = [
  {
    id: 'VP-001',
    name: 'MES System v3.2 Upgrade',
    system: 'Manufacturing Execution System',
    status: 'conditional',
    currentStep: 'test-execution',
    leadId: '1',
    createdAt: '2025-01-02',
    targetDate: '2025-02-15',
    completedSteps: ['initiation', 'intended-use', 'risk-assessment', 'strategy', 'requirements', 'test-protocols'],
    requirementsCount: 47,
    testsCount: 126,
    deviationsCount: 2,
  },
  {
    id: 'VP-002',
    name: 'LIMS Integration Module',
    system: 'Laboratory Information Management',
    status: 'required',
    currentStep: 'risk-assessment',
    leadId: '1',
    createdAt: '2025-01-08',
    targetDate: '2025-03-01',
    completedSteps: ['initiation', 'intended-use'],
    requirementsCount: 32,
    testsCount: 0,
    deviationsCount: 0,
  },
  {
    id: 'VP-003',
    name: 'Document Control System',
    system: 'Quality Management System',
    status: 'validated',
    currentStep: 'continuous',
    leadId: '2',
    createdAt: '2024-11-15',
    targetDate: '2024-12-20',
    completedSteps: ['initiation', 'intended-use', 'risk-assessment', 'strategy', 'requirements', 'test-protocols', 'test-execution', 'deviation-handling', 'validation-summary', 'release', 'validated'],
    requirementsCount: 28,
    testsCount: 84,
    deviationsCount: 1,
  },
  {
    id: 'VP-004',
    name: 'Batch Record System',
    system: 'Electronic Batch Records',
    status: 'required',
    currentStep: 'initiation',
    leadId: '1',
    createdAt: '2025-01-14',
    targetDate: '2025-04-30',
    completedSteps: [],
    requirementsCount: 0,
    testsCount: 0,
    deviationsCount: 0,
  },
];

const mockDeviations: Deviation[] = [
  {
    id: 'DEV-001',
    projectId: 'VP-001',
    title: 'Test TC-045 failed: Data integrity check timeout',
    severity: 'Major',
    status: 'Under Investigation',
    createdAt: '2025-01-12',
    assignedTo: '3',
  },
  {
    id: 'DEV-002',
    projectId: 'VP-001',
    title: 'Test TC-089 failed: User permission validation error',
    severity: 'Minor',
    status: 'CAPA Required',
    createdAt: '2025-01-13',
    assignedTo: '2',
  },
  {
    id: 'DEV-003',
    projectId: 'VP-003',
    title: 'Test TC-023 failed: Document versioning discrepancy',
    severity: 'Minor',
    status: 'Closed',
    createdAt: '2024-12-10',
    assignedTo: '3',
  },
];

const mockNotifications: Notification[] = [
  {
    id: 'N-001',
    title: 'Approval Required',
    message: 'Test Protocol TP-001 for VP-001 requires your approval',
    type: 'approval',
    read: false,
    createdAt: '2025-01-15T09:00:00Z',
    link: '/projects/VP-001',
  },
  {
    id: 'N-002',
    title: 'Deviation Created',
    message: 'New deviation DEV-002 created for MES System v3.2',
    type: 'warning',
    read: false,
    createdAt: '2025-01-13T14:30:00Z',
    link: '/deviations/DEV-002',
  },
  {
    id: 'N-003',
    title: 'Task Assigned',
    message: 'You have been assigned to review requirements for VP-002',
    type: 'action',
    read: false,
    createdAt: '2025-01-12T11:00:00Z',
    link: '/projects/VP-002',
  },
  {
    id: 'N-004',
    title: 'Validation Complete',
    message: 'VP-003 Document Control System has been validated',
    type: 'info',
    read: true,
    createdAt: '2024-12-20T16:00:00Z',
    link: '/projects/VP-003',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users: mockUsers,
        projects: mockProjects,
        deviations: mockDeviations,
        notifications,
        unreadNotificationsCount,
        markNotificationRead,
        sidebarCollapsed,
        setSidebarCollapsed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
