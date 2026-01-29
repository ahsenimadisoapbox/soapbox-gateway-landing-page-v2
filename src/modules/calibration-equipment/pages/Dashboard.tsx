import { useState } from 'react';
import { LayoutDashboard, Package, AlertTriangle, Clock, ShieldAlert, Gauge, Wrench } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { KPICard } from '../components/KPICard';
import { FilterBar } from '../components/FilterBar';
import { StatusBadge, StatusType } from '../components/StatusBadge';
import { RiskBadge, RiskLevel } from '../components/StatusBadge';
import { ActionButtons } from '../components/ActionButtons';
import { EquipmentFormModal } from '../components/modals/EquipmentFormModal';
import { DeleteConfirmModal } from '../components/modals/DeleteConfirmModal';
import { mockEquipment, dashboardKPIs, sites, statuses, criticalities, Equipment } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
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
  ];

  const filteredEquipment = equipment.filter(eq => {
    if (searchQuery && !eq.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !eq.assetId.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.site && filters.site !== 'all' && eq.site !== filters.site) return false;
    if (filters.status && filters.status !== 'all' && eq.status !== filters.status) return false;
    if (filters.criticality && filters.criticality !== 'all' && eq.criticality !== filters.criticality) return false;
    return true;
  });

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

  return (
    <div>
      <PageHeader
        title="Equipment & Calibration Dashboard"
        description="Overview of equipment status, calibrations, and compliance metrics"
        icon={LayoutDashboard}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
        <KPICard
          title="Total Equipment"
          value={dashboardKPIs.totalEquipment}
          icon={Package}
          variant="default"
        />
        <KPICard
          title="Active"
          value={dashboardKPIs.activeEquipment}
          icon={Package}
          variant="success"
        />
        <KPICard
          title="Due"
          value={dashboardKPIs.dueEquipment}
          icon={Clock}
          variant="warning"
          onClick={() => setFilters({ status: 'due' })}
        />
        <KPICard
          title="Overdue"
          value={dashboardKPIs.overdueEquipment}
          icon={AlertTriangle}
          variant="danger"
          onClick={() => setFilters({ status: 'overdue' })}
        />
        <KPICard
          title="Restricted"
          value={dashboardKPIs.restrictedEquipment}
          icon={ShieldAlert}
          variant="danger"
          onClick={() => setFilters({ status: 'restricted' })}
        />
        <KPICard
          title="Open OOT"
          value={dashboardKPIs.ootCount}
          icon={Gauge}
          variant="danger"
          onClick={() => navigate('/oot')}
        />
        <KPICard
          title="PM Overdue"
          value={dashboardKPIs.overduePM}
          icon={Wrench}
          variant="warning"
          onClick={() => navigate('/pm')}
        />
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

      {/* Equipment List */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Asset ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Calibration Due</th>
                <th>Risk</th>
                <th>Site</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.map((eq) => (
                <tr key={eq.id}>
                  <td className="font-medium">{eq.assetId}</td>
                  <td>{eq.name}</td>
                  <td>
                    <StatusBadge status={eq.status as StatusType} />
                  </td>
                  <td>{eq.calibrationDue || '-'}</td>
                  <td>
                    <RiskBadge level={eq.criticality as RiskLevel} score={eq.riskScore} />
                  </td>
                  <td className="text-muted-foreground">{eq.site}</td>
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
                  <td colSpan={7} className="text-center py-8 text-muted-foreground">
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
        onSave={(data) => {
          if (modalMode === 'edit' && selectedEquipment) {
            setEquipment(prev => prev.map(e => e.id === selectedEquipment.id ? { ...e, ...data } as Equipment : e));
          }
        }}
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

export default Dashboard;
