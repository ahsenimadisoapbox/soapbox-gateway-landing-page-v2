import React, { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Info, 
  Filter,
  Search,
  MailOpen,
  Mail,
  Trash2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { cn } from '../lib/utils';
import { useValidation } from '../context/ValidationContext';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  type: 'approval' | 'escalation' | 'info' | 'warning' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  link?: string;
}

interface Escalation {
  id: string;
  title: string;
  description: string;
  level: 1 | 2 | 3;
  status: 'active' | 'acknowledged' | 'resolved';
  originalDueDate: string;
  escalatedAt: string;
  assignedTo: string;
  projectId: string;
  projectName: string;
}

const mockNotifications: Notification[] = [
  {
    id: 'NOT-001',
    type: 'approval',
    title: 'Approval Required: Validation Protocol VP-2024-001',
    message: 'Sarah Johnson has submitted VP-2024-001 for your approval. This protocol requires QA sign-off before test execution can begin.',
    timestamp: '2024-01-17T09:30:00Z',
    read: false,
    priority: 'critical',
    source: 'VAL-2024-001',
    link: '/projects/VAL-2024-001',
  },
  {
    id: 'NOT-002',
    type: 'escalation',
    title: 'Escalation: Overdue Test Execution',
    message: 'Test execution for TC-045 is 3 days overdue. This has been escalated to Level 2.',
    timestamp: '2024-01-17T08:00:00Z',
    read: false,
    priority: 'high',
    source: 'VAL-2024-002',
    link: '/projects/VAL-2024-002',
  },
  {
    id: 'NOT-003',
    type: 'warning',
    title: 'Deviation Requires Attention',
    message: 'DEV-001 root cause analysis is pending. CAPA may be required based on impact assessment.',
    timestamp: '2024-01-16T14:20:00Z',
    read: true,
    priority: 'high',
    source: 'VAL-2024-001',
    link: '/deviations/DEV-001',
  },
  {
    id: 'NOT-004',
    type: 'success',
    title: 'Validation Complete: MES Integration Phase 1',
    message: 'VAL-2024-003 Phase 1 has been successfully validated and released.',
    timestamp: '2024-01-16T10:00:00Z',
    read: true,
    priority: 'low',
    source: 'VAL-2024-003',
    link: '/projects/VAL-2024-003',
  },
  {
    id: 'NOT-005',
    type: 'info',
    title: 'Scheduled Periodic Review',
    message: 'Periodic validation review for ERP System is scheduled for next week.',
    timestamp: '2024-01-15T16:00:00Z',
    read: true,
    priority: 'medium',
    source: 'System',
  },
];

