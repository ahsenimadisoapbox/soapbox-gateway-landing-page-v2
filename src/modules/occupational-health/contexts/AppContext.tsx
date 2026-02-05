import React, { createContext, useContext, useState, ReactNode } from 'react';

// Role types
export type UserRole = 
  | 'OH_DOCTOR' 
  | 'OH_NURSE' 
  | 'CLINIC_ADMIN' 
  | 'FIRST_AID_OFFICER'
  | 'HSE_MANAGER' 
  | 'HR_PARTNER' 
  | 'SUPERVISOR' 
  | 'EMPLOYEE_SELF'
  | 'WELLNESS_COORD' 
  | 'OH_ADMIN' 
  | 'TENANT_ADMIN' 
  | 'AUDITOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  jobTitle: string;
  site: string;
  hireDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  riskLevel: 'low' | 'medium' | 'high';
  lastExamDate?: string;
  nextExamDate?: string;
  hazardExposures: string[];
}

export interface Exam {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'pre-employment' | 'periodic' | 'return-to-work' | 'exit' | 'special';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  completedDate?: string;
  provider: string;
  result?: 'fit' | 'fit-with-restrictions' | 'unfit' | 'pending';
  notes?: string;
}

export interface ClinicVisit {
  id: string;
  employeeId: string;
  employeeName: string;
  visitDate: string;
  visitTime: string;
  type: 'walk-in' | 'scheduled' | 'emergency';
  chiefComplaint: string;
  triageLevel: 'red' | 'amber' | 'green';
  status: 'waiting' | 'in-treatment' | 'completed' | 'referred';
  provider?: string;
  diagnosis?: string;
  treatment?: string;
}

export interface IllnessCase {
  id: string;
  caseNumber: string;
  employeeId: string;
  employeeName: string;
  reportDate: string;
  diagnosis: string;
  status: 'open' | 'investigating' | 'treatment' | 'closed';
  severity: 'minor' | 'moderate' | 'severe';
  relatedExposure?: string;
  investigator?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
  read: boolean;
}

interface AppContextType {
  // Current user
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  
  // Employees
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  
  // Exams
  exams: Exam[];
  setExams: React.Dispatch<React.SetStateAction<Exam[]>>;
  
  // Clinic Visits
  clinicVisits: ClinicVisit[];
  setClinicVisits: React.Dispatch<React.SetStateAction<ClinicVisit[]>>;
  
  // Illness Cases
  illnessCases: IllnessCase[];
  setIllnessCases: React.Dispatch<React.SetStateAction<IllnessCase[]>>;
  
  // Notifications
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  markNotificationRead: (id: string) => void;
  
  // UI State
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const mockUsers: User[] = [
  { id: '1', name: 'Dr. Sarah Chen', email: 'sarah.chen@company.com', role: 'OH_DOCTOR', department: 'Occupational Health' },
  { id: '2', name: 'Nurse Mike Rodriguez', email: 'mike.rodriguez@company.com', role: 'OH_NURSE', department: 'Occupational Health' },
  { id: '3', name: 'Jennifer Walsh', email: 'jennifer.walsh@company.com', role: 'HSE_MANAGER', department: 'Health & Safety' },
  { id: '4', name: 'David Kim', email: 'david.kim@company.com', role: 'AUDITOR', department: 'Compliance' },
  { id: '5', name: 'Amanda Foster', email: 'amanda.foster@company.com', role: 'HR_PARTNER', department: 'Human Resources' },
  { id: '6', name: 'John Smith', email: 'john.smith@company.com', role: 'EMPLOYEE_SELF', department: 'Manufacturing' },
  { id: '7', name: 'Lisa Park', email: 'lisa.park@company.com', role: 'CLINIC_ADMIN', department: 'Occupational Health' },
  { id: '8', name: 'Robert Taylor', email: 'robert.taylor@company.com', role: 'SUPERVISOR', department: 'Operations' },
];

const mockEmployees: Employee[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@company.com',
    phone: '+1-555-0101',
    department: 'Manufacturing',
    jobTitle: 'Machine Operator',
    site: 'Plant A',
    hireDate: '2020-03-15',
    status: 'active',
    riskLevel: 'medium',
    lastExamDate: '2024-06-15',
    nextExamDate: '2025-06-15',
    hazardExposures: ['Noise', 'Chemical - Solvents'],
  },
  {
    id: '2',
    employeeId: 'EMP002',
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria.garcia@company.com',
    phone: '+1-555-0102',
    department: 'Quality Control',
    jobTitle: 'QC Inspector',
    site: 'Plant A',
    hireDate: '2019-08-20',
    status: 'active',
    riskLevel: 'low',
    lastExamDate: '2024-08-20',
    nextExamDate: '2025-08-20',
    hazardExposures: ['Ergonomic'],
  },
  {
    id: '3',
    employeeId: 'EMP003',
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james.wilson@company.com',
    phone: '+1-555-0103',
    department: 'Maintenance',
    jobTitle: 'Maintenance Technician',
    site: 'Plant B',
    hireDate: '2018-01-10',
    status: 'active',
    riskLevel: 'high',
    lastExamDate: '2024-01-10',
    nextExamDate: '2025-01-10',
    hazardExposures: ['Noise', 'Chemical - Lubricants', 'Confined Spaces'],
  },
  {
    id: '4',
    employeeId: 'EMP004',
    firstName: 'Emily',
    lastName: 'Brown',
    email: 'emily.brown@company.com',
    phone: '+1-555-0104',
    department: 'Administration',
    jobTitle: 'HR Coordinator',
    site: 'HQ',
    hireDate: '2021-05-01',
    status: 'active',
    riskLevel: 'low',
    lastExamDate: '2024-05-01',
    nextExamDate: '2025-05-01',
    hazardExposures: ['Ergonomic'],
  },
  {
    id: '5',
    employeeId: 'EMP005',
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.johnson@company.com',
    phone: '+1-555-0105',
    department: 'Warehouse',
    jobTitle: 'Forklift Operator',
    site: 'Warehouse 1',
    hireDate: '2017-11-20',
    status: 'on-leave',
    riskLevel: 'high',
    lastExamDate: '2024-11-20',
    nextExamDate: '2025-05-20',
    hazardExposures: ['Noise', 'Manual Handling', 'Vehicle Operations'],
  },
];

