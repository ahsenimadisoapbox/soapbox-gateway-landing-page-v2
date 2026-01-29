import { useState } from 'react';
import { AlertTriangle, Search as SearchIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { FilterBar } from '../components/FilterBar';
import { StatusBadge, StatusType } from '../components/StatusBadge';
import { ActionButtons } from '../components/ActionButtons';
import { Button } from '../components/ui/button';
import { OOTInvestigationModal } from '../components/modals/OOTInvestigationModal';
import { DeleteConfirmModal } from '../components/modals/DeleteConfirmModal';
import { mockOOTInvestigations, OOTInvestigation } from '../data/mockData';
import { toast } from '../hooks/use-toast';

const OOTPage = () => {
  const [investigations, setInvestigations] = useState<OOTInvestigation[]>(mockOOTInvestigations);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvestigation, setSelectedInvestigation] = useState<OOTInvestigation | undefined>();
  const [modalMode, setModalMode] = useState<'view' | 'investigate'>('view');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const filterConfigs = [
    { key: 'status', label: 'Status', options: [
      { label: 'Open', value: 'open' },
      { label: 'Investigation', value: 'investigation' },
      { label: 'Pending Review', value: 'pending_review' },
      { label: 'Closed', value: 'closed' },
    ]},
  ];

  const filteredInvestigations = investigations.filter(inv => {
    if (searchQuery && !inv.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !inv.assetId.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.status && filters.status !== 'all' && inv.status !== filters.status) return false;
    return true;
  });

  const handleView = (inv: OOTInvestigation) => {
    setSelectedInvestigation(inv);
    setModalMode('view');
    setShowModal(true);
  };

  const handleInvestigate = (inv: OOTInvestigation) => {
    setSelectedInvestigation(inv);
    setModalMode('investigate');
    setShowModal(true);
  };

  const handleEdit = (inv: OOTInvestigation) => {
    setSelectedInvestigation(inv);
    setModalMode('investigate');
    setShowModal(true);
  };

  const handleDelete = (inv: OOTInvestigation) => {
    setSelectedInvestigation(inv);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedInvestigation) {
      setInvestigations(prev => prev.filter(i => i.id !== selectedInvestigation.id));
      toast({
        title: 'Investigation Deleted',
        description: 'OOT investigation has been deleted.',
      });
    }
    setShowDeleteModal(false);
  };

  const handleSave = (data: Partial<OOTInvestigation>) => {
    if (selectedInvestigation) {
      setInvestigations(prev => prev.map(inv => 
        inv.id === selectedInvestigation.id 
          ? { ...inv, ...data, status: 'investigation' as const } 
          : inv
      ));
      toast({
        title: 'Investigation Updated',
        description: 'OOT investigation has been updated.',
      });
    }
  };

  return (
    <div>
      <PageHeader
        title="OOT Management"
        description="Out-of-Tolerance investigations and corrective actions"
        icon={AlertTriangle}
      />

      {/* Alert Banner */}
      <div className="bg-status-overdue-bg border border-status-overdue/20 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-status-overdue mt-0.5" />
        <div>
          <h3 className="font-medium text-status-overdue">Active OOT Investigations</h3>
          <p className="text-sm text-foreground/80 mt-1">
            {investigations.filter(i => i.status !== 'closed').length} open investigation(s) require attention. 
            Equipment with OOT status is automatically restricted until investigation is complete.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filterConfigs}
        values={filters}
        onChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
        onSearch={setSearchQuery}
        searchValue={searchQuery}
        onClear={() => { setFilters({}); setSearchQuery(''); }}
      />

      {/* Investigation List */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>OOT ID</th>
                <th>Asset ID</th>
                <th>Equipment</th>
                <th>Status</th>
                <th>Created</th>
                <th>Root Cause</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvestigations.map((inv) => (
                <tr key={inv.id}>
                  <td className="font-medium">{inv.id}</td>
                  <td>{inv.assetId}</td>
                  <td>{inv.equipmentName}</td>
                  <td>
                    <StatusBadge status={inv.status as StatusType} />
                  </td>
                  <td>{inv.createdAt}</td>
                  <td className="max-w-xs truncate text-muted-foreground">
                    {inv.rootCause || '-'}
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {inv.status !== 'closed' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-accent hover:text-accent"
                          onClick={() => handleInvestigate(inv)}
                          title="Investigate"
                        >
                          <SearchIcon className="h-4 w-4" />
                        </Button>
                      )}
                      <ActionButtons
                        onView={() => handleView(inv)}
                        onEdit={() => handleEdit(inv)}
                        onDelete={() => handleDelete(inv)}
                        showEdit={true}
                        showDelete={true}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {filteredInvestigations.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-muted-foreground">
                    No OOT investigations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <OOTInvestigationModal
        open={showModal}
        onOpenChange={setShowModal}
        investigation={selectedInvestigation}
        mode={modalMode}
        onSave={handleSave}
      />

      <DeleteConfirmModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        title="Delete OOT Investigation"
        description={`Are you sure you want to delete OOT investigation ${selectedInvestigation?.id}?`}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default OOTPage;
