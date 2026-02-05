import { useState } from 'react';
import { useNCR } from '../context/NCRContext';
import { Modal } from '../components/shared/Modal';
import { StatusBadge, SeverityBadge } from '../components/shared/StatusBadge';
import { toast } from '../hooks/use-toast';
import { Eye, CheckCircle, RotateCcw, Upload } from 'lucide-react';
import { Verification } from '../types/ncr';

export default function VerificationClosure() {
  const { ncrs, verifications, updateNCR, addVerification, updateVerification, currentUser } = useNCR();
  const [viewModal, setViewModal] = useState<string | null>(null);
  const [verifyModal, setVerifyModal] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    effectivenessRating: '' as '' | 'Effective' | 'Partially Effective' | 'Not Effective',
    comments: '',
    beforeEvidence: [] as string[],
    afterEvidence: [] as string[],
  });

  const pendingNCRs = ncrs.filter(n => 
    n.status === 'Verification Pending' || n.status === 'CAPA Completed'
  );

  const handleOpenVerify = (ncrId: string) => {
    setForm({
      effectivenessRating: '',
      comments: '',
      beforeEvidence: [],
      afterEvidence: [],
    });
    setVerifyModal(ncrId);
  };

  const handleVerify = () => {
    if (!verifyModal || !form.effectivenessRating) {
      toast({ title: 'Error', description: 'Please select an effectiveness rating.', variant: 'destructive' });
      return;
    }

    const verification: Verification = {
      id: `VER-${String(verifications.length + 3).padStart(3, '0')}`,
      ncrId: verifyModal,
      verifier: currentUser.name,
      verificationDate: new Date().toISOString().split('T')[0],
      effectivenessRating: form.effectivenessRating,
      beforeEvidence: form.beforeEvidence,
      afterEvidence: form.afterEvidence,
      comments: form.comments,
      status: 'Verified',
    };

    addVerification(verification);

    if (form.effectivenessRating === 'Effective') {
      updateNCR(verifyModal, {
        status: 'Closed',
        timeline: [
          ...(ncrs.find(n => n.id === verifyModal)?.timeline || []),
          { id: `t${Date.now()}`, action: 'Verification Completed - Closed', user: currentUser.name, timestamp: new Date().toISOString() },
        ],
      });
      toast({ title: 'NCR Closed', description: `${verifyModal} has been verified and closed.` });
    } else {
      toast({ title: 'Verification Recorded', description: 'Verification recorded. Further action may be required.' });
    }

    setVerifyModal(null);
  };

  const handleReopen = (ncrId: string) => {
    updateNCR(ncrId, {
      status: 'CAPA In Progress',
      timeline: [
        ...(ncrs.find(n => n.id === ncrId)?.timeline || []),
        { id: `t${Date.now()}`, action: 'Reopened for additional CAPA', user: currentUser.name, timestamp: new Date().toISOString() },
      ],
    });
    toast({ title: 'NCR Reopened', description: `${ncrId} has been reopened.` });
  };

  const handleUpload = (type: 'before' | 'after') => {
    const fileName = `${type}_evidence_${Date.now()}.jpg`;
    if (type === 'before') {
      setForm({ ...form, beforeEvidence: [...form.beforeEvidence, fileName] });
    } else {
      setForm({ ...form, afterEvidence: [...form.afterEvidence, fileName] });
    }
    toast({ title: 'Evidence Uploaded', description: `${fileName} has been attached.` });
  };

  const getNCRDetails = (ncrId: string) => ncrs.find(n => n.id === ncrId);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Verification & Closure</h1>
          <p className="page-subtitle">Verify CAPA effectiveness and close NCRs</p>
        </div>
      </div>

      {/* Pending Verification */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Pending Verification ({pendingNCRs.length})</h2>
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>NCR ID</th>
                <th>Title</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingNCRs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground">
                    No NCRs pending verification.
                  </td>
                </tr>
              ) : (
                pendingNCRs.map(ncr => (
                  <tr key={ncr.id}>
                    <td className="font-medium">{ncr.id}</td>
                    <td className="max-w-xs truncate">{ncr.title}</td>
                    <td><SeverityBadge severity={ncr.severity} /></td>
                    <td><StatusBadge status={ncr.status} /></td>
                    <td>{ncr.dueDate || '-'}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setViewModal(ncr.id)} className="icon-button text-muted-foreground hover:text-info" title="View">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleOpenVerify(ncr.id)} className="action-button action-button-primary py-1 px-2 text-xs">
                          <CheckCircle className="h-3 w-3" />
                          Verify
                        </button>
                        <button onClick={() => handleReopen(ncr.id)} className="action-button action-button-outline py-1 px-2 text-xs">
                          <RotateCcw className="h-3 w-3" />
                          Reopen
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification History */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Verification History</h2>
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Verification ID</th>
                <th>NCR ID</th>
                <th>Verifier</th>
                <th>Date</th>
                <th>Effectiveness</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {verifications.map(ver => (
                <tr key={ver.id}>
                  <td className="font-medium">{ver.id}</td>
                  <td>{ver.ncrId}</td>
                  <td>{ver.verifier}</td>
                  <td>{ver.verificationDate}</td>
                  <td>
                    <span className={`status-badge ${
                      ver.effectivenessRating === 'Effective' ? 'bg-success/10 text-success' :
                      ver.effectivenessRating === 'Partially Effective' ? 'bg-warning/10 text-warning' :
                      'bg-destructive/10 text-destructive'
                    }`}>
                      {ver.effectivenessRating}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${ver.status === 'Verified' ? 'status-validated' : 'status-investigation'}`}>
                      {ver.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="NCR Details" size="lg">
        {viewModal && getNCRDetails(viewModal) && (
          <div className="space-y-4">
            {(() => {
              const ncr = getNCRDetails(viewModal)!;
              return (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div><p className="text-sm text-muted-foreground">NCR ID</p><p className="font-medium">{ncr.id}</p></div>
                    <div><p className="text-sm text-muted-foreground">Status</p><StatusBadge status={ncr.status} /></div>
                    <div><p className="text-sm text-muted-foreground">Severity</p><SeverityBadge severity={ncr.severity} /></div>
                    <div><p className="text-sm text-muted-foreground">Category</p><p className="font-medium">{ncr.category}</p></div>
                    <div className="md:col-span-2"><p className="text-sm text-muted-foreground">Title</p><p className="font-medium">{ncr.title}</p></div>
                    <div className="md:col-span-2"><p className="text-sm text-muted-foreground">Description</p><p className="font-medium">{ncr.description}</p></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Timeline</p>
                    <div className="space-y-2">
                      {ncr.timeline.map(t => (
                        <div key={t.id} className="flex items-start gap-2 text-sm">
                          <span className="text-muted-foreground">{t.timestamp.split('T')[0]}</span>
                          <span className="font-medium">{t.action}</span>
                          <span className="text-muted-foreground">by {t.user}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </Modal>

      {/* Verify Modal */}
      <Modal
        isOpen={!!verifyModal}
        onClose={() => setVerifyModal(null)}
        title="Verify NCR"
        size="lg"
        footer={
          <div className="flex gap-2">
            <button onClick={() => setVerifyModal(null)} className="action-button action-button-outline">Cancel</button>
            <button onClick={handleVerify} className="action-button action-button-primary">Complete Verification</button>
          </div>
        }
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Effectiveness Rating <span className="text-destructive">*</span></label>
            <select
              value={form.effectivenessRating}
              onChange={(e) => setForm({ ...form, effectivenessRating: e.target.value as any })}
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
            >
              <option value="">Select rating</option>
              <option value="Effective">Effective - CAPA resolved the issue</option>
              <option value="Partially Effective">Partially Effective - Some improvement</option>
              <option value="Not Effective">Not Effective - Issue persists</option>
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">Before Evidence</label>
              <button onClick={() => handleUpload('before')} className="action-button action-button-outline w-full mb-2">
                <Upload className="h-4 w-4" />
                Upload Before Photo
              </button>
              {form.beforeEvidence.length > 0 && (
                <ul className="text-sm text-muted-foreground">
                  {form.beforeEvidence.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">After Evidence</label>
              <button onClick={() => handleUpload('after')} className="action-button action-button-outline w-full mb-2">
                <Upload className="h-4 w-4" />
                Upload After Photo
              </button>
              {form.afterEvidence.length > 0 && (
                <ul className="text-sm text-muted-foreground">
                  {form.afterEvidence.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Verification Comments</label>
            <textarea
              value={form.comments}
              onChange={(e) => setForm({ ...form, comments: e.target.value })}
              rows={4}
              placeholder="Enter verification comments and observations..."
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
