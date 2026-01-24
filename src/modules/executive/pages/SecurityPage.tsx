import React, { useState } from 'react';
import { ExecutivePanel } from '../components/dashboard/ExecutivePanel';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Lock, Key, Shield, Users, FileText, AlertTriangle, Download } from 'lucide-react';
import { toast } from 'sonner';

const auditLogs = [
  { id: '1', action: 'User Login', user: 'John Doe', timestamp: new Date(), ip: '192.168.1.100', status: 'success' },
  { id: '2', action: 'Risk Updated', user: 'Sarah Chen', timestamp: new Date(Date.now() - 3600000), ip: '192.168.1.101', status: 'success' },
  { id: '3', action: 'Report Downloaded', user: 'Mike Rodriguez', timestamp: new Date(Date.now() - 7200000), ip: '192.168.1.102', status: 'success' },
  { id: '4', action: 'Failed Login Attempt', user: 'Unknown', timestamp: new Date(Date.now() - 10800000), ip: '203.0.113.50', status: 'failed' },
];

const SecurityPage = () => {
  const [searchLogs, setSearchLogs] = useState('');
  
  // IP Whitelisting Modal
  const [ipWhitelistModal, setIpWhitelistModal] = useState(false);
  const [ipAddress, setIpAddress] = useState('');
  
  // MFA Settings Modal
  const [mfaSettingsModal, setMfaSettingsModal] = useState(false);
  
  // SSO Config Modal
  const [ssoConfigModal, setSsoConfigModal] = useState(false);
  
  // Password Policy Modal
  const [passwordPolicyModal, setPasswordPolicyModal] = useState(false);
  const [minLength, setMinLength] = useState('12');
  
  // Session Config Modal
  const [sessionConfigModal, setSessionConfigModal] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  
  // Policy Modals
  const [dataRetentionModal, setDataRetentionModal] = useState(false);
  const [acceptableUseModal, setAcceptableUseModal] = useState(false);
  const [incidentResponseModal, setIncidentResponseModal] = useState(false);
  const [privacyPolicyModal, setPrivacyPolicyModal] = useState(false);

  const handleExportLogs = () => {
    toast.success('Exporting audit logs...');
  };

  const handleSaveIpWhitelist = () => {
    if (!ipAddress.trim()) {
      toast.error('Please enter an IP address');
      return;
    }
    toast.success('IP whitelist updated');
    setIpWhitelistModal(false);
    setIpAddress('');
  };

  const handleSaveMfaSettings = () => {
    toast.success('MFA settings saved');
    setMfaSettingsModal(false);
  };

  const handleSaveSsoConfig = () => {
    toast.success('SSO configuration saved');
    setSsoConfigModal(false);
  };

  const handleSavePasswordPolicy = () => {
    toast.success('Password policy updated');
    setPasswordPolicyModal(false);
  };

  const handleSaveSessionConfig = () => {
    toast.success('Session configuration saved');
    setSessionConfigModal(false);
  };

  const handleSaveDataRetention = () => {
    toast.success('Data retention policy updated');
    setDataRetentionModal(false);
  };

  const handleSaveAcceptableUse = () => {
    toast.success('Acceptable use policy updated');
    setAcceptableUseModal(false);
  };

  const handleSaveIncidentResponse = () => {
    toast.success('Incident response plan updated');
    setIncidentResponseModal(false);
  };

  const handleSavePrivacyPolicy = () => {
    toast.success('Privacy policy updated');
    setPrivacyPolicyModal(false);
  };

  const filteredLogs = auditLogs.filter(log =>
    log.action.toLowerCase().includes(searchLogs.toLowerCase()) ||
    log.user.toLowerCase().includes(searchLogs.toLowerCase())
  );

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Lock className="h-6 w-6 text-accent" />
              Security Settings
            </h1>
            <p className="text-muted-foreground mt-1">Manage security settings and access controls</p>
          </div>
        </div>

        <Tabs defaultValue="access" className="space-y-6">
          <TabsList>
            <TabsTrigger value="access">Access Control</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            <TabsTrigger value="policies">Security Policies</TabsTrigger>
          </TabsList>

          <TabsContent value="access">
            <ExecutivePanel title="Access Control Settings" icon={<Shield className="h-5 w-5" />}>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Role-Based Access Control (RBAC)</h4>
                    <p className="text-sm text-muted-foreground">Control access based on user roles</p>
                  </div>
                  <span className="text-success font-medium">Enabled</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Data Encryption</h4>
                    <p className="text-sm text-muted-foreground">AES-256 encryption for data at rest</p>
                  </div>
                  <span className="text-success font-medium">Enabled</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">IP Whitelisting</h4>
                    <p className="text-sm text-muted-foreground">Restrict access to approved IP addresses</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setIpWhitelistModal(true)}>Configure</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Segregation of Duties</h4>
                    <p className="text-sm text-muted-foreground">Enforce separation of critical functions</p>
                  </div>
                  <span className="text-success font-medium">Enabled</span>
                </div>
              </div>
            </ExecutivePanel>
          </TabsContent>

          <TabsContent value="authentication">
            <ExecutivePanel title="Authentication Settings" icon={<Key className="h-5 w-5" />}>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Multi-Factor Authentication (MFA)</h4>
                    <p className="text-sm text-muted-foreground">Require MFA for all users</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-success font-medium">Enforced</span>
                    <Button variant="outline" size="sm" onClick={() => setMfaSettingsModal(true)}>Settings</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Single Sign-On (SSO)</h4>
                    <p className="text-sm text-muted-foreground">Enable SSO with identity providers</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSsoConfigModal(true)}>Configure</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Password Requirements</h4>
                    <p className="text-sm text-muted-foreground">Minimum 12 characters, complexity rules</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setPasswordPolicyModal(true)}>Edit Policy</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Session Management</h4>
                    <p className="text-sm text-muted-foreground">Timeout: 30 minutes, max sessions: 3</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSessionConfigModal(true)}>Configure</Button>
                </div>
              </div>
            </ExecutivePanel>
          </TabsContent>

          <TabsContent value="audit">
            <ExecutivePanel title="Security Audit Logs" icon={<FileText className="h-5 w-5" />}>
              <div className="flex items-center gap-4 mb-4">
                <Input 
                  placeholder="Search logs..." 
                  className="max-w-sm" 
                  value={searchLogs}
                  onChange={(e) => setSearchLogs(e.target.value)}
                />
                <Button variant="outline" onClick={handleExportLogs}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Logs
                </Button>
              </div>
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Action</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Timestamp</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">IP Address</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="border-t border-border">
                        <td className="px-4 py-3 text-sm">{log.action}</td>
                        <td className="px-4 py-3 text-sm">{log.user}</td>
                        <td className="px-4 py-3 text-sm">{log.timestamp.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm font-mono">{log.ip}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            log.status === 'success' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ExecutivePanel>
          </TabsContent>

          <TabsContent value="policies">
            <ExecutivePanel title="Security Policies" icon={<AlertTriangle className="h-5 w-5" />}>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Data Retention Policy</h4>
                    <Button variant="outline" size="sm" onClick={() => setDataRetentionModal(true)}>View/Edit</Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">7 years retention for audit data, 2 years for operational data</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Acceptable Use Policy</h4>
                    <Button variant="outline" size="sm" onClick={() => setAcceptableUseModal(true)}>View/Edit</Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Last updated: January 1, 2025</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Incident Response Plan</h4>
                    <Button variant="outline" size="sm" onClick={() => setIncidentResponseModal(true)}>View/Edit</Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Last reviewed: December 15, 2024</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Privacy Policy</h4>
                    <Button variant="outline" size="sm" onClick={() => setPrivacyPolicyModal(true)}>View/Edit</Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">GDPR and CCPA compliant</p>
                </div>
              </div>
            </ExecutivePanel>
          </TabsContent>
        </Tabs>
      </div>

      {/* IP Whitelist Modal */}
      <Dialog open={ipWhitelistModal} onOpenChange={setIpWhitelistModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>IP Whitelisting</DialogTitle>
            <DialogDescription>Add IP addresses to the whitelist</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>IP Address</Label>
              <Input 
                value={ipAddress} 
                onChange={(e) => setIpAddress(e.target.value)}
                placeholder="e.g., 192.168.1.0/24"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIpWhitelistModal(false)}>Cancel</Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={handleSaveIpWhitelist}>Add IP</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MFA Settings Modal */}
      <Dialog open={mfaSettingsModal} onOpenChange={setMfaSettingsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>MFA Settings</DialogTitle>
            <DialogDescription>Configure multi-factor authentication options</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>MFA Method</Label>
              <Select defaultValue="totp">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="totp">TOTP (Authenticator App)</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMfaSettingsModal(false)}>Cancel</Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={handleSaveMfaSettings}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SSO Config Modal */}
      <Dialog open={ssoConfigModal} onOpenChange={setSsoConfigModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Single Sign-On Configuration</DialogTitle>
            <DialogDescription>Configure SSO with your identity provider</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Identity Provider</Label>
              <Select defaultValue="azure">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="azure">Azure AD</SelectItem>
                  <SelectItem value="okta">Okta</SelectItem>
                  <SelectItem value="google">Google Workspace</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSsoConfigModal(false)}>Cancel</Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={handleSaveSsoConfig}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Policy Modal */}
      <Dialog open={passwordPolicyModal} onOpenChange={setPasswordPolicyModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Password Policy</DialogTitle>
            <DialogDescription>Configure password requirements</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Minimum Length</Label>
              <Input 
                type="number" 
                value={minLength} 
                onChange={(e) => setMinLength(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordPolicyModal(false)}>Cancel</Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={handleSavePasswordPolicy}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Session Config Modal */}
      <Dialog open={sessionConfigModal} onOpenChange={setSessionConfigModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Session Management</DialogTitle>
            <DialogDescription>Configure session timeout settings</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Session Timeout (minutes)</Label>
              <Input 
                type="number" 
                value={sessionTimeout} 
                onChange={(e) => setSessionTimeout(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSessionConfigModal(false)}>Cancel</Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={handleSaveSessionConfig}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Data Retention Modal */}
      <Dialog open={dataRetentionModal} onOpenChange={setDataRetentionModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Data Retention Policy</DialogTitle>
            <DialogDescription>View and edit data retention settings</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">Data retention policy editor will be displayed here.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDataRetentionModal(false)}>Cancel</Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={handleSaveDataRetention}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Acceptable Use Modal */}
      <Dialog open={acceptableUseModal} onOpenChange={setAcceptableUseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Acceptable Use Policy</DialogTitle>
            <DialogDescription>View and edit acceptable use policy</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">Acceptable use policy editor will be displayed here.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAcceptableUseModal(false)}>Cancel</Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={handleSaveAcceptableUse}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Incident Response Modal */}
      <Dialog open={incidentResponseModal} onOpenChange={setIncidentResponseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Incident Response Plan</DialogTitle>
            <DialogDescription>View and edit incident response procedures</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">Incident response plan editor will be displayed here.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIncidentResponseModal(false)}>Cancel</Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={handleSaveIncidentResponse}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Modal */}
      <Dialog open={privacyPolicyModal} onOpenChange={setPrivacyPolicyModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
            <DialogDescription>View and edit privacy policy</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">Privacy policy editor will be displayed here.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPrivacyPolicyModal(false)}>Cancel</Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={handleSavePrivacyPolicy}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SecurityPage;
