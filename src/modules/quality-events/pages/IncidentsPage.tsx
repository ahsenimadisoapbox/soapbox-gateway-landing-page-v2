import React, { useState } from 'react';
import { Plus, Eye, Edit, Trash2, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../components/ui/tooltip';
import { StatusBadge, SeverityBadge } from '../components/ui/status-badge';
import { useQualityEvents } from '../contexts/QualityEventsContext';
import { formatDistanceToNow } from 'date-fns';
import CreateIncidentModal from '../components/modals/CreateIncidentModal';
import ViewIncidentModal from '../components/modals/ViewIncidentModal';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';

export default function IncidentsPage() {
  const { incidents, deleteIncident } = useQualityEvents();
  const [createOpen, setCreateOpen] = useState(false);
  const [viewId, setViewId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIncidents = incidents.filter(inc =>
    inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inc.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedIncident = viewId ? incidents.find(i => i.id === viewId) : null;
  const editIncident = editId ? incidents.find(i => i.id === editId) : null;
  const incidentToDelete = deleteId ? incidents.find(i => i.id === deleteId) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">All Incidents</h1>
          <p className="text-muted-foreground">Manage quality incidents and investigations</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Declare Incident
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">{incidents.filter(i => i.status !== 'closed').length}</p>
                <p className="text-sm text-muted-foreground">Open Incidents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <div>
                <p className="text-2xl font-bold">{incidents.filter(i => i.severity === 'critical').length}</p>
                <p className="text-sm text-muted-foreground">Critical Severity</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-info/30 bg-info/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-info" />
              <div>
                <p className="text-2xl font-bold">{incidents.filter(i => i.status === 'investigation').length}</p>
                <p className="text-sm text-muted-foreground">Under Investigation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search incidents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncidents.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell className="font-mono text-xs">{incident.id}</TableCell>
                  <TableCell className="max-w-64 truncate font-medium">{incident.title}</TableCell>
                  <TableCell>
                    <StatusBadge variant={incident.status as any} />
                  </TableCell>
                  <TableCell>
                    <SeverityBadge severity={incident.severity as any} />
                  </TableCell>
                  <TableCell className="text-sm">{incident.owner.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(incident.dueDate), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setViewId(incident.id)}
                          >
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setEditId(incident.id)}
                          >
                            <Edit className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setDeleteId(incident.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateIncidentModal open={createOpen} onOpenChange={setCreateOpen} />
      
      {selectedIncident && (
        <ViewIncidentModal
          open={!!viewId}
          onOpenChange={(open) => !open && setViewId(null)}
          incident={selectedIncident}
        />
      )}

      {editIncident && (
        <CreateIncidentModal
          open={!!editId}
          onOpenChange={(open) => !open && setEditId(null)}
          editIncident={editIncident}
        />
      )}

      <DeleteConfirmModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Incident"
        description={`Are you sure you want to delete ${incidentToDelete?.id}? This action cannot be undone.`}
        onConfirm={() => {
          if (deleteId) {
            deleteIncident(deleteId);
            setDeleteId(null);
          }
        }}
      />
    </div>
  );
}
