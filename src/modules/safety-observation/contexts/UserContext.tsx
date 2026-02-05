import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'inspector' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  initials: string;
  title: string;
}

interface UserContextType {
  currentUser: User;
  switchUser: (userId: string) => void;
  users: User[];
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'admin',
    initials: 'JD',
    title: 'Compliance Manager',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'inspector',
    initials: 'SJ',
    title: 'EHS Officer',
  },
  {
    id: '3',
    name: 'Mike Williams',
    email: 'mike.williams@company.com',
    role: 'viewer',
    initials: 'MW',
    title: 'Auditor',
  },
];

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);

  const switchUser = (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, switchUser, users: mockUsers }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
