import { useState } from 'react';
import { Package, Plus } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { FilterBar } from '../components/FilterBar';
import { StatusBadge, StatusType } from '../components/StatusBadge';
import { RiskBadge, RiskLevel } from '../components/StatusBadge';
import { ActionButtons } from '../components/ActionButtons';
import { Button } from '../components/ui/button';
import { EquipmentFormModal } from '../components/modals/EquipmentFormModal';
import { DeleteConfirmModal } from '../components/modals/DeleteConfirmModal';
import { mockEquipment, sites, statuses, criticalities, departments, Equipment } from '../data/mockData';

const EquipmentPage = () => {
  const [equipment, setEquipment] = useState<Equipment[]>(mockEquipment);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('view');
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const filterConfigs = [
    { key: 'site', label: 'Sites', options: sites.map(s => ({ label: s, value: s })) },
    { key: 'status', label: 'Status', options: statuses.map(s => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s })) },
    { key: 'criticality', label: 'Criticality', options: criticalities.map(c => ({ label: c.charAt(0).toUpperCase() + c.slice(1), value: c })) },
    { key: 'department', label: 'Department', options: departments.map(d => ({ label: d, value: d })) },
  ];

  const filteredEquipment = equipment.filter(eq => {
    if (searchQuery && !eq.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !eq.assetId.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.site && filters.site !== 'all' && eq.site !== filters.site) return false;
    if (filters.status && filters.status !== 'all' && eq.status !== filters.status) return false;
    if (filters.criticality && filters.criticality !== 'all' && eq.criticality !== filters.criticality) return false;
    if (filters.department && filters.department !== 'all' && eq.department !== filters.department) return false;
    return true;
  });

  const handleCreate = () => {
    setSelectedEquipment(undefined);
    setModalMode('create');
    setShowEquipmentModal(true);
  };

  const handleView = (eq: Equipment) => {
    setSelectedEquipment(eq);
    setModalMode('view');
    setShowEquipmentModal(true);
  };

  const handleEdit = (eq: Equipment) => {
    setSelectedEquipment(eq);
    setModalMode('edit');
    setShowEquipmentModal(true);
  };

  const handleDelete = (eq: Equipment) => {
    setSelectedEquipment(eq);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedEquipment) {
      setEquipment(prev => prev.filter(e => e.id !== selectedEquipment.id));
    }
    setShowDeleteModal(false);
  };

  const handleSave = (data: Partial<Equipment>) => {
    if (modalMode === 'create') {
      const newEquipment: Equipment = {
        ...data,
        id: String(equipment.length + 1),
        status: 'draft',
        riskScore: 50,
        qualificationStatus: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      } as Equipment;
      setEquipment(prev => [...prev, newEquipment]);
    } else if (modalMode === 'edit' && selectedEquipment) {
      setEquipment(prev => prev.map(e => e.id === selectedEquipment.id ? { ...e, ...data } as Equipment : e));
    }
  };

  return (
    <div>
      <PageHeader
        title="Equipment Management"
        description="Manage equipment lifecycle from draft to retirement"
        icon={Package}
        actions={
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Equipment
          </Button>
        }
      />

      {/* Filter Bar */}
      <FilterBar
        filters={filterConfigs}
        values={filters}
        onChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
        onSearch={setSearchQuery}
        searchValue={searchQuery}
        onClear={() => { setFilters({}); setSearchQuery(''); }}
      />

      {/* Equipment List */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Asset ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Qualification</th>
                <th>Calibration Due</th>
                <th>Risk</th>
                <th>Location</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.map((eq) => (
                <tr key={eq.id}>
                  <td className="font-medium">{eq.assetId}</td>
                  <td>{eq.name}</td>
                  <td className="text-muted-foreground">{eq.category}</td>
                  <td>
                    <StatusBadge status={eq.status as StatusType} />
                  </td>
                  <td>
                    <StatusBadge status={eq.qualificationStatus === 'qualified' ? 'active' : 'pending'} />
                  </td>
                  <td>{eq.calibrationDue || '-'}</td>
                  <td>
                    <RiskBadge level={eq.criticality as RiskLevel} score={eq.riskScore} />
                  </td>
                  <td className="text-muted-foreground">{eq.location}</td>
                  <td className="text-right">
                    <ActionButtons
                      onView={() => handleView(eq)}
                      onEdit={() => handleEdit(eq)}
                      onDelete={() => handleDelete(eq)}
                    />
                  </td>
                </tr>
              ))}
              {filteredEquipment.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-muted-foreground">
                    No equipment found matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <EquipmentFormModal
        open={showEquipmentModal}
        onOpenChange={setShowEquipmentModal}
        equipment={selectedEquipment}
        mode={modalMode}
        onSave={handleSave}
      />

      <DeleteConfirmModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        title="Delete Equipment"
        description={`Are you sure you want to delete ${selectedEquipment?.name}? This action cannot be undone.`}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default EquipmentPage;
