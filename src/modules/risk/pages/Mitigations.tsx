import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Target, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

// Mock mitigation data
const mockMitigations = [
  { id: 'MIT-001', action: 'Install safety barriers', owner: 'John Smith', deadline: '2025-02-15', cost: 5000, status: 'in_progress', complete: 65 },
  { id: 'MIT-002', action: 'Update emergency procedures', owner: 'Sarah Johnson', deadline: '2025-01-30', cost: 2000, status: 'completed', complete: 100 },
  { id: 'MIT-003', action: 'Conduct staff training', owner: 'Mike Wilson', deadline: '2025-03-10', cost: 3500, status: 'not_started', complete: 0 },
  { id: 'MIT-004', action: 'Replace equipment', owner: 'Emily Davis', deadline: '2025-02-28', cost: 12000, status: 'in_progress', complete: 40 },
  { id: 'MIT-005', action: 'Implement monitoring system', owner: 'John Smith', deadline: '2025-04-15', cost: 8000, status: 'in_progress', complete: 25 },
];

export default function Mitigations() {
  const [showData] = useState(true);

  const totalActions = mockMitigations.length;
  const completedActions = mockMitigations.filter(m => m.status === 'completed').length;
  const overdueActions = mockMitigations.filter(m => new Date(m.deadline) < new Date() && m.status !== 'completed').length;

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-success text-success-foreground',
      in_progress: 'bg-warning text-warning-foreground',
      not_started: 'bg-muted text-muted-foreground',
    };
    return colors[status as keyof typeof colors] || 'bg-muted';
  };

  if (!showData || mockMitigations.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">No mitigation plan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mitigations</h1>
        <p className="text-muted-foreground mt-2">Monitor and track mitigation actions across all risks</p>
      </div>

      {/* Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActions}</div>
            <p className="text-xs text-muted-foreground mt-1">Active mitigation actions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedActions}</div>
            <p className="text-xs text-muted-foreground mt-1">{Math.round((completedActions / totalActions) * 100)}% completion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{overdueActions}</div>
            <p className="text-xs text-muted-foreground mt-1">Require immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Mitigation Actions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Mitigation Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action ID</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMitigations.map((mitigation) => (
                <TableRow key={mitigation.id}>
                  <TableCell className="font-mono text-sm">{mitigation.id}</TableCell>
                  <TableCell className="font-medium">{mitigation.action}</TableCell>
                  <TableCell>{mitigation.owner}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className={`text-sm ${
                        new Date(mitigation.deadline) < new Date() && mitigation.status !== 'completed'
                          ? 'text-destructive font-medium'
                          : ''
                      }`}>
                        {new Date(mitigation.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>${mitigation.cost.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(mitigation.status)}>
                      {mitigation.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={mitigation.complete} className="w-20" />
                      <span className="text-xs text-muted-foreground">{mitigation.complete}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
