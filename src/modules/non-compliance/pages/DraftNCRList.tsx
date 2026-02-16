import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNCR } from '../context/NCRContext';
import { Modal } from '../components/shared/Modal';
import { SeverityBadge } from '../components/shared/StatusBadge';
import { toast } from '../hooks/use-toast';
import { Eye, Pencil, Trash2, Send, Plus } from 'lucide-react';
import { NCR, Category, Severity } from '../types/ncr';
import { sites, hazardTypes, requirementReferences } from '../data/mockData';

const categories: Category[] = [
  'Process Deviation', 'Equipment Failure', 'Documentation Error', 'Training Gap',
  'Supplier Issue', 'Environmental', 'Safety Hazard', 'Quality Control', 'Regulatory Non-Compliance', 'Other',
];
const severities: Severity[] = ['Critical', 'Major', 'Minor'];

export default function DraftNCRList() {
  const navigate = useNavigate();
  const { draftNCRs, updateDraftNCR, deleteDraftNCR, submitDraftNCR } = useNCR();
  const [viewModal, setViewModal] = useState<NCR | null>(null);
  const [editModal, setEditModal] = useState<NCR | null>(null);
  const [deleteModal, setDeleteModal] = useState<NCR | null>(null);
  const [editForm, setEditForm] = useState<Partial<NCR>>({});

  const handleEdit = (draft: NCR) => {
    setEditForm({ ...draft });
    setEditModal(draft);
  };

  const handleSaveEdit = () => {
    if (editModal && editForm) {
      updateDraftNCR(editModal.id, editForm);
      toast({ title: 'Draft Updated', description: 'Your changes have been saved.' });
      setEditModal(null);
    }
  };

  const handleDelete = () => {
    if (deleteModal) {
      deleteDraftNCR(deleteModal.id);
      toast({ title: 'Draft Deleted', description: 'The draft has been removed.' });
      setDeleteModal(null);
    }
  };

  const handleSubmit = (draft: NCR) => {
    submitDraftNCR(draft.id);
    toast({ title: 'NCR Submitted', description: 'Your NCR has been submitted for review.' });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Draft NCR List</h1>
          <p className="page-subtitle">Manage your draft non-compliance reports</p>
        </div>
        <button onClick={() => navigate('/non-compliance/create-ncr')} className="action-button action-button-primary">
          <Plus className="h-4 w-4" />
          Create New NCR
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Draft ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Severity</th>
              <th>Site</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {draftNCRs.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-muted-foreground">
                  No draft NCRs found. Create a new NCR to get started.
                </td>
              </tr>
            ) : (
              draftNCRs.map(draft => (
                <tr key={draft.id}>
                  <td className="font-medium">{draft.id}</td>
                  <td className="max-w-xs truncate">{draft.title}</td>
                  <td>{draft.category}</td>
                  <td><SeverityBadge severity={draft.severity} /></td>
                  <td>{draft.site}</td>
                  <td>{draft.reportedDate}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setViewModal(draft)} className="icon-button text-muted-foreground hover:text-info" title="View">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleEdit(draft)} className="icon-button text-muted-foreground hover:text-primary" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteModal(draft)} className="icon-button text-muted-foreground hover:text-destructive" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleSubmit(draft)} className="action-button action-button-primary py-1 px-2 text-xs">
                        <Send className="h-3 w-3" />
                        Submit
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="View Draft NCR" size="lg">
        {viewModal && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div><p className="text-sm text-muted-foreground">ID</p><p className="font-medium">{viewModal.id}</p></div>
              <div><p className="text-sm text-muted-foreground">Title</p><p className="font-medium">{viewModal.title}</p></div>
              <div><p className="text-sm text-muted-foreground">Category</p><p className="font-medium">{viewModal.category}</p></div>
              <div><p className="text-sm text-muted-foreground">Severity</p><SeverityBadge severity={viewModal.severity} /></div>
              <div><p className="text-sm text-muted-foreground">Site</p><p className="font-medium">{viewModal.site}</p></div>
              <div><p className="text-sm text-muted-foreground">Location</p><p className="font-medium">{viewModal.location || '-'}</p></div>
              <div className="md:col-span-2"><p className="text-sm text-muted-foreground">Description</p><p className="font-medium">{viewModal.description}</p></div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editModal}
        onClose={() => setEditModal(null)}
        title="Edit Draft NCR"
        size="lg"
        footer={
          <div className="flex gap-2">
            <button onClick={() => setEditModal(null)} className="action-button action-button-outline">Cancel</button>
            <button onClick={handleSaveEdit} className="action-button action-button-primary">Save Changes</button>
          </div>
        }
      >
        {editModal && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={editForm.title || ''}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={editForm.description || ''}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={editForm.category || ''}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value as Category })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Severity</label>
                <select
                  value={editForm.severity || ''}
                  onChange={(e) => setEditForm({ ...editForm, severity: e.target.value as Severity })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
                >
                  {severities.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Site</label>
                <select
                  value={editForm.site || ''}
                  onChange={(e) => setEditForm({ ...editForm, site: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
                >
                  {sites.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={editForm.location || ''}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Delete Draft"
        size="sm"
        footer={
          <div className="flex gap-2">
            <button onClick={() => setDeleteModal(null)} className="action-button action-button-outline">Cancel</button>
            <button onClick={handleDelete} className="action-button action-button-destructive">Delete</button>
          </div>
        }
      >
        <p className="text-muted-foreground">
          Are you sure you want to delete draft "{deleteModal?.title}"? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
