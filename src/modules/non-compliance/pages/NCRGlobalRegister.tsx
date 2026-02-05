import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNCR } from '../context/NCRContext';
import { Modal } from '../components/shared/Modal';
import { StatusBadge, SeverityBadge } from '../components/shared/StatusBadge';
import { toast } from '../hooks/use-toast';
import { Eye, Download, Filter, Search, X } from 'lucide-react';
import { NCR, NCRStatus, Severity, Category } from '../types/ncr';
import { sites } from '../data/mockData';

export default function NCRGlobalRegister() {
  const navigate = useNavigate();
  const { ncrs } = useNCR();
  const [viewModal, setViewModal] = useState<NCR | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    site: '',
    severity: '',
    status: '',
    category: '',
    dateFrom: '',
    dateTo: '',
    confidential: '',
  });

  const statuses: NCRStatus[] = ['Draft', 'Submitted', 'Validated', 'Under Investigation', 'RCA Submitted', 'RCA Approved', 'CAPA In Progress', 'CAPA Completed', 'Verification Pending', 'Closed'];
  const severities: Severity[] = ['Critical', 'Major', 'Minor'];
  const categories: Category[] = ['Process Deviation', 'Equipment Failure', 'Documentation Error', 'Training Gap', 'Supplier Issue', 'Environmental', 'Safety Hazard', 'Quality Control', 'Regulatory Non-Compliance', 'Other'];

  const filteredNCRs = ncrs.filter(ncr => {
    if (searchTerm && !ncr.id.toLowerCase().includes(searchTerm.toLowerCase()) && !ncr.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filters.site && ncr.site !== filters.site) return false;
    if (filters.severity && ncr.severity !== filters.severity) return false;
    if (filters.status && ncr.status !== filters.status) return false;
    if (filters.category && ncr.category !== filters.category) return false;
    if (filters.dateFrom && ncr.reportedDate < filters.dateFrom) return false;
    if (filters.dateTo && ncr.reportedDate > filters.dateTo) return false;
    if (filters.confidential === 'yes' && !ncr.isConfidential) return false;
    if (filters.confidential === 'no' && ncr.isConfidential) return false;
    return true;
  });

  const clearFilters = () => {
    setFilters({
      site: '',
      severity: '',
      status: '',
      category: '',
      dateFrom: '',
      dateTo: '',
      confidential: '',
    });
    setSearchTerm('');
  };

  const handleExportExcel = () => {
    const headers = ['NCR ID', 'Title', 'Category', 'Severity', 'Status', 'Site', 'Location', 'Reported By', 'Date', 'Confidential'];
    const rows = filteredNCRs.map(ncr => [
      ncr.id, ncr.title, ncr.category, ncr.severity, ncr.status, ncr.site, ncr.location, ncr.reportedBy, ncr.reportedDate, ncr.isConfidential ? 'Yes' : 'No'
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NCR_Register_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast({ title: 'Export Complete', description: 'NCR register exported to CSV.' });
  };

  const handleExportPDF = () => {
    toast({ title: 'PDF Export', description: 'PDF export initiated. File will download shortly.' });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">NCR Global Register</h1>
          <p className="page-subtitle">View and search all non-compliance records</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportExcel} className="action-button action-button-outline">
            <Download className="h-4 w-4" />
            Export Excel
          </button>
          <button onClick={handleExportPDF} className="action-button action-button-outline">
            <Download className="h-4 w-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by NCR ID or title..."
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`action-button ${showFilters ? 'action-button-primary' : 'action-button-outline'}`}
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
          {(searchTerm || Object.values(filters).some(v => v)) && (
            <button onClick={clearFilters} className="action-button action-button-outline">
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-border grid gap-4 md:grid-cols-4">
            <div>
              <label className="block text-sm font-medium mb-1">Site</label>
              <select
                value={filters.site}
                onChange={(e) => setFilters({ ...filters, site: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
              >
                <option value="">All Sites</option>
                {sites.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Severity</label>
              <select
                value={filters.severity}
                onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
              >
                <option value="">All Severities</option>
                {severities.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
              >
                <option value="">All Statuses</option>
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
              >
                <option value="">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confidential</label>
              <select
                value={filters.confidential}
                onChange={(e) => setFilters({ ...filters, confidential: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
              >
                <option value="">All</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground mb-4">
        Showing {filteredNCRs.length} of {ncrs.length} records
      </p>

      {/* NCR Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>NCR ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Site</th>
                <th>Reported Date</th>
                <th>Confidential</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNCRs.map(ncr => (
                <tr key={ncr.id}>
                  <td className="font-medium">{ncr.id}</td>
                  <td className="max-w-xs truncate">{ncr.title}</td>
                  <td>{ncr.category}</td>
                  <td><SeverityBadge severity={ncr.severity} /></td>
                  <td><StatusBadge status={ncr.status} /></td>
                  <td>{ncr.site}</td>
                  <td>{ncr.reportedDate}</td>
                  <td>{ncr.isConfidential ? 'Yes' : 'No'}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setViewModal(ncr)} className="icon-button text-muted-foreground hover:text-info" title="View">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => navigate(`/ncr-detail/${ncr.id}`)} className="text-xs text-primary hover:underline">
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="NCR Quick View" size="lg">
        {viewModal && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div><p className="text-sm text-muted-foreground">NCR ID</p><p className="font-medium">{viewModal.id}</p></div>
              <div><p className="text-sm text-muted-foreground">Status</p><StatusBadge status={viewModal.status} /></div>
              <div><p className="text-sm text-muted-foreground">Category</p><p className="font-medium">{viewModal.category}</p></div>
              <div><p className="text-sm text-muted-foreground">Severity</p><SeverityBadge severity={viewModal.severity} /></div>
              <div><p className="text-sm text-muted-foreground">Site</p><p className="font-medium">{viewModal.site}</p></div>
              <div><p className="text-sm text-muted-foreground">Location</p><p className="font-medium">{viewModal.location}</p></div>
              <div><p className="text-sm text-muted-foreground">Reported By</p><p className="font-medium">{viewModal.isConfidential ? 'Confidential' : viewModal.reportedBy}</p></div>
              <div><p className="text-sm text-muted-foreground">Date</p><p className="font-medium">{viewModal.reportedDate}</p></div>
              <div className="md:col-span-2"><p className="text-sm text-muted-foreground">Title</p><p className="font-medium">{viewModal.title}</p></div>
              <div className="md:col-span-2"><p className="text-sm text-muted-foreground">Description</p><p className="font-medium">{viewModal.description}</p></div>
            </div>
            <div className="pt-4 border-t border-border">
              <button onClick={() => { setViewModal(null); navigate(`/ncr-detail/${viewModal.id}`); }} className="action-button action-button-primary">
                View Full Details
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
