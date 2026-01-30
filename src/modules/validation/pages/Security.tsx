import React from 'react';
import { Lock, Shield, FileText, Users, AlertTriangle, CheckCircle, Clock, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';

interface AuditLogEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  category: 'Authentication' | 'Document' | 'Approval' | 'Configuration';
}

const mockAuditLog: AuditLogEntry[] = [
  {
    id: 'AL-001',
    action: 'User Login',
    user: 'John Doe',
    timestamp: '2025-01-15 09:00:15',
    details: 'Successful login from IP 192.168.1.100',
    category: 'Authentication',
  },
  {
    id: 'AL-002',
    action: 'Document Approved',
    user: 'Sarah Chen',
    timestamp: '2025-01-15 08:45:30',
    details: 'Test Protocol TP-001 approved with e-signature',
    category: 'Approval',
  },
  {
    id: 'AL-003',
    action: 'Deviation Created',
    user: 'Mike Rodriguez',
    timestamp: '2025-01-14 16:30:00',
    details: 'DEV-002 created for project VP-001',
    category: 'Document',
  },
  {
    id: 'AL-004',
    action: 'Role Changed',
    user: 'Admin',
    timestamp: '2025-01-14 14:00:00',
    details: 'Jennifer Walsh role changed from Test Executor to Change Owner',
    category: 'Configuration',
  },
  {
    id: 'AL-005',
    action: 'Inspector Mode Entered',
    user: 'David Kim',
    timestamp: '2025-01-13 10:00:00',
    details: 'Inspector session started, duration 2 hours',
    category: 'Authentication',
  },
];

export const Security: React.FC = () => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Authentication':
        return <Lock size={14} />;
      case 'Document':
        return <FileText size={14} />;
      case 'Approval':
        return <CheckCircle size={14} />;
      case 'Configuration':
        return <Users size={14} />;
      default:
        return <Shield size={14} />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-muted">
          <Lock size={24} className="text-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Security</h1>
          <p className="text-muted-foreground">
            Access controls, audit trails, and compliance settings
          </p>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="enterprise-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-status-validated/10">
              <Shield size={20} className="text-status-validated" />
            </div>
            <div>
              <p className="text-xl font-bold">100%</p>
              <p className="text-xs text-muted-foreground">21 CFR Part 11</p>
            </div>
          </CardContent>
        </Card>
        <Card className="enterprise-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-step-current/10">
              <Users size={20} className="text-step-current" />
            </div>
            <div>
              <p className="text-xl font-bold">6</p>
              <p className="text-xs text-muted-foreground">Active Users</p>
            </div>
          </CardContent>
        </Card>
        <Card className="enterprise-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-status-validated/10">
              <CheckCircle size={20} className="text-status-validated" />
            </div>
            <div>
              <p className="text-xl font-bold">2FA</p>
              <p className="text-xs text-muted-foreground">Enabled</p>
            </div>
          </CardContent>
        </Card>
        <Card className="enterprise-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <Clock size={20} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-xl font-bold">30m</p>
              <p className="text-xs text-muted-foreground">Session Timeout</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Access Controls */}
        <Card className="enterprise-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={18} />
              Role-Based Access Control
            </CardTitle>
            <CardDescription>Segregation of duties matrix</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-medium">Role</th>
                    <th className="text-center py-2 font-medium">Create</th>
                    <th className="text-center py-2 font-medium">Edit</th>
                    <th className="text-center py-2 font-medium">Approve</th>
                    <th className="text-center py-2 font-medium">Execute</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { role: 'Validation Lead', create: true, edit: true, approve: true, execute: false },
                    { role: 'QA / Compliance', create: false, edit: false, approve: true, execute: false },
                    { role: 'Test Executor', create: false, edit: false, approve: false, execute: true },
                    { role: 'Change Owner', create: true, edit: true, approve: false, execute: false },
                    { role: 'Auditor / Inspector', create: false, edit: false, approve: false, execute: false },
                    { role: 'Executive', create: false, edit: false, approve: true, execute: false },
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-border last:border-0">
                      <td className="py-2 font-medium">{row.role}</td>
                      <td className="text-center py-2">
                        {row.create ? (
                          <CheckCircle size={16} className="inline text-status-validated" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="text-center py-2">
                        {row.edit ? (
                          <CheckCircle size={16} className="inline text-status-validated" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="text-center py-2">
                        {row.approve ? (
                          <CheckCircle size={16} className="inline text-status-validated" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="text-center py-2">
                        {row.execute ? (
                          <CheckCircle size={16} className="inline text-status-validated" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Electronic Signatures */}
        <Card className="enterprise-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText size={18} />
              Electronic Signature (21 CFR Part 11)
            </CardTitle>
            <CardDescription>Compliance status and settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { feature: 'Unique user identification', status: 'Compliant' },
              { feature: 'Password + 2FA authentication', status: 'Compliant' },
              { feature: 'Signature meaning capture', status: 'Compliant' },
              { feature: 'Timestamp and audit trail', status: 'Compliant' },
              { feature: 'Signature manifestation display', status: 'Compliant' },
              { feature: 'Record linkage to signature', status: 'Compliant' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <span className="text-sm">{item.feature}</span>
                <span className="status-badge status-badge-active flex items-center gap-1">
                  <CheckCircle size={12} />
                  {item.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Audit Trail */}
      <Card className="enterprise-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Eye size={18} />
              Audit Trail
            </CardTitle>
            <CardDescription>Complete record of all system activities</CardDescription>
          </div>
          <Button variant="outline">
            Export Log
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAuditLog.map((entry) => (
              <div
                key={entry.id}
                className="p-3 border border-border rounded-lg flex items-start justify-between hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'p-2 rounded-lg',
                    entry.category === 'Authentication' && 'bg-step-current/10',
                    entry.category === 'Document' && 'bg-muted',
                    entry.category === 'Approval' && 'bg-status-validated/10',
                    entry.category === 'Configuration' && 'bg-status-conditional/10'
                  )}>
                    {getCategoryIcon(entry.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{entry.action}</span>
                      <span className="text-xs px-2 py-0.5 bg-secondary rounded">{entry.category}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{entry.details}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {entry.user} • {entry.timestamp}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-muted-foreground">{entry.id}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Security;
