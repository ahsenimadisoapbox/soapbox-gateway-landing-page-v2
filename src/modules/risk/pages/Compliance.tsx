import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { CheckCircle } from 'lucide-react';

// Mock compliance data
const complianceData = [
  { id: 'REG-001', regulation: 'ISO 45001:2018', status: 'compliant', lastAudit: '2024-11-15', nextAudit: '2025-05-15', score: 95 },
  { id: 'REG-002', regulation: 'OSHA Standards', status: 'compliant', lastAudit: '2024-10-20', nextAudit: '2025-04-20', score: 92 },
  { id: 'REG-003', regulation: 'EPA Regulations', status: 'non_compliant', lastAudit: '2024-12-01', nextAudit: '2025-06-01', score: 78 },
  { id: 'REG-004', regulation: 'ISO 14001:2015', status: 'compliant', lastAudit: '2024-09-10', nextAudit: '2025-03-10', score: 88 },
  { id: 'REG-005', regulation: 'Local Safety Code', status: 'under_review', lastAudit: '2024-12-15', nextAudit: '2025-06-15', score: 85 },
];

export default function Compliance() {
  const getStatusColor = (status: string) => {
    const colors = {
      compliant: 'bg-success text-success-foreground',
      non_compliant: 'bg-destructive text-destructive-foreground',
      under_review: 'bg-warning text-warning-foreground',
    };
    return colors[status as keyof typeof colors] || 'bg-muted';
  };

  const compliantCount = complianceData.filter(c => c.status === 'compliant').length;
  const complianceRate = Math.round((compliantCount / complianceData.length) * 100);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Compliance Status</h1>
        <p className="text-muted-foreground mt-2">Track regulatory compliance and audit results</p>
      </div>

      {/* Compliance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Regulations</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceData.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active compliance requirements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{complianceRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">{compliantCount} of {complianceData.length} compliant</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(complianceData.reduce((acc, c) => acc + c.score, 0) / complianceData.length)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across all audits</p>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Regulatory Compliance Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Regulation ID</TableHead>
                <TableHead>Regulation Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Audit</TableHead>
                <TableHead>Next Audit</TableHead>
                <TableHead>Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complianceData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-sm">{item.id}</TableCell>
                  <TableCell className="font-medium">{item.regulation}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(item.lastAudit).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(item.nextAudit).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span className={`font-semibold ${item.score >= 90 ? 'text-success' : item.score >= 80 ? 'text-primary' : 'text-destructive'}`}>
                      {item.score}%
                    </span>
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
