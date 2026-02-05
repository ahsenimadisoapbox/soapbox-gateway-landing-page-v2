import { useState } from 'react';
import { useNCR } from '../context/NCRContext';
import { Modal } from '../components/shared/Modal';
import { CAPAStatusBadge } from '../components/shared/StatusBadge';
import { toast } from '../hooks/use-toast';
import { Eye, Pencil, Plus, Upload, Trash2 } from 'lucide-react';
import { CAPA } from '../types/ncr';
import { mockUsers } from '../data/mockData';
import { cn } from '../lib/utils';

export default function CAPAList() {
  const { capas, ncrs, addCAPA, updateCAPA, currentUser } = useNCR();
  const [viewModal, setViewModal] = useState<CAPA | null>(null);
  const [editModal, setEditModal] = useState<CAPA | null>(null);
  const [createModal, setCreateModal] = useState(false);
  
  const [form, setForm] = useState({
    ncrId: '',
    title: '',
    description: '',
    type: 'Corrective' as 'Corrective' | 'Preventive',
    assignedTo: '',
    dueDate: '',
    status: 'Open' as CAPA['status'],
    evidence: [] as string[],
    verificationNotes: '',
  });

  const capaNCRs = ncrs.filter(n => 
    ['RCA Approved', 'CAPA In Progress', 'CAPA Completed'].includes(n.status)
  );

  const resetForm = () => {
    setForm({
      ncrId: '',
      title: '',
      description: '',
      type: 'Corrective',
      assignedTo: '',
      dueDate: '',
      status: 'Open',
      evidence: [],
      verificationNotes: '',
    });
  };

  const handleCreate = () => {
    if (!form.ncrId || !form.title || !form.assignedTo || !form.dueDate) {
      toast({ title: 'Error', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }

    const capa: CAPA = {
      id: `CAPA-${String(capas.length + 5).padStart(3, '0')}`,
      ncrId: form.ncrId,
      title: form.title,
      description: form.description,
      type: form.type,
      assignedTo: form.assignedTo,
      dueDate: form.dueDate,
      status: 'Open',
    };

    addCAPA(capa);
    toast({ title: 'CAPA Created', description: `${capa.id} has been created.` });
    setCreateModal(false);
    resetForm();
  };

  const handleOpenEdit = (capa: CAPA) => {
    setForm({
      ncrId: capa.ncrId,
      title: capa.title,
      description: capa.description,
      type: capa.type,
      assignedTo: capa.assignedTo,
      dueDate: capa.dueDate,
      status: capa.status,
      evidence: capa.evidence || [],
      verificationNotes: capa.verificationNotes || '',
    });
    setEditModal(capa);
  };

  const handleUpdate = () => {
    if (editModal) {
      updateCAPA(editModal.id, {
        title: form.title,
        description: form.description,
        type: form.type,
        assignedTo: form.assignedTo,
        dueDate: form.dueDate,
        status: form.status,
        evidence: form.evidence,
        verificationNotes: form.verificationNotes,
        completedDate: form.status === 'Closed' ? new Date().toISOString().split('T')[0] : undefined,
      });
      toast({ title: 'CAPA Updated', description: 'Changes have been saved.' });
      setEditModal(null);
      resetForm();
    }
  };

  const handleUploadEvidence = () => {
    const fileName = `capa_evidence_${Date.now()}.pdf`;
    setForm({ ...form, evidence: [...form.evidence, fileName] });
    toast({ title: 'Evidence Uploaded', description: `${fileName} has been attached.` });
  };

  const isOverdue = (dueDate: string, status: string) => {
    return status !== 'Closed' && new Date(dueDate) < new Date();
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">CAPA List & Update</h1>
          <p className="page-subtitle">Manage Corrective and Preventive Actions</p>
        </div>
        <button onClick={() => setCreateModal(true)} className="action-button action-button-primary">
          <Plus className="h-4 w-4" />
          Create CAPA
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="stat-card">
          <p className="stat-label">Open</p>
          <p className="stat-value text-info">{capas.filter(c => c.status === 'Open').length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">In Progress</p>
          <p className="stat-value text-warning">{capas.filter(c => c.status === 'In Progress').length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Awaiting Verification</p>
          <p className="stat-value text-primary">{capas.filter(c => c.status === 'Awaiting Verification').length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Closed</p>
          <p className="stat-value text-success">{capas.filter(c => c.status === 'Closed').length}</p>
        </div>
      </div>

      {/* CAPA Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>CAPA ID</th>
              <th>NCR ID</th>
              <th>Title</th>
              <th>Type</th>
              <th>Assigned To</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {capas.map(capa => (
              <tr key={capa.id}>
                <td className="font-medium">{capa.id}</td>
                <td>{capa.ncrId}</td>
                <td className="max-w-xs truncate">{capa.title}</td>
                <td>
                  <span className={cn(
                    'status-badge',
                    capa.type === 'Corrective' ? 'bg-info/10 text-info' : 'bg-primary/10 text-primary'
                  )}>
                    {capa.type}
                  </span>
                </td>
                <td>{capa.assignedTo}</td>
                <td className={cn(isOverdue(capa.dueDate, capa.status) && 'text-destructive font-medium')}>
                  {capa.dueDate}
                  {isOverdue(capa.dueDate, capa.status) && ' (Overdue)'}
                </td>
                <td><CAPAStatusBadge status={capa.status} /></td>
                <td>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setViewModal(capa)} className="icon-button text-muted-foreground hover:text-info" title="View">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleOpenEdit(capa)} className="icon-button text-muted-foreground hover:text-primary" title="Edit">
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={createModal}
        onClose={() => { setCreateModal(false); resetForm(); }}
        title="Create CAPA"
        size="lg"
        footer={
          <div className="flex gap-2">
            <button onClick={() => { setCreateModal(false); resetForm(); }} className="action-button action-button-outline">Cancel</button>
            <button onClick={handleCreate} className="action-button action-button-primary">Create CAPA</button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">NCR <span className="text-destructive">*</span></label>
            <select
              value={form.ncrId}
              onChange={(e) => setForm({ ...form, ncrId: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
            >
              <option value="">Select NCR</option>
              {capaNCRs.map(ncr => (
                <option key={ncr.id} value={ncr.id}>{ncr.id} - {ncr.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Title <span className="text-destructive">*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">Type <span className="text-destructive">*</span></label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as 'Corrective' | 'Preventive' })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
              >
                <option value="Corrective">Corrective</option>
                <option value="Preventive">Preventive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Assigned To <span className="text-destructive">*</span></label>
              <select
                value={form.assignedTo}
                onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
              >
                <option value="">Select assignee</option>
                {mockUsers.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Due Date <span className="text-destructive">*</span></label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editModal}
        onClose={() => { setEditModal(null); resetForm(); }}
        title="Update CAPA"
        size="lg"
        footer={
          <div className="flex gap-2">
            <button onClick={() => { setEditModal(null); resetForm(); }} className="action-button action-button-outline">Cancel</button>
            <button onClick={handleUpdate} className="action-button action-button-primary">Save Changes</button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as CAPA['status'] })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Awaiting Verification">Awaiting Verification</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Evidence</label>
            <div className="flex gap-2 mb-2">
              <button onClick={handleUploadEvidence} className="action-button action-button-outline">
                <Upload className="h-4 w-4" />
                Upload Evidence
              </button>
            </div>
            {form.evidence.length > 0 && (
              <ul className="text-sm text-muted-foreground space-y-1">
                {form.evidence.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Verification Notes</label>
            <textarea
              value={form.verificationNotes}
              onChange={(e) => setForm({ ...form, verificationNotes: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="CAPA Details" size="lg">
        {viewModal && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div><p className="text-sm text-muted-foreground">CAPA ID</p><p className="font-medium">{viewModal.id}</p></div>
              <div><p className="text-sm text-muted-foreground">NCR ID</p><p className="font-medium">{viewModal.ncrId}</p></div>
              <div><p className="text-sm text-muted-foreground">Type</p><p className="font-medium">{viewModal.type}</p></div>
              <div><p className="text-sm text-muted-foreground">Status</p><CAPAStatusBadge status={viewModal.status} /></div>
              <div><p className="text-sm text-muted-foreground">Assigned To</p><p className="font-medium">{viewModal.assignedTo}</p></div>
              <div><p className="text-sm text-muted-foreground">Due Date</p><p className="font-medium">{viewModal.dueDate}</p></div>
              <div className="md:col-span-2"><p className="text-sm text-muted-foreground">Title</p><p className="font-medium">{viewModal.title}</p></div>
              <div className="md:col-span-2"><p className="text-sm text-muted-foreground">Description</p><p className="font-medium">{viewModal.description}</p></div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
