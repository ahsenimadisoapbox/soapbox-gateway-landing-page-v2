import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNCR } from '../context/NCRContext';
import { Category, Severity, NCR } from '../types/ncr';
import { sites, hazardTypes, requirementReferences } from '../data/mockData';
import { toast } from '../hooks/use-toast';
import { MapPin, Upload, Save, Send, ChevronRight, ChevronLeft } from 'lucide-react';

const categories: Category[] = [
  'Process Deviation',
  'Equipment Failure',
  'Documentation Error',
  'Training Gap',
  'Supplier Issue',
  'Environmental',
  'Safety Hazard',
  'Quality Control',
  'Regulatory Non-Compliance',
  'Other',
];

const severities: Severity[] = ['Critical', 'Major', 'Minor'];

export default function CreateNCR() {
  const navigate = useNavigate();
  const { addNCR, addDraftNCR, currentUser } = useNCR();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as Category | '',
    severity: '' as Severity | '',
    location: '',
    site: '',
    hazardType: '',
    requirementReference: '',
    witnesses: '',
    isConfidential: false,
    gpsLat: '',
    gpsLng: '',
    evidenceFiles: [] as string[],
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (stepNum: number): boolean => {
    switch (stepNum) {
      case 1:
        return !!formData.category && !!formData.severity;
      case 2:
        return !!formData.title && !!formData.description;
      case 3:
        return !!formData.location && !!formData.site;
      default:
        return true;
    }
  };

  const handleSaveAsDraft = () => {
    const draft: NCR = {
      id: `NCR-DRAFT-${Date.now()}`,
      title: formData.title || 'Untitled Draft',
      description: formData.description,
      category: (formData.category as Category) || 'Other',
      severity: (formData.severity as Severity) || 'Minor',
      status: 'Draft',
      reportedBy: currentUser.name,
      reportedDate: new Date().toISOString().split('T')[0],
      location: formData.location,
      site: formData.site || 'Plant A',
      hazardType: formData.hazardType,
      requirementReference: formData.requirementReference,
      witnesses: formData.witnesses ? formData.witnesses.split(',').map(w => w.trim()) : [],
      isConfidential: formData.isConfidential,
      gpsCoordinates: formData.gpsLat && formData.gpsLng
        ? { lat: parseFloat(formData.gpsLat), lng: parseFloat(formData.gpsLng) }
        : undefined,
      timeline: [
        { id: `t${Date.now()}`, action: 'Draft Created', user: currentUser.name, timestamp: new Date().toISOString() }
      ],
    };
    addDraftNCR(draft);
    toast({ title: 'Draft Saved', description: 'Your NCR draft has been saved.' });
    navigate('/drafts');
  };

  const handleSubmit = () => {
    if (!formData.category || !formData.severity || !formData.title || !formData.description || !formData.location || !formData.site) {
      toast({ title: 'Error', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }

    const ncr: NCR = {
      id: `NCR-2024-${String(Date.now()).slice(-3)}`,
      title: formData.title,
      description: formData.description,
      category: formData.category as Category,
      severity: formData.severity as Severity,
      status: 'Submitted',
      reportedBy: currentUser.name,
      reportedDate: new Date().toISOString().split('T')[0],
      location: formData.location,
      site: formData.site,
      hazardType: formData.hazardType,
      requirementReference: formData.requirementReference,
      witnesses: formData.witnesses ? formData.witnesses.split(',').map(w => w.trim()) : [],
      isConfidential: formData.isConfidential,
      gpsCoordinates: formData.gpsLat && formData.gpsLng
        ? { lat: parseFloat(formData.gpsLat), lng: parseFloat(formData.gpsLng) }
        : undefined,
      timeline: [
        { id: `t${Date.now()}`, action: 'NCR Created', user: currentUser.name, timestamp: new Date().toISOString() },
        { id: `t${Date.now() + 1}`, action: 'Submitted', user: currentUser.name, timestamp: new Date().toISOString() },
      ],
    };
    addNCR(ncr);
    toast({ title: 'NCR Submitted', description: `NCR ${ncr.id} has been submitted for review.` });
    navigate(`/ncr-detail/${ncr.id}`);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateField('gpsLat', position.coords.latitude.toFixed(6));
          updateField('gpsLng', position.coords.longitude.toFixed(6));
          toast({ title: 'Location Captured', description: 'GPS coordinates have been recorded.' });
        },
        () => {
          toast({ title: 'Error', description: 'Unable to get location.', variant: 'destructive' });
        }
      );
    }
  };

  const handleFileUpload = () => {
    const fileName = `evidence_${Date.now()}.jpg`;
    updateField('evidenceFiles', [...formData.evidenceFiles, fileName]);
    toast({ title: 'File Uploaded', description: `${fileName} has been attached.` });
  };

  return (
    <div className="page-container max-w-4xl mx-auto">
      <div className="page-header">
        <div>
          <h1 className="page-title">Create New NCR</h1>
          <p className="page-subtitle">Report a new non-compliance event</p>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="flex items-center justify-between mb-8">
        {['Classification', 'Details', 'Location', 'Evidence', 'Review'].map((label, idx) => (
          <div key={label} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step > idx + 1
                  ? 'bg-success text-success-foreground'
                  : step === idx + 1
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {idx + 1}
            </div>
            <span className={`ml-2 text-sm hidden md:inline ${step === idx + 1 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
              {label}
            </span>
            {idx < 4 && <div className="w-8 lg:w-16 h-px bg-border mx-2" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="form-section">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="form-section-title">Classification</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category <span className="text-destructive">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Severity <span className="text-destructive">*</span>
                </label>
                <select
                  value={formData.severity}
                  onChange={(e) => updateField('severity', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select severity</option>
                  {severities.map(sev => (
                    <option key={sev} value={sev}>{sev}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="confidential"
                checked={formData.isConfidential}
                onChange={(e) => updateField('isConfidential', e.target.checked)}
                className="rounded border-input"
              />
              <label htmlFor="confidential" className="text-sm text-foreground">
                Confidential Report (hide reporter identity)
              </label>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="form-section-title">Description & Evidence</h2>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Brief title for the non-compliance"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description <span className="text-destructive">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Detailed description of the non-compliance event"
                rows={4}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Hazard Type
                </label>
                <select
                  value={formData.hazardType}
                  onChange={(e) => updateField('hazardType', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select hazard type</option>
                  {hazardTypes.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Requirement Reference
                </label>
                <select
                  value={formData.requirementReference}
                  onChange={(e) => updateField('requirementReference', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select reference</option>
                  {requirementReferences.map(ref => (
                    <option key={ref} value={ref}>{ref}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Witnesses (comma-separated)
              </label>
              <input
                type="text"
                value={formData.witnesses}
                onChange={(e) => updateField('witnesses', e.target.value)}
                placeholder="John Doe, Jane Smith"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="form-section-title">Location Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Site <span className="text-destructive">*</span>
                </label>
                <select
                  value={formData.site}
                  onChange={(e) => updateField('site', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select site</option>
                  {sites.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Specific Location <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder="Building, floor, room, equipment"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                GPS Coordinates
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.gpsLat}
                  onChange={(e) => updateField('gpsLat', e.target.value)}
                  placeholder="Latitude"
                  className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring"
                />
                <input
                  type="text"
                  value={formData.gpsLng}
                  onChange={(e) => updateField('gpsLng', e.target.value)}
                  placeholder="Longitude"
                  className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="action-button action-button-outline"
                >
                  <MapPin className="h-4 w-4" />
                  Auto-GPS
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="form-section-title">Evidence Upload</h2>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-foreground font-medium mb-2">
                Drag and drop files here or click to browse
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Supports images, videos, and documents
              </p>
              <button
                type="button"
                onClick={handleFileUpload}
                className="action-button action-button-outline"
              >
                Upload Evidence
              </button>
            </div>
            {formData.evidenceFiles.length > 0 && (
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Uploaded Files:</p>
                <ul className="space-y-1">
                  {formData.evidenceFiles.map((file, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground">{file}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <h2 className="form-section-title">Review & Submit</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium text-foreground">{formData.category || '-'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Severity</p>
                <p className="font-medium text-foreground">{formData.severity || '-'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Title</p>
                <p className="font-medium text-foreground">{formData.title || '-'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Site</p>
                <p className="font-medium text-foreground">{formData.site || '-'}</p>
              </div>
              <div className="md:col-span-2 space-y-2">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium text-foreground">{formData.description || '-'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium text-foreground">{formData.location || '-'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Confidential</p>
                <p className="font-medium text-foreground">{formData.isConfidential ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <div>
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="action-button action-button-outline"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveAsDraft}
            className="action-button action-button-secondary"
          >
            <Save className="h-4 w-4" />
            Save as Draft
          </button>
          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={!validateStep(step)}
              className="action-button action-button-primary disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="action-button action-button-primary"
            >
              <Send className="h-4 w-4" />
              Submit NCR
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
