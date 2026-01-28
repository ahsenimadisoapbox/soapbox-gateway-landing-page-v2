import React, { useState } from 'react';
import { Shield, Key, Lock, Users, Eye, EyeOff, AlertTriangle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
import { toast } from '../hooks/use-toast';
import { format } from 'date-fns';

interface SecurityLog {
  id: string;
  action: string;
  user: string;
  ipAddress: string;
  timestamp: string;
  status: 'success' | 'failed' | 'warning';
}

interface ActiveSession {
  id: string;
  user: string;
  device: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

const mockSecurityLogs: SecurityLog[] = [
  { id: 'LOG-001', action: 'Login', user: 'john.smith@company.com', ipAddress: '192.168.1.100', timestamp: '2025-01-19T08:30:00Z', status: 'success' },
  { id: 'LOG-002', action: 'Password Change', user: 'emily.davis@company.com', ipAddress: '192.168.1.105', timestamp: '2025-01-19T08:15:00Z', status: 'success' },
  { id: 'LOG-003', action: 'Failed Login Attempt', user: 'unknown@external.com', ipAddress: '203.0.113.50', timestamp: '2025-01-19T07:45:00Z', status: 'failed' },
  { id: 'LOG-004', action: 'Role Change', user: 'admin@company.com', ipAddress: '192.168.1.1', timestamp: '2025-01-19T07:30:00Z', status: 'warning' },
  { id: 'LOG-005', action: 'API Key Generated', user: 'robert.chen@company.com', ipAddress: '192.168.1.110', timestamp: '2025-01-18T16:00:00Z', status: 'success' },
  { id: 'LOG-006', action: 'Login', user: 'sarah.johnson@company.com', ipAddress: '192.168.1.102', timestamp: '2025-01-18T14:20:00Z', status: 'success' },
  { id: 'LOG-007', action: 'MFA Enabled', user: 'lisa.anderson@company.com', ipAddress: '192.168.1.108', timestamp: '2025-01-18T11:00:00Z', status: 'success' },
  { id: 'LOG-008', action: 'Failed Login Attempt', user: 'john.smith@company.com', ipAddress: '10.0.0.50', timestamp: '2025-01-18T09:15:00Z', status: 'failed' },
];

const mockActiveSessions: ActiveSession[] = [
  { id: 'SES-001', user: 'john.smith@company.com', device: 'Chrome on Windows', location: 'New York, US', lastActive: '2025-01-19T08:30:00Z', isCurrent: true },
  { id: 'SES-002', user: 'john.smith@company.com', device: 'Safari on iPhone', location: 'New York, US', lastActive: '2025-01-19T07:45:00Z', isCurrent: false },
  { id: 'SES-003', user: 'emily.davis@company.com', device: 'Firefox on macOS', location: 'Boston, US', lastActive: '2025-01-19T08:15:00Z', isCurrent: false },
  { id: 'SES-004', user: 'robert.chen@company.com', device: 'Chrome on Windows', location: 'Chicago, US', lastActive: '2025-01-18T16:00:00Z', isCurrent: false },
];

export default function SecurityPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [passwordExpiry, setPasswordExpiry] = useState('90');
  const [ipWhitelist, setIpWhitelist] = useState('');
  const [mfaSetupOpen, setMfaSetupOpen] = useState(false);
  const [terminateSessionOpen, setTerminateSessionOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<ActiveSession | null>(null);

  const handleSaveSettings = () => {
    toast({ title: 'Security Settings Saved', description: 'Your security settings have been updated successfully.' });
  };

  const handleGenerateApiKey = () => {
    toast({ title: 'API Key Generated', description: 'New API key has been generated. Make sure to copy it now.' });
  };

  const handleRevokeAllSessions = () => {
    toast({ title: 'Sessions Revoked', description: 'All other sessions have been terminated.' });
  };

  const handleTerminateSession = () => {
    if (selectedSession) {
      toast({ title: 'Session Terminated', description: `Session for ${selectedSession.device} has been terminated.` });
      setTerminateSessionOpen(false);
      setSelectedSession(null);
    }
  };

  const handleSetupMfa = () => {
    setMfaSetupOpen(true);
  };

  const handleConfirmMfa = () => {
    setMfaEnabled(true);
    setMfaSetupOpen(false);
    toast({ title: 'MFA Enabled', description: 'Multi-factor authentication has been enabled for your account.' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20"><CheckCircle className="h-3 w-3 mr-1" />Success</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Failed</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20"><AlertTriangle className="h-3 w-3 mr-1" />Warning</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Security</h1>
          <p className="text-muted-foreground">Manage security settings, authentication, and access controls</p>
        </div>
      </div>

      <Tabs defaultValue="authentication" className="space-y-4">
        <TabsList>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="audit-log">Security Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="authentication">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Password Policy
                </CardTitle>
                <CardDescription>Configure password requirements and expiration settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Minimum Password Length</Label>
                    <Select defaultValue="12">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="8">8 characters</SelectItem>
                        <SelectItem value="10">10 characters</SelectItem>
                        <SelectItem value="12">12 characters</SelectItem>
                        <SelectItem value="16">16 characters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Password Expiry (Days)</Label>
                    <Select value={passwordExpiry} onValueChange={setPasswordExpiry}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">180 days</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Require Special Characters</p>
                    <p className="text-sm text-muted-foreground">Passwords must contain at least one special character</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Require Uppercase & Lowercase</p>
                    <p className="text-sm text-muted-foreground">Passwords must contain mixed case letters</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Prevent Password Reuse</p>
                    <p className="text-sm text-muted-foreground">Cannot reuse the last 5 passwords</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Multi-Factor Authentication
                </CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Enable MFA for All Users</p>
                    <p className="text-sm text-muted-foreground">Require all users to set up multi-factor authentication</p>
                  </div>
                  <Switch checked={mfaEnabled} onCheckedChange={setMfaEnabled} />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Allow SMS Authentication</p>
                    <p className="text-sm text-muted-foreground">Allow users to receive codes via SMS</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Allow Authenticator Apps</p>
                    <p className="text-sm text-muted-foreground">Allow users to use authenticator apps (Google Authenticator, Authy, etc.)</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Button variant="outline" onClick={handleSetupMfa}>
                  <Key className="h-4 w-4 mr-2" />
                  Setup MFA
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Session Settings
                </CardTitle>
                <CardDescription>Configure session timeout and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Session Timeout (Minutes)</Label>
                  <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="480">8 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Single Session Only</p>
                    <p className="text-sm text-muted-foreground">Allow only one active session per user</p>
                  </div>
                  <Switch />
                </div>
                <Button onClick={handleSaveSettings}>Save Security Settings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Active Sessions
                </CardTitle>
                <CardDescription>View and manage all active user sessions</CardDescription>
              </div>
              <Button variant="destructive" onClick={handleRevokeAllSessions}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Revoke All Other Sessions
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockActiveSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">{session.user}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {session.device}
                          {session.isCurrent && <Badge variant="secondary">Current</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>{session.location}</TableCell>
                      <TableCell>{format(new Date(session.lastActive), 'MMM dd, yyyy HH:mm')}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={session.isCurrent}
                          onClick={() => {
                            setSelectedSession(session);
                            setTerminateSessionOpen(true);
                          }}
                        >
                          Terminate
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-keys">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Keys
              </CardTitle>
              <CardDescription>Manage API keys for system integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">Production API Key</p>
                      <p className="text-sm text-muted-foreground">Created on Jan 15, 2025</p>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value="sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      readOnly
                      className="font-mono"
                    />
                    <Button variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">Development API Key</p>
                      <p className="text-sm text-muted-foreground">Created on Jan 10, 2025</p>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value="sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      readOnly
                      className="font-mono"
                    />
                    <Button variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleGenerateApiKey}>
                  <Key className="h-4 w-4 mr-2" />
                  Generate New API Key
                </Button>
                <Button variant="outline">Revoke All Keys</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                IP Whitelist
              </CardTitle>
              <CardDescription>Restrict API access to specific IP addresses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Allowed IP Addresses (one per line)</Label>
                <textarea
                  className="w-full min-h-[100px] p-3 border rounded-md font-mono text-sm bg-background"
                  placeholder="192.168.1.0/24&#10;10.0.0.0/8&#10;203.0.113.50"
                  value={ipWhitelist}
                  onChange={(e) => setIpWhitelist(e.target.value)}
                />
              </div>
              <Button onClick={handleSaveSettings}>Save IP Whitelist</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit-log">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Security Audit Log
              </CardTitle>
              <CardDescription>View all security-related events and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSecurityLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm')}</TableCell>
                      <TableCell className="font-medium">{log.action}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* MFA Setup Dialog */}
      <Dialog open={mfaSetupOpen} onOpenChange={setMfaSetupOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Setup Multi-Factor Authentication</DialogTitle>
            <DialogDescription>
              Scan the QR code below with your authenticator app to set up MFA.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground text-sm text-center p-4">QR Code Placeholder</p>
            </div>
            <p className="text-sm text-muted-foreground">Or enter this code manually:</p>
            <code className="px-4 py-2 bg-muted rounded-md font-mono">ABCD-EFGH-IJKL-MNOP</code>
            <div className="w-full space-y-2">
              <Label>Enter verification code</Label>
              <Input placeholder="000000" maxLength={6} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMfaSetupOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmMfa}>Verify & Enable</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Terminate Session Dialog */}
      <Dialog open={terminateSessionOpen} onOpenChange={setTerminateSessionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Terminate Session</DialogTitle>
            <DialogDescription>
              Are you sure you want to terminate this session? The user will be logged out immediately.
            </DialogDescription>
          </DialogHeader>
          {selectedSession && (
            <div className="py-4">
              <p><strong>Device:</strong> {selectedSession.device}</p>
              <p><strong>Location:</strong> {selectedSession.location}</p>
              <p><strong>User:</strong> {selectedSession.user}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setTerminateSessionOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleTerminateSession}>Terminate Session</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
