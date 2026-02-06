import { useState, useEffect } from 'react';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, MapPin, AlertTriangle, MessageSquare, FileText, Calendar, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { getRiskById } from '../lib/storage';
import { mockUsers, mockSites, getRoleDisplayName } from '../lib/mockData';
import { Risk, User as RiskUser } from '../types/risk';

interface OutletContext {
  currentUser: RiskUser;
}

export default function RiskDetail() {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useOutletContext<OutletContext>();
  const [risk, setRisk] = useState<Risk | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundRisk = getRiskById(id);
      setRisk(foundRisk);
    }
    setLoading(false);
  }, [id]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500 text-white';
      case 'under_assessment': return 'bg-yellow-500 text-black';
      case 'manager_review': return 'bg-orange-500 text-white';
      case 'approved_for_mitigation': return 'bg-green-500 text-white';
      case 'mitigation_in_progress': return 'bg-purple-500 text-white';
      case 'ready_for_closure': return 'bg-indigo-500 text-white';
      case 'closed': return 'bg-gray-500 text-white';
      case 'rejected': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getUserName = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const getSiteName = (siteId: string) => {
    const site = mockSites.find(s => s.id === siteId);
    return site ? site.name : 'Unknown Site';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getDaysOverdue = (dueDate: Date) => {
    const today = new Date();
    const diffTime = today.getTime() - dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!risk) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Risk Not Found</h1>
          <p className="text-muted-foreground mt-2">The requested risk could not be found.</p>
          <Link to="/risks">
            <Button className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Risk Register
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const daysOverdue = getDaysOverdue(risk.dueDate);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/risks">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{risk.title}</h1>
          <p className="text-muted-foreground">{risk.id}</p>
        </div>
      </div>

      {/* Status Chips */}
      <div className="flex flex-wrap gap-2">
        <Badge className={getStatusColor(risk.status)}>
          {risk.status.replace(/_/g, ' ').toUpperCase()}
        </Badge>
        <Badge className={getSeverityColor(risk.severity)}>
          {risk.severity.toUpperCase()}
        </Badge>
        {risk.riskScore && (
          <Badge variant="outline">
            Risk Score: {risk.riskScore}
          </Badge>
        )}
        <Badge variant="outline" className="flex items-center gap-1">
          <User className="h-3 w-3" />
          {getUserName(risk.assignedTo)}
        </Badge>
        {risk.site && (
          <Badge variant="outline" className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {getSiteName(risk.site)}
          </Badge>
        )}
        {daysOverdue > 0 && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {daysOverdue} days overdue
          </Badge>
        )}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="mitigation">Mitigation</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
          <TabsTrigger value="closure">Closure</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Risk Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Description</h4>
                  <p className="mt-1">{risk.description}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Category</h4>
                    <p className="mt-1 capitalize">{risk.category}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Reported By</h4>
                    <p className="mt-1">{getUserName(risk.reportedBy)}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Created</h4>
                    <p className="mt-1">{formatDate(risk.createdAt)}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Due Date</h4>
                    <p className="mt-1">{formatDate(risk.dueDate)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Change Owner
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Notification
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Update Due Date
                </Button>
                <Separator />
                {risk.status === 'under_assessment' && (
                  <Link to={`/risks/${risk.id}/assess`}>
                    <Button className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Start Assessment
                    </Button>
                  </Link>
                )}
                {risk.status === 'manager_review' && (
                  <Link to={`/risks/${risk.id}/review`}>
                    <Button className="w-full">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Review Assessment
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assessment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
              <CardDescription>
                Current assessment status and scoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              {risk.assessment ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <h4 className="font-medium">Impact</h4>
                      <p className="text-2xl font-bold">{risk.assessment.impact}</p>
                    </div>
                    <div className="text-center">
                      <h4 className="font-medium">Likelihood</h4>
                      <p className="text-2xl font-bold">{risk.assessment.likelihood}</p>
                    </div>
                    <div className="text-center">
                      <h4 className="font-medium">Detectability</h4>
                      <p className="text-2xl font-bold">{risk.assessment.detectability}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="text-center">
                    <h4 className="font-medium">Overall Risk Score</h4>
                    <p className="text-3xl font-bold text-primary">{risk.riskScore}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No assessment completed yet</p>
                  <Link to={`/risks/${risk.id}/assess`}>
                    <Button className="mt-4">
                      Start Assessment Wizard
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mitigation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mitigation Actions</CardTitle>
              <CardDescription>
                Actions to reduce or eliminate the risk
              </CardDescription>
            </CardHeader>
            <CardContent>
              {risk.mitigationActions.length > 0 ? (
                <div className="space-y-4">
                  {risk.mitigationActions.map((action) => (
                    <div key={action.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{action.title}</h4>
                        <Badge variant={action.status === 'completed' ? 'default' : 'secondary'}>
                          {action.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{action.description}</p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Assigned to:</span> {getUserName(action.assignedTo)}
                        </div>
                        <div>
                          <span className="font-medium">Due:</span> {formatDate(action.dueDate)}
                        </div>
                        <div>
                          <span className="font-medium">Progress:</span> {action.progress}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No mitigation actions defined yet</p>
                  <Link to={`/risks/${risk.id}/mitigation`}>
                    <Button className="mt-4">
                      Create Mitigation Plan
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit & Compliance</CardTitle>
              <CardDescription>
                Audit findings and compliance status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No audit activities yet</p>
                <div className="flex gap-2 justify-center mt-4">
                  <Button variant="outline">Request Audit</Button>
                  <Button variant="outline">Raise NCR</Button>
                  <Button variant="outline">Sign Off</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="closure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Closure</CardTitle>
              <CardDescription>
                Residual risk assessment and closure process
              </CardDescription>
            </CardHeader>
            <CardContent>
              {risk.status === 'ready_for_closure' || risk.status === 'closed' ? (
                <div className="space-y-4">
                  {risk.residualScore && (
                    <div className="text-center">
                      <h4 className="font-medium">Residual Risk Score</h4>
                      <p className="text-2xl font-bold text-green-600">{risk.residualScore}</p>
                    </div>
                  )}
                  <div className="flex gap-2 justify-center">
                    {risk.status === 'ready_for_closure' && (
                      <>
                        <Button>Approve Closure</Button>
                        <Button variant="outline">Request Changes</Button>
                      </>
                    )}
                    {risk.status === 'closed' && (
                      <Badge variant="default" className="text-lg px-4 py-2">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Risk Closed
                      </Badge>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Risk not ready for closure</p>
                  <p className="text-sm text-muted-foreground">Complete all mitigation actions first</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
              <CardDescription>
                Timeline of all risk-related activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {getUserName(risk.reportedBy).split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">{getUserName(risk.reportedBy)}</span> created this risk
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(risk.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>SYS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">
                      Risk assigned to <span className="font-medium">{getUserName(risk.assignedTo)}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(risk.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
              <CardDescription>
                Files and evidence related to this risk
              </CardDescription>
            </CardHeader>
            <CardContent>
              {risk.evidence.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {risk.evidence.map((file, index) => (
                    <div key={index} className="border rounded-lg p-4 text-center">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium truncate">{file}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No files attached</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
              <CardDescription>
                Discussion and notes about this risk
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No comments yet</p>
                <Button className="mt-4">Add Comment</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}