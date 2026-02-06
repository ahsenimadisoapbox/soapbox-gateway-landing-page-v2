import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { ClipboardCheck } from 'lucide-react';

// Mock assessment data
const mockAssessments = [
  { id: 'ASS-001', area: 'Safety Protocols', status: 'completed', dueDate: '2025-01-15', assessor: 'John Smith', score: 85 },
  { id: 'ASS-002', area: 'Environmental Impact', status: 'in_progress', dueDate: '2025-02-20', assessor: 'Sarah Johnson', score: null },
  { id: 'ASS-003', area: 'Operational Efficiency', status: 'pending', dueDate: '2025-03-10', assessor: 'Mike Wilson', score: null },
  { id: 'ASS-004', area: 'Financial Controls', status: 'completed', dueDate: '2025-01-05', assessor: 'Emily Davis', score: 92 },
  { id: 'ASS-005', area: 'Regulatory Compliance', status: 'in_progress', dueDate: '2025-02-28', assessor: 'John Smith', score: null },
];

export default function Assessments() {
  const [showData] = useState(true);

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-success text-success-foreground',
      in_progress: 'bg-warning text-warning-foreground',
      pending: 'bg-muted text-muted-foreground',
    };
    return colors[status as keyof typeof colors] || 'bg-muted';
  };

  if (!showData || mockAssessments.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <ClipboardCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">No assessments as of now</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
        <p className="text-muted-foreground mt-2">Track and manage risk assessments across all areas</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assessment ID</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Assessor</TableHead>
                <TableHead>Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAssessments.map((assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell className="font-mono text-sm">{assessment.id}</TableCell>
                  <TableCell className="font-medium">{assessment.area}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(assessment.status)}>
                      {assessment.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(assessment.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>{assessment.assessor}</TableCell>
                  <TableCell>
                    {assessment.score ? (
                      <span className="font-semibold">{assessment.score}%</span>
                    ) : (
                      <span className="text-muted-foreground">Pending</span>
                    )}
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