const mockEscalations: Escalation[] = [
  {
    id: 'ESC-001',
    title: 'Overdue Test Execution - TC-045',
    description: 'Test case TC-045 was due 3 days ago. Test executor has not responded to reminders.',
    level: 2,
    status: 'active',
    originalDueDate: '2024-01-14',
    escalatedAt: '2024-01-17T08:00:00Z',
    assignedTo: 'Mike Chen',
    projectId: 'VAL-2024-002',
    projectName: 'LIMS Migration',
  },
  {
    id: 'ESC-002',
    title: 'Pending CAPA Closure - CAPA-001',
    description: 'CAPA effectiveness verification is overdue by 5 days.',
    level: 1,
    status: 'acknowledged',
    originalDueDate: '2024-01-12',
    escalatedAt: '2024-01-16T10:00:00Z',
    assignedTo: 'Emily Davis',
    projectId: 'VAL-2024-001',
    projectName: 'ERP System Validation',
  },
];

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [escalations, setEscalations] = useState<Escalation[]>(mockEscalations);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'approval': return <Clock size={16} className="text-accent" />;
      case 'escalation': return <AlertTriangle size={16} className="text-status-required" />;
      case 'warning': return <AlertTriangle size={16} className="text-status-conditional" />;
      case 'success': return <CheckCircle2 size={16} className="text-status-validated" />;
      case 'info': return <Info size={16} className="text-muted-foreground" />;
    }
  };

  const getPriorityBadge = (priority: Notification['priority']) => {
    const styles = {
      critical: 'bg-status-required/10 text-status-required',
      high: 'bg-status-conditional/10 text-status-conditional',
      medium: 'bg-step-current/10 text-step-current',
      low: 'bg-muted text-muted-foreground',
    };
    return <Badge variant="outline" className={styles[priority]}>{priority}</Badge>;
  };

  const getEscalationLevelBadge = (level: Escalation['level']) => {
    const styles = {
      1: 'bg-status-conditional/10 text-status-conditional border-status-conditional/20',
      2: 'bg-status-required/10 text-status-required border-status-required/20',
      3: 'bg-red-900/20 text-red-400 border-red-500/20',
    };
    return <Badge variant="outline" className={styles[level]}>Level {level}</Badge>;
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || n.type === filterType;
    return matchesSearch && matchesType;
  });

  const unreadNotifications = filteredNotifications.filter(n => !n.read);
  const readNotifications = filteredNotifications.filter(n => n.read);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const acknowledgeEscalation = (id: string) => {
    setEscalations(prev => prev.map(e => 
      e.id === id ? { ...e, status: 'acknowledged' } : e
    ));
  };

  const stats = [
    { label: 'Unread', value: notifications.filter(n => !n.read).length, icon: Mail, color: 'text-accent' },
    { label: 'Critical', value: notifications.filter(n => n.priority === 'critical').length, icon: AlertTriangle, color: 'text-status-required' },
    { label: 'Active Escalations', value: escalations.filter(e => e.status === 'active').length, icon: AlertTriangle, color: 'text-status-conditional' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications & Escalations</h1>
          <p className="text-muted-foreground">
            Stay updated on validation activities and manage escalations
          </p>
        </div>
        <Button variant="outline" onClick={markAllAsRead}>
          <MailOpen size={16} className="mr-2" />
          Mark All as Read
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="enterprise-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <stat.icon size={24} className={stat.color} />
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="enterprise-card">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[150px]">
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="approval">Approvals</SelectItem>
                <SelectItem value="escalation">Escalations</SelectItem>
                <SelectItem value="warning">Warnings</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell size={14} />
            Notifications ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="escalations" className="gap-2">
            <AlertTriangle size={14} />
            Escalations ({escalations.filter(e => e.status !== 'resolved').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <Card className="enterprise-card">
            <CardHeader>
              <CardTitle className="text-lg">
                Unread ({unreadNotifications.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {unreadNotifications.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No unread notifications</p>
              ) : (
                unreadNotifications.map(notification => (
                  <div 
                    key={notification.id}
                    className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors bg-accent/5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        {getTypeIcon(notification.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getPriorityBadge(notification.priority)}
                            <span className="text-xs text-muted-foreground">
                              {new Date(notification.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <h4 className="font-medium">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          className="action-icon"
                          title="Mark as Read"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <MailOpen size={16} className="text-muted-foreground" />
                        </button>
                        {notification.link && (
                          <button
                            className="action-icon"
                            title="Go to Source"
                            onClick={() => navigate(notification.link!)}
                          >
                            <ExternalLink size={16} className="text-muted-foreground" />
                          </button>
                        )}
                        <button
                          className="action-icon"
                          title="Delete"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 size={16} className="text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>

            {readNotifications.length > 0 && (
              <>
                <CardHeader className="border-t border-border">
                  <CardTitle className="text-lg">
                    Read ({readNotifications.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {readNotifications.map(notification => (
                    <div 
                      key={notification.id}
                      className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors opacity-70"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          {getTypeIcon(notification.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {getPriorityBadge(notification.priority)}
                              <span className="text-xs text-muted-foreground">
                                {new Date(notification.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <h4 className="font-medium">{notification.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {notification.link && (
                            <button
                              className="action-icon"
                              title="Go to Source"
                              onClick={() => navigate(notification.link!)}
                            >
                              <ExternalLink size={16} className="text-muted-foreground" />
                            </button>
                          )}
                          <button
                            className="action-icon"
                            title="Delete"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 size={16} className="text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="escalations">
          <Card className="enterprise-card">
            <CardHeader>
              <CardTitle className="text-lg">Active Escalations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {escalations.filter(e => e.status !== 'resolved').length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No active escalations</p>
              ) : (
                escalations.filter(e => e.status !== 'resolved').map(escalation => (
                  <div 
                    key={escalation.id}
                    className="p-4 border border-status-required/30 rounded-lg bg-status-required/5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-mono text-muted-foreground">{escalation.id}</span>
                          {getEscalationLevelBadge(escalation.level)}
                          <Badge variant="outline" className={cn(
                            escalation.status === 'active' && 'bg-status-required/10 text-status-required',
                            escalation.status === 'acknowledged' && 'bg-status-conditional/10 text-status-conditional',
                          )}>
                            {escalation.status}
                          </Badge>
                        </div>
                        <h4 className="font-medium">{escalation.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{escalation.description}</p>
                        <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                          <span>Project: {escalation.projectName}</span>
                          <span>Assigned: {escalation.assignedTo}</span>
                          <span>Original Due: {new Date(escalation.originalDueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {escalation.status === 'active' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => acknowledgeEscalation(escalation.id)}
                          >
                            Acknowledge
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/projects/${escalation.projectId}`)}
                        >
                          View Project
                          <ChevronRight size={14} className="ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsPage;
