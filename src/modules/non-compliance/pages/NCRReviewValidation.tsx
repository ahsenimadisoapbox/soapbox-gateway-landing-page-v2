import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNCR } from '../context/NCRContext';
import { Modal } from '../components/shared/Modal';
import { StatusBadge, SeverityBadge } from '../components/shared/StatusBadge';
import { toast } from '../hooks/use-toast';
import { Eye, CheckCircle, XCircle, UserPlus } from 'lucide-react';
import { NCR, Category, Severity } from '../types/ncr';
import { mockUsers, sites } from '../data/mockData';

const categories: Category[] = [
  'Process Deviation', 'Equipment Failure', 'Documentation Error', 'Training Gap',
  'Supplier Issue', 'Environmental', 'Safety Hazard', 'Quality Control', 'Regulatory Non-Compliance', 'Other',
];
const severities: Severity[] = ['Critical', 'Major', 'Minor'];

export default function NCRReviewValidation() {
  const navigate = useNavigate();
  const { ncrs, updateNCR, currentUser } = useNCR();
  const [viewModal, setViewModal] = useState<NCR | null>(null);
  const [validateModal, setValidateModal] = useState<NCR | null>(null);
  const [rejectModal, setRejectModal] = useState<NCR | null>(null);
  
  const [validateForm, setValidateForm] = useState({
    category: '',
    severity: '',
    assignedInvestigator: '',
    dueDate: '',
    containmentActions: '',
  });
  const [rejectReason, setRejectReason] = useState('');

  const pendingNCRs = ncrs.filter(n => n.status === 'Submitted');
  const investigators = mockUsers.filter(u => u.role === 'Investigator' || u.role === 'EHS Officer');

  const handleOpenValidate = (ncr: NCR) => {
    setValidateForm({
      category: ncr.category,
      severity: ncr.severity,
      assignedInvestigator: ncr.assignedInvestigator || '',
      dueDate: ncr.dueDate || '',
      containmentActions: ncr.containmentActions || '',
    });
    setValidateModal(ncr);
  };

  const handleValidate = () => {
    if (validateModal) {
      const updates: Partial<NCR> = {
        status: 'Validated',
        category: validateForm.category as Category,
        severity: validateForm.severity as Severity,
        assignedInvestigator: validateForm.assignedInvestigator || undefined,
        dueDate: validateForm.dueDate || undefined,
        containmentActions: validateForm.containmentActions || undefined,
        timeline: [
          ...validateModal.timeline,
          { id: `t${Date.now()}`, action: 'Validated', user: currentUser.name, timestamp: new Date().toISOString() },
          ...(validateForm.assignedInvestigator ? [{ id: `t${Date.now() + 1}`, action: `Investigator Assigned: ${validateForm.assignedInvestigator}`, user: currentUser.name, timestamp: new Date().toISOString() }] : []),
        ],
      };
      
      if (validateForm.assignedInvestigator) {
        updates.status = 'Under Investigation';
      }
      
      updateNCR(validateModal.id, updates);
      toast({ title: 'NCR Validated', description: `${validateModal.id} has been validated.` });
      setValidateModal(null);
    }
  };

  const handleReject = () => {
    if (rejectModal && rejectReason) {
      updateNCR(rejectModal.id, {
        status: 'Draft',
        timeline: [
          ...rejectModal.timeline,
          { id: `t${Date.now()}`, action: `Rejected: ${rejectReason}`, user: currentUser.name, timestamp: new Date().toISOString() },
        ],
      });
      toast({ title: 'NCR Rejected', description: `${rejectModal.id} has been returned to draft.` });
      setRejectModal(null);
      setRejectReason('');
    }
  };

  // Similar NCR suggestions
  const getSimilarNCRs = (ncr: NCR) => {
    return ncrs.filter(n => n.id !== ncr.id && (n.category === ncr.category || n.site === ncr.site)).slice(0, 3);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">NCR Review & Validation</h1>
          <p className="page-subtitle">Review submitted NCRs and assign investigators</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>NCR ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Severity</th>
              <th>Site</th>
              <th>Reported By</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingNCRs.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-muted-foreground">
                  No NCRs pending review.
                </td>
              </tr>
            ) : (
              pendingNCRs.map(ncr => (
                <tr key={ncr.id}>
                  <td className="font-medium">{ncr.id}</td>
                  <td className="max-w-xs truncate">{ncr.title}</td>
                  <td>{ncr.category}</td>
                  <td><SeverityBadge severity={ncr.severity} /></td>
                  <td>{ncr.site}</td>
                  <td>{ncr.isConfidential ? 'Confidential' : ncr.reportedBy}</td>
                  <td>{ncr.reportedDate}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setViewModal(ncr)} className="icon-button text-muted-foreground hover:text-info" title="View">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleOpenValidate(ncr)} className="icon-button text-muted-foreground hover:text-success" title="Validate">
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button onClick={() => setRejectModal(ncr)} className="icon-button text-muted-foreground hover:text-destructive" title="Reject">
                        <XCircle className="h-4 w-4" />
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
      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="NCR Details" size="lg">
        {viewModal && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div><p className="text-sm text-muted-foreground">ID</p><p className="font-medium">{viewModal.id}</p></div>
              <div><p className="text-sm text-muted-foreground">Status</p><StatusBadge status={viewModal.status} /></div>
              <div><p className="text-sm text-muted-foreground">Category</p><p className="font-medium">{viewModal.category}</p></div>
              <div><p className="text-sm text-muted-foreground">Severity</p><SeverityBadge severity={viewModal.severity} /></div>
              <div><p className="text-sm text-muted-foreground">Site</p><p className="font-medium">{viewModal.site}</p></div>
              <div><p className="text-sm text-muted-foreground">Location</p><p className="font-medium">{viewModal.location}</p></div>
              <div className="md:col-span-2"><p className="text-sm text-muted-foreground">Description</p><p className="font-medium">{viewModal.description}</p></div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Similar NCRs</p>
              <div className="space-y-2">
                {getSimilarNCRs(viewModal).map(similar => (
                  <div key={similar.id} className="p-2 bg-muted rounded text-sm">
                    <span className="font-medium">{similar.id}</span> - {similar.title}
                  </div>
                ))}
                {getSimilarNCRs(viewModal).length === 0 && (
                  <p className="text-sm text-muted-foreground">No similar NCRs found.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Validate Modal */}
      <Modal
        isOpen={!!validateModal}
        onClose={() => setValidateModal(null)}
        title="Validate NCR"
        size="lg"
        footer={
          <div className="flex gap-2">
            <button onClick={() => setValidateModal(null)} className="action-button action-button-outline">Cancel</button>
            <button onClick={handleValidate} className="action-button action-button-primary">Validate & Assign</button>
          </div>
        }
      >
        {validateModal && (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium">{validateModal.id}: {validateModal.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{validateModal.description}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2">Adjust Category</label>
                <select
                  value={validateForm.category}
                  onChange={(e) => setValidateForm({ ...validateForm, category: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Adjust Severity</label>
                <select
                  value={validateForm.severity}
                  onChange={(e) => setValidateForm({ ...validateForm, severity: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
                >
                  {severities.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Assign Investigator</label>
                <select
                  value={validateForm.assignedInvestigator}
                  onChange={(e) => setValidateForm({ ...validateForm, assignedInvestigator: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select investigator</option>
                  {investigators.map(u => <option key={u.id} value={u.name}>{u.name} ({u.role})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Due Date</label>
                <input
                  type="date"
                  value={validateForm.dueDate}
                  onChange={(e) => setValidateForm({ ...validateForm, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {(validateForm.severity === 'Critical') && (
              <div>
                <label className="block text-sm font-medium mb-2">Containment Actions (Required for Critical)</label>
                <textarea
                  value={validateForm.containmentActions}
                  onChange={(e) => setValidateForm({ ...validateForm, containmentActions: e.target.value })}
                  rows={3}
                  placeholder="Describe immediate containment actions taken..."
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
                />
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={!!rejectModal}
        onClose={() => { setRejectModal(null); setRejectReason(''); }}
        title="Reject NCR"
        size="md"
        footer={
          <div className="flex gap-2">
            <button onClick={() => { setRejectModal(null); setRejectReason(''); }} className="action-button action-button-outline">Cancel</button>
            <button onClick={handleReject} disabled={!rejectReason} className="action-button action-button-destructive disabled:opacity-50">Reject</button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">Please provide a reason for rejecting this NCR.</p>
          <div>
            <label className="block text-sm font-medium mb-2">Rejection Reason <span className="text-destructive">*</span></label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="Enter reason for rejection..."
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
