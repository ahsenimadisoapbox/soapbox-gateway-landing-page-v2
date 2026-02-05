import { useState } from 'react';
import { useNCR } from '../context/NCRContext';
import { Modal } from '../components/shared/Modal';
import { StatusBadge, SeverityBadge } from '../components/shared/StatusBadge';
import { toast } from '../hooks/use-toast';
import { Eye, Plus, Save, Send, Trash2 } from 'lucide-react';
import { RCA, WhyItem, FishboneData } from '../types/ncr';
import { cn } from '../lib/utils';

export default function RCAWorkspace() {
  const { ncrs, rcas, addRCA, updateRCA, currentUser } = useNCR();
  const [selectedNCR, setSelectedNCR] = useState('');
  const [activeTab, setActiveTab] = useState<'5-Whys' | 'Fishbone'>('5-Whys');
  const [viewModal, setViewModal] = useState<RCA | null>(null);
  
  // 5-Whys State
  const [whys, setWhys] = useState<WhyItem[]>([{ level: 1, question: '', answer: '' }]);
  const [conclusion5Whys, setConclusion5Whys] = useState('');
  
  // Fishbone State
  const [fishbone, setFishbone] = useState<FishboneData>({
    problem: '',
    categories: [
      { name: 'Equipment', causes: [''] },
      { name: 'Process', causes: [''] },
      { name: 'People', causes: [''] },
      { name: 'Environment', causes: [''] },
      { name: 'Materials', causes: [''] },
      { name: 'Management', causes: [''] },
    ],
  });
  const [conclusionFishbone, setConclusionFishbone] = useState('');

  const investigatingNCRs = ncrs.filter(n => 
    n.status === 'Under Investigation' || n.status === 'Validated'
  );

  const addWhy = () => {
    if (whys.length < 7) {
      setWhys([...whys, { level: whys.length + 1, question: '', answer: '' }]);
    }
  };

  const removeWhy = (index: number) => {
    if (whys.length > 1) {
      const newWhys = whys.filter((_, i) => i !== index).map((w, i) => ({ ...w, level: i + 1 }));
      setWhys(newWhys);
    }
  };

  const updateWhy = (index: number, field: 'question' | 'answer', value: string) => {
    const newWhys = [...whys];
    newWhys[index][field] = value;
    setWhys(newWhys);
  };

  const addCause = (categoryIndex: number) => {
    const newFishbone = { ...fishbone };
    newFishbone.categories[categoryIndex].causes.push('');
    setFishbone(newFishbone);
  };

  const updateCause = (categoryIndex: number, causeIndex: number, value: string) => {
    const newFishbone = { ...fishbone };
    newFishbone.categories[categoryIndex].causes[causeIndex] = value;
    setFishbone(newFishbone);
  };

  const removeCause = (categoryIndex: number, causeIndex: number) => {
    const newFishbone = { ...fishbone };
    if (newFishbone.categories[categoryIndex].causes.length > 1) {
      newFishbone.categories[categoryIndex].causes.splice(causeIndex, 1);
      setFishbone(newFishbone);
    }
  };

  const handleSaveDraft = () => {
    if (!selectedNCR) {
      toast({ title: 'Error', description: 'Please select an NCR.', variant: 'destructive' });
      return;
    }

    const rca: RCA = {
      id: `RCA-${Date.now()}`,
      ncrId: selectedNCR,
      type: activeTab,
      status: 'Draft',
      createdBy: currentUser.name,
      createdDate: new Date().toISOString().split('T')[0],
      ...(activeTab === '5-Whys' ? { whys, conclusion: conclusion5Whys } : { fishbone, conclusion: conclusionFishbone }),
    };

    addRCA(rca);
    toast({ title: 'RCA Draft Saved', description: 'Your RCA has been saved as draft.' });
  };

  const handleSubmitRCA = () => {
    if (!selectedNCR) {
      toast({ title: 'Error', description: 'Please select an NCR.', variant: 'destructive' });
      return;
    }

    const selectedNCRData = ncrs.find(n => n.id === selectedNCR);
    const minDepth = selectedNCRData?.severity === 'Critical' ? 5 : selectedNCRData?.severity === 'Major' ? 3 : 2;

    if (activeTab === '5-Whys' && whys.filter(w => w.answer).length < minDepth) {
      toast({ 
        title: 'Insufficient Analysis', 
        description: `${selectedNCRData?.severity} severity requires at least ${minDepth} levels of analysis.`, 
        variant: 'destructive' 
      });
      return;
    }

    const rca: RCA = {
      id: `RCA-${Date.now()}`,
      ncrId: selectedNCR,
      type: activeTab,
      status: 'Submitted',
      createdBy: currentUser.name,
      createdDate: new Date().toISOString().split('T')[0],
      ...(activeTab === '5-Whys' ? { whys, conclusion: conclusion5Whys } : { fishbone, conclusion: conclusionFishbone }),
    };

    addRCA(rca);
    toast({ title: 'RCA Submitted', description: 'Your RCA has been submitted for approval.' });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">RCA Workspace</h1>
          <p className="page-subtitle">Root Cause Analysis tools</p>
        </div>
      </div>

      {/* NCR Selection */}
      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <label className="block text-sm font-medium mb-2">Select NCR for Analysis</label>
        <select
          value={selectedNCR}
          onChange={(e) => setSelectedNCR(e.target.value)}
          className="w-full md:w-96 px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
        >
          <option value="">Select an NCR</option>
          {investigatingNCRs.map(ncr => (
            <option key={ncr.id} value={ncr.id}>
              {ncr.id} - {ncr.title} ({ncr.severity})
            </option>
          ))}
        </select>
      </div>

      {/* RCA Type Tabs */}
      <div className="border-b border-border mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('5-Whys')}
            className={cn('tab-button', activeTab === '5-Whys' ? 'tab-button-active' : 'tab-button-inactive')}
          >
            5-Whys Analysis
          </button>
          <button
            onClick={() => setActiveTab('Fishbone')}
            className={cn('tab-button', activeTab === 'Fishbone' ? 'tab-button-active' : 'tab-button-inactive')}
          >
            Fishbone Diagram
          </button>
        </div>
      </div>

      {/* 5-Whys Tab */}
      {activeTab === '5-Whys' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-4">5-Whys Root Cause Analysis</h3>
            <div className="space-y-4">
              {whys.map((why, index) => (
                <div key={index} className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Why #{why.level}</span>
                    {whys.length > 1 && (
                      <button onClick={() => removeWhy(index)} className="icon-button text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={why.question}
                      onChange={(e) => updateWhy(index, 'question', e.target.value)}
                      placeholder="Why did this happen?"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
                    />
                    <textarea
                      value={why.answer}
                      onChange={(e) => updateWhy(index, 'answer', e.target.value)}
                      placeholder="Answer..."
                      rows={2}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
              ))}
              <button onClick={addWhy} className="action-button action-button-outline w-full" disabled={whys.length >= 7}>
                <Plus className="h-4 w-4" />
                Add Why
              </button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Root Cause Conclusion</h3>
            <textarea
              value={conclusion5Whys}
              onChange={(e) => setConclusion5Whys(e.target.value)}
              placeholder="Summarize the root cause identified through this analysis..."
              rows={4}
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      )}

      {/* Fishbone Tab */}
      {activeTab === 'Fishbone' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Fishbone (Ishikawa) Diagram</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Problem Statement</label>
              <input
                type="text"
                value={fishbone.problem}
                onChange={(e) => setFishbone({ ...fishbone, problem: e.target.value })}
                placeholder="Describe the problem..."
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {fishbone.categories.map((category, catIndex) => (
                <div key={category.name} className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-3">{category.name}</h4>
                  <div className="space-y-2">
                    {category.causes.map((cause, causeIndex) => (
                      <div key={causeIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={cause}
                          onChange={(e) => updateCause(catIndex, causeIndex, e.target.value)}
                          placeholder="Potential cause..."
                          className="flex-1 px-3 py-1.5 text-sm border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
                        />
                        {category.causes.length > 1 && (
                          <button onClick={() => removeCause(catIndex, causeIndex)} className="icon-button text-muted-foreground hover:text-destructive p-1">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button onClick={() => addCause(catIndex)} className="text-xs text-primary hover:underline">
                      + Add cause
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Root Cause Conclusion</h3>
            <textarea
              value={conclusionFishbone}
              onChange={(e) => setConclusionFishbone(e.target.value)}
              placeholder="Summarize the root cause identified through this analysis..."
              rows={4}
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 mt-6">
        <button onClick={handleSaveDraft} className="action-button action-button-secondary">
          <Save className="h-4 w-4" />
          Save Draft
        </button>
        <button onClick={handleSubmitRCA} className="action-button action-button-primary">
          <Send className="h-4 w-4" />
          Submit RCA for Approval
        </button>
      </div>

      {/* Existing RCAs */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Existing RCAs</h2>
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>RCA ID</th>
                <th>NCR ID</th>
                <th>Type</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rcas.map(rca => (
                <tr key={rca.id}>
                  <td className="font-medium">{rca.id}</td>
                  <td>{rca.ncrId}</td>
                  <td>{rca.type}</td>
                  <td>
                    <span className={cn(
                      'status-badge',
                      rca.status === 'Draft' && 'status-draft',
                      rca.status === 'Submitted' && 'status-submitted',
                      rca.status === 'Approved' && 'status-validated',
                      rca.status === 'Rejected' && 'status-overdue',
                    )}>
                      {rca.status}
                    </span>
                  </td>
                  <td>{rca.createdBy}</td>
                  <td>{rca.createdDate}</td>
                  <td>
                    <button onClick={() => setViewModal(rca)} className="icon-button text-muted-foreground hover:text-info">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View RCA Modal */}
      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="RCA Details" size="lg">
        {viewModal && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div><p className="text-sm text-muted-foreground">RCA ID</p><p className="font-medium">{viewModal.id}</p></div>
              <div><p className="text-sm text-muted-foreground">NCR ID</p><p className="font-medium">{viewModal.ncrId}</p></div>
              <div><p className="text-sm text-muted-foreground">Type</p><p className="font-medium">{viewModal.type}</p></div>
              <div><p className="text-sm text-muted-foreground">Status</p><p className="font-medium">{viewModal.status}</p></div>
            </div>
            {viewModal.whys && (
              <div>
                <p className="text-sm font-medium mb-2">5-Whys Analysis</p>
                <div className="space-y-2">
                  {viewModal.whys.map((why, idx) => (
                    <div key={idx} className="p-2 bg-muted rounded">
                      <p className="text-sm font-medium">Why #{why.level}: {why.question}</p>
                      <p className="text-sm text-muted-foreground">{why.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {viewModal.fishbone && (
              <div>
                <p className="text-sm font-medium mb-2">Fishbone Analysis</p>
                <p className="text-sm mb-2">Problem: {viewModal.fishbone.problem}</p>
                <div className="grid gap-2 md:grid-cols-2">
                  {viewModal.fishbone.categories.map(cat => (
                    <div key={cat.name} className="p-2 bg-muted rounded">
                      <p className="text-sm font-medium">{cat.name}</p>
                      <ul className="text-sm text-muted-foreground">
                        {cat.causes.filter(c => c).map((c, i) => <li key={i}>- {c}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {viewModal.conclusion && (
              <div>
                <p className="text-sm font-medium mb-2">Conclusion</p>
                <p className="text-sm text-muted-foreground">{viewModal.conclusion}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
