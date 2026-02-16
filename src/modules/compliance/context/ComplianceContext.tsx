import { createContext, useContext, useState } from "react";
import { User } from "../types/compliance"; 
import { mockComplianceUsers } from "../lib/mockData";

interface ComplianceContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
}

const ComplianceContext = createContext<ComplianceContextType | undefined>(
  undefined
);

export const ComplianceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentUser, setCurrentUser] = useState<User>(
    mockComplianceUsers[0]
  );

  return (
    <ComplianceContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </ComplianceContext.Provider>
  );
};

export const useCompliance = () => {
  const context = useContext(ComplianceContext);

  if (!context) {
    throw new Error("useCompliance must be used within ComplianceProvider");
  }

  return context;
};
