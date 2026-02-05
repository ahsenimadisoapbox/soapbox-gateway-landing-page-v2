import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { FormModal } from '../components/common/FormModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { StatusBadge } from '../components/common/StatusBadge';
import { ActionButtons } from '../components/common/ActionButtons';
import { toast } from '../hooks/use-toast';
import { Link2, Plus, Users, FlaskConical, Activity, Key, RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  type: 'hrms' | 'lims' | 'device' | 'api';
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  endpoint?: string;
}

interface ApiToken {
  id: string;
  name: string;
  token: string;
  permissions: string;
  createdAt: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'revoked';
}

interface SyncLog {
  id: string;
  integration: string;
  type: 'sync' | 'error' | 'warning';
  message: string;
  timestamp: string;
}

const mockIntegrations: Integration[] = [
  { id: '1', name: 'SAP SuccessFactors', type: 'hrms', status: 'connected', lastSync: '2024-01-15 08:00', endpoint: 'https://api.sap.com/hr' },
  { id: '2', name: 'LabCorp LIMS', type: 'lims', status: 'connected', lastSync: '2024-01-15 07:30', endpoint: 'https://api.labcorp.com/lims' },
  { id: '3', name: 'BioHarness Devices', type: 'device', status: 'error', lastSync: '2024-01-14 12:00', endpoint: 'wss://devices.bioharness.com' },
  { id: '4', name: 'External EHR API', type: 'api', status: 'disconnected', lastSync: '2024-01-10 09:00', endpoint: 'https://ehr.external.com/api' },
];

const mockTokens: ApiToken[] = [
  { id: '1', name: 'Mobile App Token', token: 'sk_live_xxxxx...xxxxx', permissions: 'read:employees, read:exams', createdAt: '2024-01-01', expiresAt: '2025-01-01', status: 'active' },
  { id: '2', name: 'BI Dashboard', token: 'sk_live_yyyyy...yyyyy', permissions: 'read:reports, read:analytics', createdAt: '2023-06-01', expiresAt: '2024-06-01', status: 'expired' },
  { id: '3', name: 'Third Party Integration', token: 'sk_live_zzzzz...zzzzz', permissions: 'write:wellness', createdAt: '2024-01-10', expiresAt: '2025-01-10', status: 'active' },
];

const mockLogs: SyncLog[] = [
  { id: '1', integration: 'SAP SuccessFactors', type: 'sync', message: 'Successfully synced 150 employee records', timestamp: '2024-01-15 08:00' },
  { id: '2', integration: 'LabCorp LIMS', type: 'sync', message: 'Synced 25 lab results', timestamp: '2024-01-15 07:30' },
  { id: '3', integration: 'BioHarness Devices', type: 'error', message: 'Connection timeout - retrying in 5 minutes', timestamp: '2024-01-14 12:00' },
  { id: '4', integration: 'SAP SuccessFactors', type: 'warning', message: '3 records skipped due to validation errors', timestamp: '2024-01-15 08:00' },
];

