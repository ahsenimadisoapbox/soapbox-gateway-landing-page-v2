import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  AlertTriangle,
  Clock,
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
  ArrowRight,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import KPICard from '../components/ui/kpi-card';
import { StatusBadge, PriorityBadge, RiskScore } from '../components/ui/status-badge';
import { useQualityEvents } from '../contexts/QualityEventsContext';
import { dashboardStats } from '../data/mockData';
import { formatDistanceToNow } from 'date-fns';
import CreateEventModal from '../components/modals/CreateEventModal';
import ViewEventModal from '../components/modals/ViewEventModal';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';

export default function Dashboard() {
  const navigate = useNavigate();
  const { qualityEvents, incidents, deleteQualityEvent } = useQualityEvents();
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [viewEventId, setViewEventId] = useState<string | null>(null);
  const [editEventId, setEditEventId] = useState<string | null>(null);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);

  const recentEvents = [...qualityEvents]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const selectedEvent = viewEventId ? qualityEvents.find(e => e.id === viewEventId) : null;
  const eventToDelete = deleteEventId ? qualityEvents.find(e => e.id === deleteEventId) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quality Events Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor quality signals, incidents, and SLA performance
          </p>
        </div>
        <Button onClick={() => setCreateEventOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Event
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Open Events"
          value={dashboardStats.openEvents}
          subtitle="Awaiting triage or action"
          trend="down"
          trendValue="12% from last week"
          icon={<FileText className="h-5 w-5" />}
          variant="info"
          onClick={() => navigate('/events')}
        />
        <KPICard
          title="Critical Events"
          value={dashboardStats.criticalEvents}
          subtitle="Requires immediate attention"
          trend="neutral"
          trendValue="No change"
          icon={<AlertTriangle className="h-5 w-5" />}
          variant="destructive"
          onClick={() => navigate('/events?priority=critical')}
        />
        <KPICard
          title="Open Incidents"
          value={dashboardStats.openIncidents}
          subtitle="Active investigations"
          trend="up"
          trendValue="1 new this week"
          icon={<XCircle className="h-5 w-5" />}
          variant="warning"
          onClick={() => navigate('/incidents')}
        />
        <KPICard
          title="SLA Breaches"
          value={dashboardStats.slaBreaches}
          subtitle="Past due date"
          trend="down"
          trendValue="Improved from 3"
          icon={<Clock className="h-5 w-5" />}
          variant="destructive"
          onClick={() => navigate('/analytics/events')}
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Pending Approvals"
          value={dashboardStats.pendingApprovals}
          icon={<Users className="h-5 w-5" />}
          onClick={() => navigate('/qa-review')}
        />
        <KPICard
          title="Completed This Month"
          value={dashboardStats.completedThisMonth}
          icon={<CheckCircle className="h-5 w-5" />}
          variant="success"
        />
        <KPICard
          title="Avg Resolution Time"
          value={`${dashboardStats.avgResolutionTime} days`}
          trend="down"
          trendValue="0.5 days faster"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Recent Events & Active Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Quality Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Recent Quality Events</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/events')} className="gap-1">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-mono text-xs">{event.id}</TableCell>
                    <TableCell className="max-w-48 truncate">{event.title}</TableCell>
                    <TableCell>
                      <StatusBadge variant={event.status as any} />
                    </TableCell>
                    <TableCell>
                      <PriorityBadge priority={event.priority as any} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setViewEventId(event.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setEditEventId(event.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteEventId(event.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Active Incidents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Active Incidents</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/incidents')} className="gap-1">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {incidents.filter(i => i.status !== 'closed').map((incident) => (
                <div
                  key={incident.id}
                  className="p-4 rounded-lg border border-border hover:border-primary/30 cursor-pointer transition-colors"
                  onClick={() => navigate(`/incidents/${incident.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">
                          {incident.id}
                        </span>
                        <StatusBadge variant={incident.status as any} />
                      </div>
                      <h4 className="font-medium">{incident.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {incident.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Owner: {incident.owner.name}</span>
                      <span>Due: {formatDistanceToNow(new Date(incident.dueDate), { addSuffix: true })}</span>
                    </div>
                    <PriorityBadge priority={incident.severity === 'critical' ? 'critical' : incident.severity === 'major' ? 'high' : 'medium'} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <CreateEventModal open={createEventOpen} onOpenChange={setCreateEventOpen} />
      
      {selectedEvent && (
        <ViewEventModal
          open={!!viewEventId}
          onOpenChange={(open) => !open && setViewEventId(null)}
          event={selectedEvent}
        />
      )}

      {selectedEvent && editEventId && (
        <CreateEventModal
          open={!!editEventId}
          onOpenChange={(open) => !open && setEditEventId(null)}
          editEvent={selectedEvent}
        />
      )}

      <DeleteConfirmModal
        open={!!deleteEventId}
        onOpenChange={(open) => !open && setDeleteEventId(null)}
        title="Delete Quality Event"
        description={`Are you sure you want to delete ${eventToDelete?.id}? This action cannot be undone.`}
        onConfirm={() => {
          if (deleteEventId) {
            deleteQualityEvent(deleteEventId);
            setDeleteEventId(null);
          }
        }}
      />
    </div>
  );
}
