import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { FormModal } from '../components/common/FormModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { StatusBadge } from '../components/common/StatusBadge';
import { ActionButtons } from '../components/common/ActionButtons';
import { toast } from '../hooks/use-toast';
import { Bell, Plus, Search, Mail, MessageSquare, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'in-app';
  subject: string;
  trigger: string;
  status: 'active' | 'inactive';
}

interface NotificationRule {
  id: string;
  name: string;
  event: string;
  recipients: string;
  template: string;
  status: 'active' | 'inactive';
}

interface NotificationLog {
  id: string;
  type: 'email' | 'sms' | 'in-app';
  recipient: string;
  subject: string;
  status: 'sent' | 'failed' | 'pending';
  sentAt: string;
}

const mockTemplates: NotificationTemplate[] = [
  { id: '1', name: 'PME Due Reminder', type: 'email', subject: 'Your Medical Exam is Due', trigger: 'PME Due Date', status: 'active' },
  { id: '2', name: 'Critical Alert', type: 'sms', subject: 'Critical Health Alert', trigger: 'Critical Finding', status: 'active' },
  { id: '3', name: 'Wellness Enrollment', type: 'in-app', subject: 'Wellness Program Available', trigger: 'Program Launch', status: 'active' },
  { id: '4', name: 'RTW Notification', type: 'email', subject: 'Return to Work Plan', trigger: 'RTW Plan Created', status: 'inactive' },
];

const mockRules: NotificationRule[] = [
  { id: '1', name: 'PME Overdue Alert', event: 'PME Overdue 7 Days', recipients: 'Employee, Supervisor', template: 'PME Due Reminder', status: 'active' },
  { id: '2', name: 'Exposure Threshold', event: 'Exposure > 80%', recipients: 'HSE Manager', template: 'Critical Alert', status: 'active' },
  { id: '3', name: 'Illness Case Created', event: 'New Illness Case', recipients: 'OH Doctor, HR', template: 'Critical Alert', status: 'active' },
];

const mockLogs: NotificationLog[] = [
  { id: '1', type: 'email', recipient: 'john.smith@company.com', subject: 'Your Medical Exam is Due', status: 'sent', sentAt: '2024-01-15 09:30' },
  { id: '2', type: 'sms', recipient: '+1234567890', subject: 'Critical Health Alert', status: 'sent', sentAt: '2024-01-15 08:15' },
  { id: '3', type: 'email', recipient: 'jane.doe@company.com', subject: 'Return to Work Plan', status: 'failed', sentAt: '2024-01-14 14:00' },
  { id: '4', type: 'in-app', recipient: 'mike.johnson', subject: 'Wellness Program Available', status: 'pending', sentAt: '2024-01-14 10:00' },
];

