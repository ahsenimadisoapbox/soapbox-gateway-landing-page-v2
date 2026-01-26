import { useState } from "react";
import { ArrowLeft, Search, Clock, FileText, CheckCircle, Users, Calendar, Play, X, Info, Copy } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Separator } from "../../components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../components/ui/dialog";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

interface Template {
  id: string;
  name: string;
  description: string;
  version: string;
  framework: string;
  category: string;
  questionCount: number;
  estimatedDuration: string;
  lastUsed: string;
  usedCount: number;
  sections: number;
  status: "published" | "draft";
}

const mockTemplates: Template[] = [
  {
    id: "TPL-001",
    name: "GDPR Privacy Assessment",
    description: "Comprehensive assessment for GDPR Article 35 compliance including data protection impact analysis.",
    version: "2.1",
    framework: "GDPR",
    category: "Privacy",
    questionCount: 45,
    estimatedDuration: "45-60 min",
    lastUsed: "2024-11-15",
    usedCount: 24,
    sections: 5,
    status: "published",
  },
  {
    id: "TPL-002",
    name: "ISO 27001 Security Review",
    description: "Full information security management system assessment aligned with ISO 27001:2022 controls.",
    version: "1.3",
    framework: "ISO 27001",
    category: "Security",
    questionCount: 114,
    estimatedDuration: "2-3 hours",
    lastUsed: "2024-10-28",
    usedCount: 18,
    sections: 14,
    status: "published",
  },
  {
    id: "TPL-003",
    name: "HIPAA Privacy Rule Assessment",
    description: "Healthcare privacy and security assessment covering PHI handling and safeguards.",
    version: "1.0",
    framework: "HIPAA",
    category: "Healthcare",
    questionCount: 52,
    estimatedDuration: "1-1.5 hours",
    lastUsed: "2024-09-20",
    usedCount: 12,
    sections: 6,
    status: "published",
  },
  {
    id: "TPL-004",
    name: "SOX IT General Controls",
    description: "IT general controls testing for Sarbanes-Oxley compliance requirements.",
    version: "2.0",
    framework: "SOX",
    category: "Financial",
    questionCount: 38,
    estimatedDuration: "45-60 min",
    lastUsed: "2024-08-15",
    usedCount: 8,
    sections: 4,
    status: "published",
  },
];

const sites = [
  { id: "SITE-001", name: "Headquarters", location: "New York, NY" },
  { id: "SITE-002", name: "Data Center", location: "Dallas, TX" },
  { id: "SITE-003", name: "European Office", location: "London, UK" },
  { id: "SITE-004", name: "Asia Pacific Hub", location: "Singapore" },
];

const assignees = [
  { id: "self", name: "Self (Current User)", email: "current.user@company.com" },
  { id: "sarah", name: "Sarah Johnson", email: "sarah.johnson@company.com" },
  { id: "michael", name: "Michael Chen", email: "michael.chen@company.com" },
  { id: "emily", name: "Emily Davis", email: "emily.davis@company.com" },
];

const TemplateSelectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const obligation = location.state?.obligation;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedSite, setSelectedSite] = useState<string>("");
  const [selectedAssignee, setSelectedAssignee] = useState<string>("self");
  const [frameworkFilter, setFrameworkFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  
  // Dialog states
  const [templateInfoDialogOpen, setTemplateInfoDialogOpen] = useState(false);
  const [selectedTemplateForInfo, setSelectedTemplateForInfo] = useState<Template | null>(null);

  const filteredTemplates = mockTemplates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFramework = frameworkFilter === "all" || template.framework === frameworkFilter;
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter;
    return matchesSearch && matchesFramework && matchesCategory;
  });

  const handleStartAssessment = () => {
    if (selectedTemplate && selectedSite) {
      const template = mockTemplates.find(t => t.id === selectedTemplate);
      const site = sites.find(s => s.id === selectedSite);
      const assignee = assignees.find(a => a.id === selectedAssignee);
      
      toast.success(`Starting assessment with template: ${template?.name}`);
      
      navigate("/assessment/wizard", { 
        state: { 
          obligation,
          template,
          site,
          assignee
        } 
      });
    } else {
      if (!selectedTemplate) {
        toast.error("Please select an assessment template");
      } else if (!selectedSite) {
        toast.error("Please select a site/location");
      }
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFrameworkFilter("all");
    setCategoryFilter("all");
    toast.success("Filters cleared");
  };

  const hasActiveFilters = searchQuery || frameworkFilter !== "all" || categoryFilter !== "all";

  const handleViewTemplateInfo = (template: Template) => {
    setSelectedTemplateForInfo(template);
    setTemplateInfoDialogOpen(true);
  };

  const handleCopyTemplateId = (templateId: string) => {
    navigator.clipboard.writeText(templateId);
    toast.success("Template ID copied to clipboard");
  };

  const handleCancel = () => {
    navigate(-1);
    toast.info("Assessment cancelled");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Button variant="outline" onClick={handleCancel} className="mb-4 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Obligation
          </Button>
          <h1 className="text-2xl font-bold">Select Assessment Template</h1>
          {obligation && (
            <p className="text-muted-foreground">
              For: {obligation.name} ({obligation.id})
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Selection */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search templates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={frameworkFilter} onValueChange={setFrameworkFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Framework" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Frameworks</SelectItem>
                    <SelectItem value="GDPR">GDPR</SelectItem>
                    <SelectItem value="ISO 27001">ISO 27001</SelectItem>
                    <SelectItem value="HIPAA">HIPAA</SelectItem>
                    <SelectItem value="SOX">SOX</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Privacy">Privacy</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Financial">Financial</SelectItem>
                  </SelectContent>
                </Select>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                    <X className="w-4 h-4" />
                    Clear
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Template Cards */}
          <RadioGroup value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <div className="space-y-4">
              {filteredTemplates.map((template) => (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all ${selectedTemplate === template.id ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <RadioGroupItem value={template.id} id={template.id} className="mt-1" />
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label htmlFor={template.id} className="text-lg font-semibold cursor-pointer">
                              {template.name}
                            </Label>
                            <Badge variant="outline">v{template.version}</Badge>
                            <Badge className="bg-green-100 text-green-800">{template.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              {template.questionCount} questions
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {template.estimatedDuration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              Used {template.usedCount}x
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Last: {template.lastUsed}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewTemplateInfo(template);
                          }}
                          title="View Template Details"
                        >
                          <Info className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyTemplateId(template.id);
                          }}
                          title="Copy Template ID"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Badge variant="outline" className="shrink-0">{template.framework}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </RadioGroup>

          {filteredTemplates.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No templates match your search criteria.</p>
                <Button variant="link" onClick={clearFilters}>Clear filters</Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Configuration Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Configuration</CardTitle>
              <CardDescription>Configure assessment settings before starting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Site/Location *</Label>
                <Select value={selectedSite} onValueChange={setSelectedSite}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose site..." />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name} - {site.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Assign To (Optional)</Label>
                <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Self (default)" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignees.map((assignee) => (
                      <SelectItem key={assignee.id} value={assignee.id}>
                        {assignee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {selectedTemplate && (
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <p className="font-medium text-sm">Selected Template</p>
                  <p className="text-sm">{mockTemplates.find(t => t.id === selectedTemplate)?.name}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {mockTemplates.find(t => t.id === selectedTemplate)?.sections} sections
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {mockTemplates.find(t => t.id === selectedTemplate)?.questionCount} questions
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              className="flex-1 gap-2 bg-primary hover:bg-primary/90"
              disabled={!selectedTemplate || !selectedSite}
              onClick={handleStartAssessment}
            >
              <Play className="w-4 h-4" />
              Start Assessment
            </Button>
          </div>
        </div>
      </div>

      {/* Template Info Dialog */}
      <Dialog open={templateInfoDialogOpen} onOpenChange={setTemplateInfoDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTemplateForInfo?.name}</DialogTitle>
            <DialogDescription>Template details and metadata</DialogDescription>
          </DialogHeader>
          {selectedTemplateForInfo && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">v{selectedTemplateForInfo.version}</Badge>
                <Badge className="bg-green-100 text-green-800">{selectedTemplateForInfo.status}</Badge>
                <Badge variant="outline">{selectedTemplateForInfo.framework}</Badge>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Description</p>
                <p>{selectedTemplateForInfo.description}</p>
              </div>

              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Template ID</p>
                  <p className="font-mono font-medium">{selectedTemplateForInfo.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{selectedTemplateForInfo.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sections</p>
                  <p className="font-medium">{selectedTemplateForInfo.sections}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Questions</p>
                  <p className="font-medium">{selectedTemplateForInfo.questionCount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Duration</p>
                  <p className="font-medium">{selectedTemplateForInfo.estimatedDuration}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Times Used</p>
                  <p className="font-medium">{selectedTemplateForInfo.usedCount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Used</p>
                  <p className="font-medium">{selectedTemplateForInfo.lastUsed}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setTemplateInfoDialogOpen(false)}>Close</Button>
            <Button onClick={() => {
              if (selectedTemplateForInfo) {
                setSelectedTemplate(selectedTemplateForInfo.id);
                setTemplateInfoDialogOpen(false);
                toast.success(`Template "${selectedTemplateForInfo.name}" selected`);
              }
            }}>
              Select This Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplateSelectionPage;
