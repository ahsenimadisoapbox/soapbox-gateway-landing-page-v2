import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';

import {
  User,
  mockUsers,
  mockNotifications,
  Notification,
} from '../data/mockData';

/* =======================
   TYPES
======================= */

export interface CalibrationEquipment {
  id: string;
  name: string;
  equipmentCode: string;
  category: string;
  model: string;
  serialNumber: string;
  location: string;
  lastCalibrationDate?: string;
  nextDueDate?: string;
  status: 'active' | 'due' | 'overdue' | 'inactive';
}

interface CalibrationEquipmentContextType {
  /* ---- GLOBAL (same as AppContext) ---- */
  currentUser: User;
  setCurrentUser: (user: User) => void;

  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  unreadCount: number;

  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;

  /* ---- MODULE-SPECIFIC ---- */
  equipments: CalibrationEquipment[];
  setEquipments: (data: CalibrationEquipment[]) => void;
  selectedEquipment: CalibrationEquipment | null;
  setSelectedEquipment: (equipment: CalibrationEquipment | null) => void;
}

/* =======================
   CONTEXT
======================= */

const CalibrationEquipmentContext =
  createContext<CalibrationEquipmentContextType | undefined>(undefined);

/* =======================
   PROVIDER
======================= */

export function CalibrationEquipmentProvider({
  children,
}: {
  children: ReactNode;
}) {
  /* ---- SAME AS AppContext ---- */
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  /* ---- MODULE STATE ---- */
  const [equipments, setEquipments] = useState<CalibrationEquipment[]>([]);
  const [selectedEquipment, setSelectedEquipment] =
    useState<CalibrationEquipment | null>(null);

  return (
    <CalibrationEquipmentContext.Provider
      value={{
        /* global */
        currentUser,
        setCurrentUser,
        notifications,
        markNotificationRead,
        unreadCount,
        sidebarCollapsed,
        setSidebarCollapsed,

        /* module */
        equipments,
        setEquipments,
        selectedEquipment,
        setSelectedEquipment,
      }}
    >
      {children}
    </CalibrationEquipmentContext.Provider>
  );
}

/* =======================
   HOOK
======================= */

export function useCalibrationEquipment() {
  const context = useContext(CalibrationEquipmentContext);
  if (context === undefined) {
    throw new Error(
      'useCalibrationEquipment must be used within a CalibrationEquipmentProvider'
    );
  }
  return context;
}