export default function Notifications() {
  const [activeTab, setActiveTab] = useState('templates');
  const [searchTerm, setSearchTerm] = useState('');
  const [templates, setTemplates] = useState(mockTemplates);
  const [rules, setRules] = useState(mockRules);
  const [logs] = useState(mockLogs);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalType, setModalType] = useState<'template' | 'rule'>('template');

  const [templateForm, setTemplateForm] = useState({ name: '', type: 'email', subject: '', trigger: '', body: '' });
  const [ruleForm, setRuleForm] = useState({ name: '', event: '', recipients: '', template: '' });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default: return <Clock className="h-4 w-4 text-warning" />;
    }
  };

  const handleAddTemplate = () => {
    setModalType('template');
    setTemplateForm({ name: '', type: 'email', subject: '', trigger: '', body: '' });
    setAddModalOpen(true);
  };

  const handleAddRule = () => {
    setModalType('rule');
    setRuleForm({ name: '', event: '', recipients: '', template: '' });
    setAddModalOpen(true);
  };

  const handleView = (item: any, type: 'template' | 'rule') => {
    setSelectedItem(item);
    setModalType(type);
    setViewModalOpen(true);
  };

  const handleEdit = (item: any, type: 'template' | 'rule') => {
    setSelectedItem(item);
    setModalType(type);
    if (type === 'template') {
      setTemplateForm({ name: item.name, type: item.type, subject: item.subject, trigger: item.trigger, body: '' });
    } else {
      setRuleForm({ name: item.name, event: item.event, recipients: item.recipients, template: item.template });
    }
    setEditModalOpen(true);
  };

  const handleDelete = (item: any, type: 'template' | 'rule') => {
    setSelectedItem(item);
    setModalType(type);
    setDeleteDialogOpen(true);
  };

  const handleSaveTemplate = () => {
    if (editModalOpen && selectedItem) {
      setTemplates(templates.map(t => t.id === selectedItem.id ? { ...t, ...templateForm } as NotificationTemplate : t));
      toast({ title: 'Template Updated', description: 'Notification template has been updated.' });
    } else {
      const newTemplate: NotificationTemplate = { id: Date.now().toString(), ...templateForm, status: 'active' } as NotificationTemplate;
      setTemplates([...templates, newTemplate]);
      toast({ title: 'Template Created', description: 'New notification template has been created.' });
    }
    setAddModalOpen(false);
    setEditModalOpen(false);
  };

  const handleSaveRule = () => {
    if (editModalOpen && selectedItem) {
      setRules(rules.map(r => r.id === selectedItem.id ? { ...r, ...ruleForm } as NotificationRule : r));
      toast({ title: 'Rule Updated', description: 'Notification rule has been updated.' });
    } else {
      const newRule: NotificationRule = { id: Date.now().toString(), ...ruleForm, status: 'active' } as NotificationRule;
      setRules([...rules, newRule]);
      toast({ title: 'Rule Created', description: 'New notification rule has been created.' });
    }
    setAddModalOpen(false);
    setEditModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (modalType === 'template') {
      setTemplates(templates.filter(t => t.id !== selectedItem.id));
      toast({ title: 'Template Deleted', description: 'Notification template has been deleted.', variant: 'destructive' });
    } else {
      setRules(rules.filter(r => r.id !== selectedItem.id));
      toast({ title: 'Rule Deleted', description: 'Notification rule has been deleted.', variant: 'destructive' });
    }
  };

  const toggleStatus = (id: string, type: 'template' | 'rule') => {
    if (type === 'template') {
      setTemplates(templates.map(t => t.id === id ? { ...t, status: t.status === 'active' ? 'inactive' : 'active' } : t));
    } else {
      setRules(rules.map(r => r.id === id ? { ...r, status: r.status === 'active' ? 'inactive' : 'active' } : r));
    }
    toast({ title: 'Status Updated', description: 'Notification status has been updated.' });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Bell className="h-7 w-7 text-primary" />Notifications</h1>
          <p className="page-subtitle">Manage notification templates, rules, and delivery logs</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Active Templates', value: templates.filter(t => t.status === 'active').length, color: 'text-primary' },
          { label: 'Active Rules', value: rules.filter(r => r.status === 'active').length, color: 'text-info' },
          { label: 'Sent Today', value: logs.filter(l => l.status === 'sent').length, color: 'text-success' },
          { label: 'Failed', value: logs.filter(l => l.status === 'failed').length, color: 'text-destructive' },
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
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="rules">Rules & Triggers</TabsTrigger>
          <TabsTrigger value="logs">Delivery Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Notification Templates</CardTitle>
              <Button onClick={handleAddTemplate}><Plus className="h-4 w-4 mr-2" />Add Template</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Trigger</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(template.type)}
                          <span className="capitalize">{template.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>{template.subject}</TableCell>
                      <TableCell>{template.trigger}</TableCell>
                      <TableCell>
                        <Switch checked={template.status === 'active'} onCheckedChange={() => toggleStatus(template.id, 'template')} />
                      </TableCell>
                      <TableCell className="text-right">
                        <ActionButtons onView={() => handleView(template, 'template')} onEdit={() => handleEdit(template, 'template')} onDelete={() => handleDelete(template, 'template')} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Notification Rules</CardTitle>
              <Button onClick={handleAddRule}><Plus className="h-4 w-4 mr-2" />Add Rule</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule Name</TableHead>
                    <TableHead>Event Trigger</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>{rule.event}</TableCell>
                      <TableCell>{rule.recipients}</TableCell>
                      <TableCell>{rule.template}</TableCell>
                      <TableCell>
                        <Switch checked={rule.status === 'active'} onCheckedChange={() => toggleStatus(rule.id, 'rule')} />
                      </TableCell>
                      <TableCell className="text-right">
                        <ActionButtons onView={() => handleView(rule, 'rule')} onEdit={() => handleEdit(rule, 'rule')} onDelete={() => handleDelete(rule, 'rule')} />
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
            <CardHeader>
              <CardTitle>Delivery Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search logs..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.filter(l => l.recipient.includes(searchTerm) || l.subject.includes(searchTerm)).map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(log.type)}
                          <span className="capitalize">{log.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>{log.recipient}</TableCell>
                      <TableCell>{log.subject}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(log.status)}
                          <StatusBadge variant={log.status === 'sent' ? 'success' : log.status === 'failed' ? 'error' : 'warning'}>
                            {log.status}
                          </StatusBadge>
                        </div>
                      </TableCell>
                      <TableCell>{log.sentAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Modal */}
      <FormModal open={viewModalOpen} onClose={() => setViewModalOpen(false)} title={modalType === 'template' ? 'Template Details' : 'Rule Details'} size="md">
        {selectedItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-muted-foreground">Name</Label><p className="font-medium">{selectedItem.name}</p></div>
              {modalType === 'template' ? (
                <>
                  <div><Label className="text-muted-foreground">Type</Label><p className="font-medium capitalize">{selectedItem.type}</p></div>
                  <div><Label className="text-muted-foreground">Subject</Label><p className="font-medium">{selectedItem.subject}</p></div>
                  <div><Label className="text-muted-foreground">Trigger</Label><p className="font-medium">{selectedItem.trigger}</p></div>
                </>
              ) : (
                <>
                  <div><Label className="text-muted-foreground">Event</Label><p className="font-medium">{selectedItem.event}</p></div>
                  <div><Label className="text-muted-foreground">Recipients</Label><p className="font-medium">{selectedItem.recipients}</p></div>
                  <div><Label className="text-muted-foreground">Template</Label><p className="font-medium">{selectedItem.template}</p></div>
                </>
              )}
              <div><Label className="text-muted-foreground">Status</Label><StatusBadge variant={selectedItem.status === 'active' ? 'success' : 'muted'}>{selectedItem.status}</StatusBadge></div>
            </div>
          </div>
        )}
      </FormModal>

      {/* Add/Edit Template Modal */}
      <FormModal open={(addModalOpen || editModalOpen) && modalType === 'template'} onClose={() => { setAddModalOpen(false); setEditModalOpen(false); }} title={editModalOpen ? 'Edit Template' : 'Add Template'} onSubmit={handleSaveTemplate} submitLabel={editModalOpen ? 'Save Changes' : 'Create Template'} size="md">
        <div className="space-y-4">
          <div className="space-y-2"><Label>Template Name</Label><Input value={templateForm.name} onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })} placeholder="Enter template name" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={templateForm.type} onValueChange={(v) => setTemplateForm({ ...templateForm, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card z-50">
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="in-app">In-App</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Trigger Event</Label><Input value={templateForm.trigger} onChange={(e) => setTemplateForm({ ...templateForm, trigger: e.target.value })} placeholder="e.g., PME Due Date" /></div>
          </div>
          <div className="space-y-2"><Label>Subject</Label><Input value={templateForm.subject} onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })} placeholder="Notification subject" /></div>
          <div className="space-y-2"><Label>Body</Label><Textarea value={templateForm.body} onChange={(e) => setTemplateForm({ ...templateForm, body: e.target.value })} placeholder="Notification body content..." rows={4} /></div>
        </div>
      </FormModal>

      {/* Add/Edit Rule Modal */}
      <FormModal open={(addModalOpen || editModalOpen) && modalType === 'rule'} onClose={() => { setAddModalOpen(false); setEditModalOpen(false); }} title={editModalOpen ? 'Edit Rule' : 'Add Rule'} onSubmit={handleSaveRule} submitLabel={editModalOpen ? 'Save Changes' : 'Create Rule'} size="md">
        <div className="space-y-4">
          <div className="space-y-2"><Label>Rule Name</Label><Input value={ruleForm.name} onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })} placeholder="Enter rule name" /></div>
          <div className="space-y-2"><Label>Event Trigger</Label><Input value={ruleForm.event} onChange={(e) => setRuleForm({ ...ruleForm, event: e.target.value })} placeholder="e.g., PME Overdue 7 Days" /></div>
          <div className="space-y-2"><Label>Recipients</Label><Input value={ruleForm.recipients} onChange={(e) => setRuleForm({ ...ruleForm, recipients: e.target.value })} placeholder="e.g., Employee, Supervisor" /></div>
          <div className="space-y-2">
            <Label>Template</Label>
            <Select value={ruleForm.template} onValueChange={(v) => setRuleForm({ ...ruleForm, template: v })}>
              <SelectTrigger><SelectValue placeholder="Select template" /></SelectTrigger>
              <SelectContent className="bg-card z-50">
                {templates.map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormModal>

      <ConfirmDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleConfirmDelete} title={`Delete ${modalType === 'template' ? 'Template' : 'Rule'}`} description={`Are you sure you want to delete this ${modalType}? This action cannot be undone.`} confirmLabel="Delete" variant="destructive" />
    </div>
  );
}
