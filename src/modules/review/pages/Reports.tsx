import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart3,
  Download,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  Printer,
  Eye,
} from 'lucide-react';
import { dashboardStats } from '@/data/mockData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { toast } from '@/hooks/use-toast';

const quarterlyData = [
  { quarter: 'Q1 2024', reviews: 3, actions: 12, capas: 4 },
  { quarter: 'Q2 2024', reviews: 3, actions: 15, capas: 3 },
  { quarter: 'Q3 2024', reviews: 3, actions: 10, capas: 5 },
  { quarter: 'Q4 2024', reviews: 3, actions: 18, capas: 4 },
];

const complianceData = [
  { month: 'Jul', score: 88 },
  { month: 'Aug', score: 90 },
  { month: 'Sep', score: 87 },
  { month: 'Oct', score: 91 },
  { month: 'Nov', score: 93 },
  { month: 'Dec', score: 94 },
];

const evidencePacks = [
  { id: 'EP-001', title: 'Q4 2024 Review Evidence Pack', type: 'Full Pack', generatedAt: '2024-12-21', size: '2.4 MB' },
  { id: 'EP-002', title: 'Q3 2024 Audit Evidence', type: 'Clause-wise', generatedAt: '2024-09-19', size: '1.8 MB' },
  { id: 'EP-003', title: 'Annual 2024 Summary', type: 'Executive Summary', generatedAt: '2025-01-02', size: '856 KB' },
];

const reportTemplates = [
  { title: 'Review Minutes', description: 'Auto-generated meeting minutes', icon: FileText },
  { title: 'Action Status Report', description: 'Current status of all actions', icon: CheckCircle2 },
  { title: 'CAPA Summary', description: 'CAPA lifecycle and effectiveness', icon: TrendingUp },
  { title: 'Attendance Report', description: 'Leadership participation analytics', icon: Calendar },
  { title: 'Compliance Dashboard', description: 'ISO 9001 compliance metrics', icon: BarChart3 },
  { title: 'Executive Summary', description: 'High-level governance overview', icon: FileText },
];

export function Reports() {
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [isViewReportOpen, setIsViewReportOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [generateFormData, setGenerateFormData] = useState({
    title: '',
    type: 'Full Pack',
    dateRange: 'last-quarter',
  });

  const handlePrint = () => {
    toast({
      title: "Print Initiated",
      description: "Preparing document for printing...",
    });
    window.print();
  };

  const handleExportAll = () => {
    toast({
      title: "Export Started",
      description: "Generating comprehensive report package...",
    });
  };

  const handleDownload = (packId: string, title: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${title}...`,
    });
  };

  const handleGenerateNew = () => {
    if (!generateFormData.title) {
      toast({
        title: "Validation Error",
        description: "Please enter a title for the evidence pack",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Evidence Pack Generated",
      description: `${generateFormData.title} has been created successfully`,
    });
    setIsGenerateOpen(false);
    setGenerateFormData({ title: '', type: 'Full Pack', dateRange: 'last-quarter' });
  };

  const handleViewReport = (title: string) => {
    setSelectedReport(title);
    setIsViewReportOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports & Evidence</h1>
            <p className="text-muted-foreground">Generate reports and audit evidence packs</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button className="gap-2" onClick={handleExportAll}>
              <Download className="h-4 w-4" />
              Export All
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="kpi-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="kpi-label">Total Reviews</p>
                  <p className="text-xl font-bold">{dashboardStats.totalReviews}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="kpi-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="kpi-label">Completion Rate</p>
                  <p className="text-xl font-bold">{Math.round((dashboardStats.reviewsCompleted / dashboardStats.totalReviews) * 100)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="kpi-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="kpi-label">Avg. Action Time</p>
                  <p className="text-xl font-bold">18 days</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="kpi-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-info/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="kpi-label">Compliance Score</p>
                  <p className="text-xl font-bold">{dashboardStats.complianceScore}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Quarterly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={quarterlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="quarter" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="reviews" fill="hsl(var(--primary))" name="Reviews" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="actions" fill="hsl(var(--info))" name="Actions" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="capas" fill="hsl(var(--warning))" name="CAPAs" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Compliance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={complianceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[80, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line type="monotone" dataKey="score" stroke="hsl(var(--success))" strokeWidth={2} dot={{ fill: 'hsl(var(--success))' }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Evidence Packs */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Evidence Packs
              </CardTitle>
              <Button size="sm" className="gap-2" onClick={() => setIsGenerateOpen(true)}>
                <Download className="h-4 w-4" />
                Generate New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {evidencePacks.map((pack) => (
                <div key={pack.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{pack.title}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{pack.type}</span>
                        <span>•</span>
                        <span>{pack.generatedAt}</span>
                        <span>•</span>
                        <span>{pack.size}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => handleDownload(pack.id, pack.title)}>
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Report Templates */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Available Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reportTemplates.map((report) => (
                <Card 
                  key={report.title} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleViewReport(report.title)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <report.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{report.title}</p>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                      </div>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generate Evidence Pack Dialog */}
      <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Evidence Pack</DialogTitle>
            <DialogDescription>Create a new audit-ready evidence package</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Pack Title *</Label>
              <Input
                value={generateFormData.title}
                onChange={(e) => setGenerateFormData({ ...generateFormData, title: e.target.value })}
                placeholder="e.g., Q1 2025 Review Evidence Pack"
              />
            </div>
            <div className="space-y-2">
              <Label>Pack Type</Label>
              <Select 
                value={generateFormData.type} 
                onValueChange={(v) => setGenerateFormData({ ...generateFormData, type: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full Pack">Full Pack</SelectItem>
                  <SelectItem value="Clause-wise">Clause-wise</SelectItem>
                  <SelectItem value="Executive Summary">Executive Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select 
                value={generateFormData.dateRange} 
                onValueChange={(v) => setGenerateFormData({ ...generateFormData, dateRange: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-quarter">Last Quarter</SelectItem>
                  <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                  <SelectItem value="last-year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGenerateOpen(false)}>Cancel</Button>
            <Button onClick={handleGenerateNew}>Generate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Report Dialog */}
      <Dialog open={isViewReportOpen} onOpenChange={setIsViewReportOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedReport}</DialogTitle>
            <DialogDescription>Report preview</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-muted/50 rounded-lg p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="font-medium text-lg">{selectedReport}</p>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                This report would display detailed analytics and data visualization in a production environment.
              </p>
              <div className="flex gap-2 mt-6">
                <Button variant="outline" className="gap-2">
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
                <Button className="gap-2">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewReportOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
