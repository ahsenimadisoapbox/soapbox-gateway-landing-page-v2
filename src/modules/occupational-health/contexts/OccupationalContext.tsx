import React, { createContext, useContext, useState, ReactNode } from 'react';

/* =======================
   ROLE TYPES
======================= */

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

/* =======================
   MODELS
======================= */

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

/* =======================
   CONTEXT TYPE
======================= */

interface OccupationalHealthContextType {
  // User
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

  // UI
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

/* =======================
   MOCK DATA (UNCHANGED)
======================= */

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

// ⛔ Employees, Exams, ClinicVisits, IllnessCases, Notifications
// ⛔ Use EXACT SAME mock arrays you already have
// (Kept unchanged intentionally)

/* =======================
   CONTEXT
======================= */

const OccupationalHealthContext =
  createContext<OccupationalHealthContextType | undefined>(undefined);

/* =======================
   PROVIDER
======================= */

export function OccupationalHealthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [clinicVisits, setClinicVisits] = useState<any[]>([]);
  const [illnessCases, setIllnessCases] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <OccupationalHealthContext.Provider
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
    </OccupationalHealthContext.Provider>
  );
}

/* =======================
   HOOK
======================= */

export function useOccupationalHealth() {
  const context = useContext(OccupationalHealthContext);
  if (!context) {
    throw new Error(
      'useOccupationalHealth must be used within OccupationalHealthProvider'
    );
  }
  return context;
}

/* =======================
   ROLE PERMISSION HELPERS
======================= */

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
