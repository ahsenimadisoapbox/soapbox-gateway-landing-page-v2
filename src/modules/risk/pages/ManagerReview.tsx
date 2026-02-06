import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle, FileText, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Alert, AlertDescription } from '../components/ui/alert';
import { getRiskById, saveRisk } from '../lib/storage';
import { mockUsers } from '../lib/mockData';
import { Risk } from '../types/risk';
import { toast } from '../hooks/use-toast';

export default function ManagerReview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [risk, setRisk] = useState<Risk | null>(null);
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundRisk = getRiskById(id);
      setRisk(foundRisk);
    }
    setLoading(false);
  }, [id]);

  const getUserName = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const getRiskLevel = (score: number) => {
    if (score >= 16) return { level: 'Very High', color: 'bg-red-500 text-white' };
    if (score >= 12) return { level: 'High', color: 'bg-orange-500 text-white' };
    if (score >= 8) return { level: 'Medium', color: 'bg-yellow-500 text-black' };
    if (score >= 4) return { level: 'Low', color: 'bg-green-500 text-white' };
    return { level: 'Very Low', color: 'bg-blue-500 text-white' };
  };

  const handleApprove = () => {
    if (!risk) return;

    const updatedRisk = {
      ...risk,
      status: 'approved_for_mitigation' as const,
      updatedAt: new Date()
    };

    saveRisk(updatedRisk);
    
    toast({
      title: "Assessment Approved",
      description: "Risk assessment has been approved and is ready for mitigation planning."
    });
    
    navigate(`/risks/${risk.id}`);
  };

  const handleRequestChanges = () => {
    if (!risk || !comments.trim()) {
      toast({
        title: "Comments Required",
        description: "Please provide comments explaining what changes are needed.",
        variant: "destructive"
      });
      return;
    }

    const updatedRisk = {
      ...risk,
      status: 'rework_requested' as const,
      updatedAt: new Date()
    };

    saveRisk(updatedRisk);
    
    toast({
      title: "Changes Requested",
      description: "Assessment has been returned for revisions with your comments."
    });
    
    navigate(`/risks/${risk.id}`);
  };

  const handleReject = () => {
    if (!risk || !comments.trim()) {
      toast({
        title: "Comments Required",
        description: "Please provide comments explaining the reason for rejection.",
        variant: "destructive"
      });
      return;
    }

    const updatedRisk = {
      ...risk,
      status: 'rejected' as const,
      updatedAt: new Date()
    };

    saveRisk(updatedRisk);
    
    toast({
      title: "Assessment Rejected",
      description: "Risk assessment has been rejected with your comments."
    });
    
    navigate(`/risks/${risk.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!risk || !risk.assessment) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Assessment Not Found</h1>
          <p className="text-muted-foreground mt-2">
            No assessment found for this risk or assessment not submitted yet.
          </p>
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

  const riskLevel = getRiskLevel(risk.riskScore || 0);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to={`/risks/${risk.id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Risk
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Risk Assessment Review</h1>
          <p className="text-muted-foreground">{risk.title}</p>
        </div>
      </div>

      {/* Risk Level Alert */}
      <Alert className={`mb-6 border-2 ${riskLevel.level === 'Very High' || riskLevel.level === 'High' ? 'border-red-500' : ''}`}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="font-medium">
          This risk has been assessed as <strong>{riskLevel.level}</strong> with a score of {risk.riskScore}.
          {(riskLevel.level === 'Very High' || riskLevel.level === 'High') && 
            ' Immediate attention and mitigation planning required.'
          }
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Assessment Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Assessment Summary</CardTitle>
            <CardDescription>
              Completed by {getUserName(risk.assessment.assessedBy)} on{' '}
              {new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }).format(risk.assessment.assessedAt)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Assessment Method</h4>
              <p className="mt-1 capitalize">{risk.assessment.method}</p>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <h4 className="font-medium text-sm text-muted-foreground">Impact</h4>
                <div className="mt-2">
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {risk.assessment.impact}
                  </Badge>
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-medium text-sm text-muted-foreground">Likelihood</h4>
                <div className="mt-2">
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {risk.assessment.likelihood}
                  </Badge>
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-medium text-sm text-muted-foreground">Detectability</h4>
                <div className="mt-2">
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {risk.assessment.detectability}
                  </Badge>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="text-center">
              <h4 className="font-medium text-sm text-muted-foreground">Overall Risk Score</h4>
              <div className="mt-2">
                <Badge className={riskLevel.color + " text-2xl px-4 py-2"}>
                  {risk.riskScore}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  {risk.assessment.impact} × {risk.assessment.likelihood} × {11 - risk.assessment.detectability}
                </p>
              </div>
            </div>
            
            {risk.assessment.recommendations && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Recommendations</h4>
                  <p className="mt-1 text-sm">{risk.assessment.recommendations}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Evidence & Actions */}
        <div className="space-y-6">
          {/* Evidence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Evidence
              </CardTitle>
            </CardHeader>
            <CardContent>
              {risk.evidence.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {risk.evidence.map((file, index) => (
                    <div key={index} className="border rounded-lg p-3 text-center">
                      <FileText className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-xs font-medium truncate">{file}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No evidence attached</p>
              )}
            </CardContent>
          </Card>

          {/* Review Comments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Review Comments
              </CardTitle>
              <CardDescription>
                Provide feedback for the assessment (required for changes/rejection)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Label htmlFor="comments" className="sr-only">Comments</Label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Enter your review comments here..."
                className="min-h-[120px]"
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Review Decision</CardTitle>
              <CardDescription>
                Choose an action for this risk assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleApprove} 
                className="w-full justify-start"
                size="lg"
              >
                <CheckCircle2 className="h-5 w-5 mr-3 text-green-500" />
                <div className="text-left">
                  <div className="font-medium">Approve Assessment</div>
                  <div className="text-sm text-muted-foreground">
                    Proceed to mitigation planning
                  </div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleRequestChanges}
                className="w-full justify-start"
                size="lg"
              >
                <AlertCircle className="h-5 w-5 mr-3 text-yellow-500" />
                <div className="text-left">
                  <div className="font-medium">Request Changes</div>
                  <div className="text-sm text-muted-foreground">
                    Return for assessment revisions
                  </div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleReject}
                className="w-full justify-start"
                size="lg"
              >
                <XCircle className="h-5 w-5 mr-3 text-red-500" />
                <div className="text-left">
                  <div className="font-medium">Reject Assessment</div>
                  <div className="text-sm text-muted-foreground">
                    Assessment requires complete rework
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}