const mockExams: Exam[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'John Smith',
    type: 'periodic',
    status: 'scheduled',
    scheduledDate: '2025-01-15',
    provider: 'Dr. Sarah Chen',
  },
  {
    id: '2',
    employeeId: '3',
    employeeName: 'James Wilson',
    type: 'periodic',
    status: 'completed',
    scheduledDate: '2024-12-10',
    completedDate: '2024-12-10',
    provider: 'Dr. Sarah Chen',
    result: 'fit',
    notes: 'All parameters within normal range',
  },
  {
    id: '3',
    employeeId: '5',
    employeeName: 'Michael Johnson',
    type: 'return-to-work',
    status: 'scheduled',
    scheduledDate: '2025-01-20',
    provider: 'Dr. Sarah Chen',
  },
  {
    id: '4',
    employeeId: '2',
    employeeName: 'Maria Garcia',
    type: 'periodic',
    status: 'in-progress',
    scheduledDate: '2025-01-02',
    provider: 'Nurse Mike Rodriguez',
  },
];

const mockClinicVisits: ClinicVisit[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'John Smith',
    visitDate: '2025-01-02',
    visitTime: '09:30',
    type: 'walk-in',
    chiefComplaint: 'Headache and fatigue',
    triageLevel: 'green',
    status: 'completed',
    provider: 'Nurse Mike Rodriguez',
    diagnosis: 'Tension headache',
    treatment: 'OTC pain relief, hydration',
  },
  {
    id: '2',
    employeeId: '3',
    employeeName: 'James Wilson',
    visitDate: '2025-01-02',
    visitTime: '10:15',
    type: 'emergency',
    chiefComplaint: 'Chemical splash to eye',
    triageLevel: 'red',
    status: 'in-treatment',
    provider: 'Dr. Sarah Chen',
  },
  {
    id: '3',
    employeeId: '4',
    employeeName: 'Emily Brown',
    visitDate: '2025-01-02',
    visitTime: '11:00',
    type: 'scheduled',
    chiefComplaint: 'Follow-up: wrist pain',
    triageLevel: 'green',
    status: 'waiting',
  },
];

const mockIllnessCases: IllnessCase[] = [
  {
    id: '1',
    caseNumber: 'OI-2024-001',
    employeeId: '3',
    employeeName: 'James Wilson',
    reportDate: '2024-11-15',
    diagnosis: 'Noise-induced hearing loss',
    status: 'treatment',
    severity: 'moderate',
    relatedExposure: 'Noise exposure in maintenance area',
    investigator: 'Jennifer Walsh',
  },
  {
    id: '2',
    caseNumber: 'OI-2024-002',
    employeeId: '5',
    employeeName: 'Michael Johnson',
    reportDate: '2024-12-01',
    diagnosis: 'Lower back strain',
    status: 'investigating',
    severity: 'moderate',
    relatedExposure: 'Manual handling incident',
    investigator: 'Jennifer Walsh',
  },
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'PME Due Soon',
    message: 'John Smith has a periodic medical exam due in 14 days',
    type: 'warning',
    timestamp: '2025-01-02T08:00:00',
    read: false,
  },
  {
    id: '2',
    title: 'Emergency Visit',
    message: 'Emergency clinic visit registered for James Wilson',
    type: 'error',
    timestamp: '2025-01-02T10:15:00',
    read: false,
  },
  {
    id: '3',
    title: 'Exam Completed',
    message: 'Periodic exam for Maria Garcia has been completed',
    type: 'success',
    timestamp: '2025-01-02T09:30:00',
    read: true,
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [exams, setExams] = useState<Exam[]>(mockExams);
  const [clinicVisits, setClinicVisits] = useState<ClinicVisit[]>(mockClinicVisits);
  const [illnessCases, setIllnessCases] = useState<IllnessCase[]>(mockIllnessCases);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const markNotificationRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users: mockUsers,
        employees,
        setEmployees,
        exams,
        setExams,
        clinicVisits,
        setClinicVisits,
        illnessCases,
        setIllnessCases,
        notifications,
        setNotifications,
        markNotificationRead,
        sidebarCollapsed,
        setSidebarCollapsed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Role permission helpers
export function canViewPHI(role: UserRole): boolean {
  return ['OH_DOCTOR', 'OH_NURSE'].includes(role);
}

export function canViewPartialPHI(role: UserRole): boolean {
  return ['OH_DOCTOR', 'OH_NURSE', 'CLINIC_ADMIN', 'FIRST_AID_OFFICER'].includes(role);
}

export function canManageEmployees(role: UserRole): boolean {
  return ['OH_ADMIN', 'TENANT_ADMIN', 'HR_PARTNER', 'CLINIC_ADMIN'].includes(role);
}

export function canConductExams(role: UserRole): boolean {
  return ['OH_DOCTOR', 'OH_NURSE'].includes(role);
}

export function canManageSettings(role: UserRole): boolean {
  return ['OH_ADMIN', 'TENANT_ADMIN'].includes(role);
}

export function maskPHI(value: string, role: UserRole): string {
  if (canViewPHI(role)) return value;
  if (canViewPartialPHI(role)) return value.substring(0, 3) + '***';
  return '***MASKED***';
}
