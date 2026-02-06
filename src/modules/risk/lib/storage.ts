import { Risk, User, Notification, AuditRecord } from '../types/risk';

const STORAGE_KEYS = {
  CURRENT_USER: 'soapbox_current_user',
  RISKS: 'soapbox_risks',
  USERS: 'soapbox_users',
  NOTIFICATIONS: 'soapbox_notifications',
  AUDIT_LOG: 'soapbox_audit_log',
} as const;

// Current User Management
export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return stored ? JSON.parse(stored) : null;
};

export const setCurrentUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
};

export const logout = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

// Risk Management
export const getRisks = (): Risk[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.RISKS);
  return stored ? JSON.parse(stored).map((risk: any) => ({
    ...risk,
    createdAt: new Date(risk.createdAt),
    updatedAt: new Date(risk.updatedAt),
    dueDate: risk.dueDate ? new Date(risk.dueDate) : undefined,
  })) : [];
};

export const saveRisk = (risk: Risk): void => {
  const risks = getRisks();
  const existingIndex = risks.findIndex(r => r.id === risk.id);
  
  if (existingIndex >= 0) {
    risks[existingIndex] = risk;
  } else {
    risks.push(risk);
  }
  
  localStorage.setItem(STORAGE_KEYS.RISKS, JSON.stringify(risks));
  
  // Log the action
  logAuditAction({
    riskId: risk.id,
    action: existingIndex >= 0 ? 'updated' : 'created',
    userId: getCurrentUser()?.id || 'system',
    details: { status: risk.status, title: risk.title }
  });
};

export const getRiskById = (id: string): Risk | null => {
  const risks = getRisks();
  return risks.find(risk => risk.id === id) || null;
};

// User Management
export const getUsers = (): User[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.USERS);
  return stored ? JSON.parse(stored) : [];
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

// Notifications
export const getNotifications = (userId: string): Notification[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  const allNotifications: Notification[] = stored ? JSON.parse(stored).map((notif: any) => ({
    ...notif,
    createdAt: new Date(notif.createdAt)
  })) : [];
  
  return allNotifications.filter(n => n.userId === userId);
};

export const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>): void => {
  const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  const notifications: Notification[] = stored ? JSON.parse(stored) : [];
  
  const newNotification: Notification = {
    ...notification,
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(),
  };
  
  notifications.push(newNotification);
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
};

export const markNotificationAsRead = (notificationId: string): void => {
  const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  const notifications: Notification[] = stored ? JSON.parse(stored) : [];
  
  const notification = notifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }
};

// Audit Log
export const logAuditAction = (action: Omit<AuditRecord, 'id' | 'timestamp'>): void => {
  const stored = localStorage.getItem(STORAGE_KEYS.AUDIT_LOG);
  const auditLog: AuditRecord[] = stored ? JSON.parse(stored) : [];
  
  const newRecord: AuditRecord = {
    ...action,
    id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
  };
  
  auditLog.push(newRecord);
  localStorage.setItem(STORAGE_KEYS.AUDIT_LOG, JSON.stringify(auditLog));
};

export const getAuditLog = (riskId?: string): AuditRecord[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.AUDIT_LOG);
  const auditLog: AuditRecord[] = stored ? JSON.parse(stored).map((record: any) => ({
    ...record,
    timestamp: new Date(record.timestamp)
  })) : [];
  
  return riskId ? auditLog.filter(record => record.riskId === riskId) : auditLog;
};

// Calculate Risk Score
export const calculateRiskScore = (impact: number, likelihood: number, detectability: number): number => {
  return impact * likelihood * detectability;
};

// Generate Risk ID
export const generateRiskId = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  
  return `RISK-${year}${month}${day}-${random}`;
};