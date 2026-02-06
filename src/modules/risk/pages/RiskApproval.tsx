import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { CheckSquare, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { toast } from '../hooks/use-toast';

export default function RiskApproval() {
  const handleApprove = (item: string) => {
    toast({
      title: "Approved",
      description: `"${item}" has been approved successfully`,
    });
  };

  const handleReject = (item: string) => {
    toast({
      title: "Rejected",
      description: `"${item}" has been rejected`,
      variant: "destructive",
    });
  };

  const pendingApprovals = [
    {
      id: 1,
      title: 'Hot Work Permit - Welding in Building C',
      type: 'Work Permit',
      submittedBy: 'John Smith',
      submittedDate: '2024-01-10',
      riskLevel: 'High',
      currentApprover: 'EHS Manager',
      approvalChain: ['Site Supervisor ✓', 'EHS Manager (pending)', 'Operations Director'],
    },
    {
      id: 2,
      title: 'New Chemical Storage Procedure',
      type: 'Procedure Change',
      submittedBy: 'Sarah Johnson',
      submittedDate: '2024-01-09',
      riskLevel: 'Medium',
      currentApprover: 'EHS Manager',
      approvalChain: ['Department Head ✓', 'EHS Manager (pending)'],
    },
    {
      id: 3,
      title: 'Confined Space Entry - Tank Cleaning',
      type: 'Work Permit',
      submittedBy: 'Mike Davis',
      submittedDate: '2024-01-08',
      riskLevel: 'Critical',
      currentApprover: 'Operations Director',
      approvalChain: ['Site Supervisor ✓', 'EHS Manager ✓', 'Operations Director (pending)', 'VP Operations'],
    },
  ];

  const recentDecisions = [
    {
      id: 4,
      title: 'Equipment Maintenance Schedule Update',
      type: 'Procedure Change',
      decision: 'Approved',
      decidedBy: 'EHS Manager',
      decidedDate: '2024-01-09',
    },
    {
      id: 5,
      title: 'Height Work Without Full Harness',
      type: 'Work Permit',
      decision: 'Rejected',
      decidedBy: 'EHS Manager',
      decidedDate: '2024-01-08',
    },
  ];

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'Critical':
        return <Badge variant="destructive">{level}</Badge>;
      case 'High':
        return <Badge className="bg-orange-500">{level}</Badge>;
      case 'Medium':
        return <Badge className="bg-yellow-500">{level}</Badge>;
      default:
        return <Badge variant="secondary">{level}</Badge>;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CheckSquare className="h-8 w-8" />
          Risk Approval Workflow
        </h1>
        <p className="text-muted-foreground mt-2">
          Multi-level approval system for high-risk activities and mitigation plans
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Awaiting your review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Critical Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">1</div>
            <p className="text-xs text-muted-foreground">Require urgent attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Approved Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">1</div>
            <p className="text-xs text-muted-foreground">Successfully approved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Rejected Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">1</div>
            <p className="text-xs text-muted-foreground">Did not meet criteria</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Pending Your Approval</h2>
        <div className="grid gap-4">
          {pendingApprovals.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle>{item.title}</CardTitle>
                      {getRiskBadge(item.riskLevel)}
                    </div>
                    <CardDescription>
                      {item.type} • Submitted by {item.submittedBy} on {item.submittedDate}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Approval Chain:</p>
                  <div className="flex flex-wrap gap-2">
                    {item.approvalChain.map((step, index) => (
                      <Badge
                        key={index}
                        variant={step.includes('✓') ? 'default' : step.includes('pending') ? 'secondary' : 'outline'}
                      >
                        {step}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="outline">Current: {item.currentApprover}</Badge>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button onClick={() => handleApprove(item.title)}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleReject(item.title)}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button variant="outline">View Details</Button>
                  <Button variant="outline">Request More Info</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Decisions */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Decisions</h2>
        <div className="grid gap-4">
          {recentDecisions.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{item.title}</CardTitle>
                    <CardDescription>
                      {item.type} • Decided by {item.decidedBy} on {item.decidedDate}
                    </CardDescription>
                  </div>
                  <Badge variant={item.decision === 'Approved' ? 'default' : 'destructive'}>
                    {item.decision === 'Approved' ? (
                      <CheckCircle className="mr-1 h-3 w-3" />
                    ) : (
                      <XCircle className="mr-1 h-3 w-3" />
                    )}
                    {item.decision}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Info Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>About Risk Approval Workflow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            The Risk Approval Workflow ensures that high-risk activities or mitigation plans are reviewed 
            and formally approved by appropriate management levels before proceeding.
          </p>
          <div>
            <h4 className="font-semibold mb-2 text-sm">Key Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Multi-level approval chains based on risk severity</li>
              <li>Automated routing to next approver</li>
              <li>Complete audit trail of all decisions</li>
              <li>Email notifications at each approval stage</li>
              <li>Ability to request additional information</li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">
            This provides accountability, ensures compliance with safety protocols, and creates a 
            documented record for regulatory audits.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