export default function Integrations() {
  const [activeTab, setActiveTab] = useState('connections');
  const [integrations, setIntegrations] = useState(mockIntegrations);
  const [tokens, setTokens] = useState(mockTokens);
  const [logs] = useState(mockLogs);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalType, setModalType] = useState<'integration' | 'token'>('integration');

  const [integrationForm, setIntegrationForm] = useState({ name: '', type: 'hrms', endpoint: '', apiKey: '' });
  const [tokenForm, setTokenForm] = useState({ name: '', permissions: '', expiresAt: '' });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hrms': return <Users className="h-4 w-4" />;
      case 'lims': return <FlaskConical className="h-4 w-4" />;
      case 'device': return <Activity className="h-4 w-4" />;
      default: return <Link2 className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': case 'active': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error': case 'expired': case 'revoked': return <AlertCircle className="h-4 w-4 text-destructive" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleAddIntegration = () => {
    setModalType('integration');
    setIntegrationForm({ name: '', type: 'hrms', endpoint: '', apiKey: '' });
    setAddModalOpen(true);
  };

  const handleAddToken = () => {
    setModalType('token');
    setTokenForm({ name: '', permissions: '', expiresAt: '' });
    setAddModalOpen(true);
  };

  const handleView = (item: any, type: 'integration' | 'token') => {
    setSelectedItem(item);
    setModalType(type);
    setViewModalOpen(true);
  };

  const handleEdit = (item: any, type: 'integration' | 'token') => {
    setSelectedItem(item);
    setModalType(type);
    if (type === 'integration') {
      setIntegrationForm({ name: item.name, type: item.type, endpoint: item.endpoint || '', apiKey: '' });
    } else {
      setTokenForm({ name: item.name, permissions: item.permissions, expiresAt: item.expiresAt });
    }
    setEditModalOpen(true);
  };

  const handleDelete = (item: any, type: 'integration' | 'token') => {
    setSelectedItem(item);
    setModalType(type);
    setDeleteDialogOpen(true);
  };

  const handleSync = (integration: Integration) => {
    toast({ title: 'Sync Started', description: `Syncing ${integration.name}...` });
    setTimeout(() => {
      setIntegrations(integrations.map(i => i.id === integration.id ? { ...i, lastSync: new Date().toLocaleString(), status: 'connected' } : i));
      toast({ title: 'Sync Complete', description: `${integration.name} synced successfully.` });
    }, 1500);
  };

  const handleSaveIntegration = () => {
    if (editModalOpen && selectedItem) {
      setIntegrations(integrations.map(i => i.id === selectedItem.id ? { ...i, name: integrationForm.name, type: integrationForm.type as any, endpoint: integrationForm.endpoint } : i));
      toast({ title: 'Integration Updated', description: 'Integration settings have been updated.' });
    } else {
      const newIntegration: Integration = { id: Date.now().toString(), name: integrationForm.name, type: integrationForm.type as any, status: 'disconnected', lastSync: '-', endpoint: integrationForm.endpoint };
      setIntegrations([...integrations, newIntegration]);
      toast({ title: 'Integration Added', description: 'New integration has been configured.' });
    }
    setAddModalOpen(false);
    setEditModalOpen(false);
  };

  const handleSaveToken = () => {
    if (editModalOpen && selectedItem) {
      setTokens(tokens.map(t => t.id === selectedItem.id ? { ...t, name: tokenForm.name, permissions: tokenForm.permissions, expiresAt: tokenForm.expiresAt } : t));
      toast({ title: 'Token Updated', description: 'API token has been updated.' });
    } else {
      const newToken: ApiToken = { id: Date.now().toString(), name: tokenForm.name, token: `sk_live_${Math.random().toString(36).substr(2, 20)}`, permissions: tokenForm.permissions, createdAt: new Date().toISOString().split('T')[0], expiresAt: tokenForm.expiresAt, status: 'active' };
      setTokens([...tokens, newToken]);
      toast({ title: 'Token Created', description: 'New API token has been generated.' });
    }
    setAddModalOpen(false);
    setEditModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (modalType === 'integration') {
      setIntegrations(integrations.filter(i => i.id !== selectedItem.id));
      toast({ title: 'Integration Removed', description: 'Integration has been disconnected.', variant: 'destructive' });
    } else {
      setTokens(tokens.filter(t => t.id !== selectedItem.id));
      toast({ title: 'Token Revoked', description: 'API token has been revoked.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Link2 className="h-7 w-7 text-primary" />Integrations</h1>
          <p className="page-subtitle">Manage external system connections and API access</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Connected', value: integrations.filter(i => i.status === 'connected').length, color: 'text-success' },
          { label: 'Disconnected', value: integrations.filter(i => i.status === 'disconnected').length, color: 'text-muted-foreground' },
          { label: 'Errors', value: integrations.filter(i => i.status === 'error').length, color: 'text-destructive' },
          { label: 'Active Tokens', value: tokens.filter(t => t.status === 'active').length, color: 'text-primary' },
        ].map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="p-4 text-center">
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="tokens">API Tokens</TabsTrigger>
          <TabsTrigger value="logs">Sync Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="connections">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>System Connections</CardTitle>
              <Button onClick={handleAddIntegration}><Plus className="h-4 w-4 mr-2" />Add Integration</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Integration</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Sync</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {integrations.map((integration) => (
                    <TableRow key={integration.id}>
                      <TableCell className="font-medium">{integration.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(integration.type)}
                          <span className="capitalize">{integration.type.toUpperCase()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(integration.status)}
                          <StatusBadge variant={integration.status === 'connected' ? 'success' : integration.status === 'error' ? 'error' : 'muted'}>
                            {integration.status}
                          </StatusBadge>
                        </div>
                      </TableCell>
                      <TableCell>{integration.lastSync}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleSync(integration)}><RefreshCw className="h-4 w-4" /></Button>
                          <ActionButtons onView={() => handleView(integration, 'integration')} onEdit={() => handleEdit(integration, 'integration')} onDelete={() => handleDelete(integration, 'integration')} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokens">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>API Tokens</CardTitle>
              <Button onClick={handleAddToken}><Plus className="h-4 w-4 mr-2" /><Key className="h-4 w-4 mr-2" />Generate Token</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Token</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tokens.map((token) => (
                    <TableRow key={token.id}>
                      <TableCell className="font-medium">{token.name}</TableCell>
                      <TableCell><code className="text-xs bg-muted px-2 py-1 rounded">{token.token}</code></TableCell>
                      <TableCell className="text-sm">{token.permissions}</TableCell>
                      <TableCell>{token.expiresAt}</TableCell>
                      <TableCell>
                        <StatusBadge variant={token.status === 'active' ? 'success' : token.status === 'expired' ? 'warning' : 'error'}>
                          {token.status}
                        </StatusBadge>
                      </TableCell>
                      <TableCell className="text-right">
                        <ActionButtons onView={() => handleView(token, 'token')} onEdit={() => handleEdit(token, 'token')} onDelete={() => handleDelete(token, 'token')} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader><CardTitle>Sync & Error Logs</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Integration</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.integration}</TableCell>
                      <TableCell>
                        <StatusBadge variant={log.type === 'sync' ? 'success' : log.type === 'error' ? 'error' : 'warning'}>
                          {log.type}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>{log.message}</TableCell>
                      <TableCell>{log.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Modal */}
      <FormModal open={viewModalOpen} onClose={() => setViewModalOpen(false)} title={modalType === 'integration' ? 'Integration Details' : 'Token Details'} size="md">
        {selectedItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-muted-foreground">Name</Label><p className="font-medium">{selectedItem.name}</p></div>
              {modalType === 'integration' ? (
                <>
                  <div><Label className="text-muted-foreground">Type</Label><p className="font-medium uppercase">{selectedItem.type}</p></div>
                  <div className="col-span-2"><Label className="text-muted-foreground">Endpoint</Label><p className="font-medium">{selectedItem.endpoint}</p></div>
                  <div><Label className="text-muted-foreground">Last Sync</Label><p className="font-medium">{selectedItem.lastSync}</p></div>
                </>
              ) : (
                <>
                  <div><Label className="text-muted-foreground">Created</Label><p className="font-medium">{selectedItem.createdAt}</p></div>
                  <div className="col-span-2"><Label className="text-muted-foreground">Token</Label><code className="block text-xs bg-muted px-2 py-1 rounded">{selectedItem.token}</code></div>
                  <div className="col-span-2"><Label className="text-muted-foreground">Permissions</Label><p className="font-medium">{selectedItem.permissions}</p></div>
                  <div><Label className="text-muted-foreground">Expires</Label><p className="font-medium">{selectedItem.expiresAt}</p></div>
                </>
              )}
              <div><Label className="text-muted-foreground">Status</Label><StatusBadge variant={selectedItem.status === 'connected' || selectedItem.status === 'active' ? 'success' : 'error'}>{selectedItem.status}</StatusBadge></div>
            </div>
          </div>
        )}
      </FormModal>

      {/* Add/Edit Integration Modal */}
      <FormModal open={(addModalOpen || editModalOpen) && modalType === 'integration'} onClose={() => { setAddModalOpen(false); setEditModalOpen(false); }} title={editModalOpen ? 'Edit Integration' : 'Add Integration'} onSubmit={handleSaveIntegration} submitLabel={editModalOpen ? 'Save Changes' : 'Add Integration'} size="md">
        <div className="space-y-4">
          <div className="space-y-2"><Label>Integration Name</Label><Input value={integrationForm.name} onChange={(e) => setIntegrationForm({ ...integrationForm, name: e.target.value })} placeholder="e.g., SAP SuccessFactors" /></div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={integrationForm.type} onValueChange={(v) => setIntegrationForm({ ...integrationForm, type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent className="bg-card z-50">
                <SelectItem value="hrms">HRMS</SelectItem>
                <SelectItem value="lims">LIMS</SelectItem>
                <SelectItem value="device">Device</SelectItem>
                <SelectItem value="api">External API</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Endpoint URL</Label><Input value={integrationForm.endpoint} onChange={(e) => setIntegrationForm({ ...integrationForm, endpoint: e.target.value })} placeholder="https://api.example.com" /></div>
          <div className="space-y-2"><Label>API Key</Label><Input type="password" value={integrationForm.apiKey} onChange={(e) => setIntegrationForm({ ...integrationForm, apiKey: e.target.value })} placeholder="Enter API key" /></div>
        </div>
      </FormModal>

      {/* Add/Edit Token Modal */}
      <FormModal open={(addModalOpen || editModalOpen) && modalType === 'token'} onClose={() => { setAddModalOpen(false); setEditModalOpen(false); }} title={editModalOpen ? 'Edit Token' : 'Generate Token'} onSubmit={handleSaveToken} submitLabel={editModalOpen ? 'Save Changes' : 'Generate Token'} size="md">
        <div className="space-y-4">
          <div className="space-y-2"><Label>Token Name</Label><Input value={tokenForm.name} onChange={(e) => setTokenForm({ ...tokenForm, name: e.target.value })} placeholder="e.g., Mobile App Token" /></div>
          <div className="space-y-2"><Label>Permissions</Label><Input value={tokenForm.permissions} onChange={(e) => setTokenForm({ ...tokenForm, permissions: e.target.value })} placeholder="e.g., read:employees, write:exams" /></div>
          <div className="space-y-2"><Label>Expiration Date</Label><Input type="date" value={tokenForm.expiresAt} onChange={(e) => setTokenForm({ ...tokenForm, expiresAt: e.target.value })} /></div>
        </div>
      </FormModal>

      <ConfirmDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleConfirmDelete} title={modalType === 'integration' ? 'Remove Integration' : 'Revoke Token'} description={`Are you sure you want to ${modalType === 'integration' ? 'remove this integration' : 'revoke this token'}? This action cannot be undone.`} confirmLabel={modalType === 'integration' ? 'Remove' : 'Revoke'} variant="destructive" />
    </div>
  );
}
