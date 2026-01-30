import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter,
  FolderKanban,
  FileText,
  TestTube,
  AlertTriangle,
  ClipboardCheck,
  Eye,
  ChevronRight,
  X,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  type: 'project' | 'requirement' | 'test' | 'deviation' | 'document';
  title: string;
  description: string;
  projectId?: string;
  projectName?: string;
  status: string;
  lastModified: string;
  matchedField?: string;
}

const mockSearchIndex: SearchResult[] = [
  // Projects
  { id: 'VAL-2024-001', type: 'project', title: 'ERP System Validation', description: 'Full validation of enterprise resource planning system upgrade', status: 'In Progress', lastModified: '2024-01-17' },
  { id: 'VAL-2024-002', type: 'project', title: 'LIMS Migration', description: 'Laboratory information management system migration validation', status: 'Conditionally Valid', lastModified: '2024-01-16' },
  { id: 'VAL-2024-003', type: 'project', title: 'MES Integration', description: 'Manufacturing execution system integration validation', status: 'Planning', lastModified: '2024-01-15' },
  
  // Requirements
  { id: 'REQ-001', type: 'requirement', title: 'User Authentication', description: 'System shall provide secure user authentication with SSO support', projectId: 'VAL-2024-001', projectName: 'ERP System Validation', status: 'Approved', lastModified: '2024-01-10' },
  { id: 'REQ-002', type: 'requirement', title: 'Data Integrity', description: 'System shall maintain data integrity during all transactions', projectId: 'VAL-2024-001', projectName: 'ERP System Validation', status: 'Approved', lastModified: '2024-01-10' },
  { id: 'REQ-003', type: 'requirement', title: 'Audit Trail', description: 'System shall maintain complete audit trail of all user actions', projectId: 'VAL-2024-002', projectName: 'LIMS Migration', status: 'Draft', lastModified: '2024-01-12' },
  
  // Tests
  { id: 'TC-001', type: 'test', title: 'Login Functionality Test', description: 'Verify user login with valid and invalid credentials', projectId: 'VAL-2024-001', projectName: 'ERP System Validation', status: 'Passed', lastModified: '2024-01-15' },
  { id: 'TC-002', type: 'test', title: 'Data Migration Verification', description: 'Verify data integrity after migration process', projectId: 'VAL-2024-002', projectName: 'LIMS Migration', status: 'In Progress', lastModified: '2024-01-17' },
  { id: 'TC-003', type: 'test', title: 'Performance Benchmark', description: 'System performance under load conditions', projectId: 'VAL-2024-001', projectName: 'ERP System Validation', status: 'Pending', lastModified: '2024-01-14' },
  
  // Deviations
  { id: 'DEV-001', type: 'deviation', title: 'Login timeout issue', description: 'Session timeout occurring before configured duration', projectId: 'VAL-2024-001', projectName: 'ERP System Validation', status: 'Under Investigation', lastModified: '2024-01-16' },
  { id: 'DEV-002', type: 'deviation', title: 'Data migration discrepancy', description: 'Minor data format differences found in migrated records', projectId: 'VAL-2024-002', projectName: 'LIMS Migration', status: 'CAPA Required', lastModified: '2024-01-17' },
  
  // Documents
  { id: 'DOC-001', type: 'document', title: 'Validation Protocol VP-2024-001', description: 'Master validation protocol for ERP system', projectId: 'VAL-2024-001', projectName: 'ERP System Validation', status: 'Approved', lastModified: '2024-01-12' },
  { id: 'DOC-002', type: 'document', title: 'Risk Assessment RA-2024-001', description: 'Risk assessment for ERP upgrade project', projectId: 'VAL-2024-001', projectName: 'ERP System Validation', status: 'Approved', lastModified: '2024-01-08' },
  { id: 'DOC-003', type: 'document', title: 'IQ Protocol', description: 'Installation qualification protocol', projectId: 'VAL-2024-002', projectName: 'LIMS Migration', status: 'Draft', lastModified: '2024-01-14' },
];

const GlobalSearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'ERP validation',
    'audit trail',
    'DEV-001',
  ]);

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'project': return <FolderKanban size={16} />;
      case 'requirement': return <FileText size={16} />;
      case 'test': return <TestTube size={16} />;
      case 'deviation': return <AlertTriangle size={16} />;
      case 'document': return <ClipboardCheck size={16} />;
    }
  };

  const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'project': return 'bg-step-current/10 text-step-current';
      case 'requirement': return 'bg-accent/10 text-accent';
      case 'test': return 'bg-status-conditional/10 text-status-conditional';
      case 'deviation': return 'bg-status-required/10 text-status-required';
      case 'document': return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    let className = 'status-badge-draft';
    if (statusLower.includes('approved') || statusLower.includes('passed') || statusLower.includes('validated')) {
      className = 'status-badge-active';
    } else if (statusLower.includes('progress') || statusLower.includes('conditional')) {
      className = 'status-badge-pending';
    } else if (statusLower.includes('required') || statusLower.includes('failed')) {
      className = 'status-badge-critical';
    }
    return <span className={cn('status-badge', className)}>{status}</span>;
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return mockSearchIndex.filter(item => {
      const matchesQuery = 
        item.id.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (item.projectName && item.projectName.toLowerCase().includes(query));
      
      const matchesType = filterType === 'all' || item.type === filterType;
      const matchesStatus = filterStatus === 'all' || item.status.toLowerCase().includes(filterStatus.toLowerCase());
      
      return matchesQuery && matchesType && matchesStatus;
    });
  }, [searchQuery, filterType, filterStatus]);

  const resultsByType = useMemo(() => {
    const grouped: Record<string, SearchResult[]> = {
      project: [],
      requirement: [],
      test: [],
      deviation: [],
      document: [],
    };
    searchResults.forEach(result => {
      grouped[result.type].push(result);
    });
    return grouped;
  }, [searchResults]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilterType('all');
    setFilterStatus('all');
  };

  const navigateToResult = (result: SearchResult) => {
    switch (result.type) {
      case 'project':
        navigate(`/projects/${result.id}`);
        break;
      case 'deviation':
        navigate(`/deviations/${result.id}`);
        break;
      default:
        setSelectedResult(result);
        setViewDialogOpen(true);
    }
  };

  const ResultCard = ({ result }: { result: SearchResult }) => (
    <div 
      className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
      onClick={() => navigateToResult(result)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className={cn('p-2 rounded-lg', getTypeColor(result.type))}>
            {getTypeIcon(result.type)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-muted-foreground">{result.id}</span>
              <Badge variant="outline" className="text-xs">{result.type}</Badge>
              {getStatusBadge(result.status)}
            </div>
            <h4 className="font-medium">{result.title}</h4>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {result.description}
            </p>
            {result.projectName && (
              <p className="text-xs text-muted-foreground mt-2">
                Project: {result.projectName}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {new Date(result.lastModified).toLocaleDateString()}
          </span>
          <ChevronRight size={16} className="text-muted-foreground" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Global Search</h1>
        <p className="text-muted-foreground">
          Search across all validation projects, requirements, tests, deviations, and documents
        </p>
      </div>

      {/* Search Box */}
      <Card className="enterprise-card">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by ID, title, description, or project name..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 pr-10 h-12 text-lg"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[150px]">
                  <Filter size={14} className="mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="project">Projects</SelectItem>
                  <SelectItem value="requirement">Requirements</SelectItem>
                  <SelectItem value="test">Tests</SelectItem>
                  <SelectItem value="deviation">Deviations</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="progress">In Progress</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Searches (when no search query) */}
      {!searchQuery && (
        <Card className="enterprise-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock size={18} />
              Recent Searches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearch(search)}
                >
                  {search}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {searchQuery && (
        <>
          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Found <span className="font-medium text-foreground">{searchResults.length}</span> results for "{searchQuery}"
            </p>
          </div>

          {searchResults.length === 0 ? (
            <Card className="enterprise-card">
              <CardContent className="py-12 text-center">
                <Search size={48} className="mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium">No results found</h3>
                <p className="text-muted-foreground mt-1">
                  Try adjusting your search terms or filters
                </p>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">
                  All ({searchResults.length})
                </TabsTrigger>
                {Object.entries(resultsByType).map(([type, results]) => (
                  results.length > 0 && (
                    <TabsTrigger key={type} value={type} className="capitalize">
                      {type}s ({results.length})
                    </TabsTrigger>
                  )
                ))}
              </TabsList>

              <TabsContent value="all">
                <Card className="enterprise-card">
                  <CardContent className="p-4 space-y-3">
                    {searchResults.map(result => (
                      <ResultCard key={result.id} result={result} />
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {Object.entries(resultsByType).map(([type, results]) => (
                results.length > 0 && (
                  <TabsContent key={type} value={type}>
                    <Card className="enterprise-card">
                      <CardContent className="p-4 space-y-3">
                        {results.map(result => (
                          <ResultCard key={result.id} result={result} />
                        ))}
                      </CardContent>
                    </Card>
                  </TabsContent>
                )
              ))}
            </Tabs>
          )}
        </>
      )}

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Item Details</DialogTitle>
          </DialogHeader>
          {selectedResult && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className={cn('p-2 rounded', getTypeColor(selectedResult.type))}>
                  {getTypeIcon(selectedResult.type)}
                </div>
                <Badge variant="outline" className="capitalize">{selectedResult.type}</Badge>
                {getStatusBadge(selectedResult.status)}
              </div>
              <div>
                <p className="text-sm font-mono text-muted-foreground">{selectedResult.id}</p>
                <h3 className="font-semibold text-lg">{selectedResult.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{selectedResult.description}</p>
              </div>
              {selectedResult.projectName && (
                <div className="text-sm">
                  <p className="text-muted-foreground">Project</p>
                  <p className="font-medium">{selectedResult.projectName}</p>
                </div>
              )}
              <div className="text-sm">
                <p className="text-muted-foreground">Last Modified</p>
                <p className="font-medium">{new Date(selectedResult.lastModified).toLocaleDateString()}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>Close</Button>
            {selectedResult?.projectId && (
              <Button onClick={() => {
                navigate(`/projects/${selectedResult.projectId}`);
                setViewDialogOpen(false);
              }}>
                Go to Project
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GlobalSearch;
