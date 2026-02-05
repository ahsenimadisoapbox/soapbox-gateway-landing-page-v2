import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useNCR } from '../context/NCRContext';
import { Modal } from '../components/shared/Modal';
import { StatusBadge, SeverityBadge, CAPAStatusBadge } from '../components/shared/StatusBadge';
import { toast } from '../hooks/use-toast';
import { ArrowLeft, FileText, Image, Search, ClipboardList, CheckCircle, Clock, Eye, Pencil, Download } from 'lucide-react';
import { cn } from '../lib/utils';

type TabType = 'details' | 'evidence' | 'rca' | 'capa' | 'verification' | 'audit';

export default function NCRDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ncrs, rcas, capas, verifications, currentUser } = useNCR();
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [evidenceModal, setEvidenceModal] = useState<string | null>(null);

  const ncr = ncrs.find(n => n.id === id);
  const ncrRCAs = rcas.filter(r => r.ncrId === id);
  const ncrCAPAs = capas.filter(c => c.ncrId === id);
  const ncrVerifications = verifications.filter(v => v.ncrId === id);

  if (!ncr) {
    return (
      <div className="page-container">
        <p className="text-muted-foreground">NCR not found.</p>
        <button onClick={() => navigate('/register')} className="action-button action-button-primary mt-4">
          Back to Register
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'details' as TabType, label: 'Details', icon: FileText },
    { id: 'evidence' as TabType, label: 'Evidence', icon: Image },
    { id: 'rca' as TabType, label: 'RCA', icon: Search },
    { id: 'capa' as TabType, label: 'CAPA', icon: ClipboardList },
    { id: 'verification' as TabType, label: 'Verification', icon: CheckCircle },
    { id: 'audit' as TabType, label: 'Audit Trail', icon: Clock },
  ];

  const handleDownloadPDF = () => {
    toast({ title: 'Download Started', description: 'NCR report PDF is being generated.' });
  };

  // Mock evidence files
  const evidenceFiles = ['evidence_photo_1.jpg', 'evidence_photo_2.jpg', 'inspection_report.pdf'];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="icon-button">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="page-title">{ncr.id}</h1>
            <StatusBadge status={ncr.status} />
            <SeverityBadge severity={ncr.severity} />
          </div>
          <p className="page-subtitle">{ncr.title}</p>
        </div>
        <button onClick={handleDownloadPDF} className="action-button action-button-outline">
          <Download className="h-4 w-4" />
          Download PDF
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors',
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-card border border-border rounded-lg p-6">
        {activeTab === 'details' && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="font-semibold border-b border-border pb-2">Basic Information</h3>
                <div className="grid gap-4">
                  <div><p className="text-sm text-muted-foreground">NCR ID</p><p className="font-medium">{ncr.id}</p></div>
                  <div><p className="text-sm text-muted-foreground">Category</p><p className="font-medium">{ncr.category}</p></div>
                  <div><p className="text-sm text-muted-foreground">Reported By</p><p className="font-medium">{ncr.isConfidential ? 'Confidential' : ncr.reportedBy}</p></div>
                  <div><p className="text-sm text-muted-foreground">Reported Date</p><p className="font-medium">{ncr.reportedDate}</p></div>
                  {ncr.dueDate && <div><p className="text-sm text-muted-foreground">Due Date</p><p className="font-medium">{ncr.dueDate}</p></div>}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold border-b border-border pb-2">Location & Assignment</h3>
                <div className="grid gap-4">
                  <div><p className="text-sm text-muted-foreground">Site</p><p className="font-medium">{ncr.site}</p></div>
                  <div><p className="text-sm text-muted-foreground">Location</p><p className="font-medium">{ncr.location}</p></div>
                  {ncr.gpsCoordinates && (
                    <div><p className="text-sm text-muted-foreground">GPS Coordinates</p><p className="font-medium">{ncr.gpsCoordinates.lat}, {ncr.gpsCoordinates.lng}</p></div>
                  )}
                  {ncr.assignedInvestigator && (
                    <div><p className="text-sm text-muted-foreground">Assigned Investigator</p><p className="font-medium">{ncr.assignedInvestigator}</p></div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold border-b border-border pb-2 mb-4">Description</h3>
              <p className="text-foreground">{ncr.description}</p>
            </div>
            {ncr.hazardType && (
              <div>
                <p className="text-sm text-muted-foreground">Hazard Type</p>
                <p className="font-medium">{ncr.hazardType}</p>
              </div>
            )}
            {ncr.requirementReference && (
              <div>
                <p className="text-sm text-muted-foreground">Requirement Reference</p>
                <p className="font-medium">{ncr.requirementReference}</p>
              </div>
            )}
            {ncr.containmentActions && (
              <div>
                <h3 className="font-semibold border-b border-border pb-2 mb-4">Containment Actions</h3>
                <p className="text-foreground">{ncr.containmentActions}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'evidence' && (
          <div className="space-y-4">
            <h3 className="font-semibold">Evidence Files</h3>
            <div className="grid gap-4 md:grid-cols-3">
              {evidenceFiles.map((file, idx) => (
                <div key={idx} className="p-4 border border-border rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">{file}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setEvidenceModal(file)} className="icon-button text-muted-foreground hover:text-info">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button onClick={() => toast({ title: 'Download', description: `${file} downloaded.` })} className="icon-button text-muted-foreground hover:text-primary">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {evidenceFiles.length === 0 && (
              <p className="text-muted-foreground">No evidence files attached.</p>
            )}
          </div>
        )}

        {activeTab === 'rca' && (
          <div className="space-y-4">
            <h3 className="font-semibold">Root Cause Analysis</h3>
            {ncrRCAs.length === 0 ? (
              <p className="text-muted-foreground">No RCA records found.</p>
            ) : (
              ncrRCAs.map(rca => (
                <div key={rca.id} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{rca.id} - {rca.type}</span>
                    <span className={cn('status-badge', rca.status === 'Approved' ? 'status-validated' : 'status-submitted')}>
                      {rca.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Created by {rca.createdBy} on {rca.createdDate}</p>
                  {rca.conclusion && <p className="text-sm"><strong>Conclusion:</strong> {rca.conclusion}</p>}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'capa' && (
          <div className="space-y-4">
            <h3 className="font-semibold">Corrective & Preventive Actions</h3>
            {ncrCAPAs.length === 0 ? (
              <p className="text-muted-foreground">No CAPA records found.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>CAPA ID</th>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Assigned To</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ncrCAPAs.map(capa => (
                    <tr key={capa.id}>
                      <td className="font-medium">{capa.id}</td>
                      <td>{capa.title}</td>
                      <td>{capa.type}</td>
                      <td>{capa.assignedTo}</td>
                      <td>{capa.dueDate}</td>
                      <td><CAPAStatusBadge status={capa.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'verification' && (
          <div className="space-y-4">
            <h3 className="font-semibold">Verification Records</h3>
            {ncrVerifications.length === 0 ? (
              <p className="text-muted-foreground">No verification records found.</p>
            ) : (
              ncrVerifications.map(ver => (
                <div key={ver.id} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{ver.id}</span>
                    <span className={cn(
                      'status-badge',
                      ver.effectivenessRating === 'Effective' ? 'bg-success/10 text-success' :
                      ver.effectivenessRating === 'Partially Effective' ? 'bg-warning/10 text-warning' :
                      'bg-destructive/10 text-destructive'
                    )}>
                      {ver.effectivenessRating}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Verified by {ver.verifier} on {ver.verificationDate}</p>
                  <p className="text-sm">{ver.comments}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-4">
            <h3 className="font-semibold">Audit Trail</h3>
            <div className="space-y-3">
              {ncr.timeline.map((event, idx) => (
                <div key={event.id} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    {idx < ncr.timeline.length - 1 && <div className="w-px h-8 bg-border" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-medium text-foreground">{event.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.user} &bull; {event.timestamp.split('T')[0]}
                    </p>
                    {event.details && <p className="text-sm mt-1">{event.details}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Evidence Preview Modal */}
      <Modal isOpen={!!evidenceModal} onClose={() => setEvidenceModal(null)} title="Evidence Preview" size="lg">
        <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
          <div className="text-center">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="font-medium">{evidenceModal}</p>
            <p className="text-sm text-muted-foreground mt-2">Preview not available for this file type</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
