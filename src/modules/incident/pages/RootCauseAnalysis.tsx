import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Plus, FileText, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { mockIncidents } from "../lib/mockData";

interface RCARecord {
  id: string;
  incidentId: string;
  incidentTitle: string;
  method: "5-Whys" | "Fishbone";
  rootCause: string;
  contributingFactors: string[];
  correctiveActions: string[];
  preventiveActions: string[];
  status: "Draft" | "Completed";
  createdBy: string;
  createdDate: string;
}

export default function RootCauseAnalysis() {
  const [rcaRecords, setRcaRecords] = useState<RCARecord[]>([
    {
      id: "RCA-001",
      incidentId: "INC-2024-003",
      incidentTitle: "Chemical Spill in Lab 4",
      method: "5-Whys",
      rootCause: "Improper handling of chemical container",
      contributingFactors: ["Lack of training", "Inadequate supervision"],
      correctiveActions: ["Retrain staff", "Review procedures"],
      preventiveActions: ["Implement buddy system", "Monthly safety audits"],
      status: "Completed",
      createdBy: "Sarah Chen",
      createdDate: "2024-01-13",
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [fiveWhysOpen, setFiveWhysOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState("");
  const [whys, setWhys] = useState(["", "", "", "", ""]);
  const [rootCause, setRootCause] = useState("");
  const [correctiveActions, setCorrectiveActions] = useState("");
  const [preventiveActions, setPreventiveActions] = useState("");

  const handleCreate5Whys = () => {
    if (!selectedIncident) {
      toast.error("Please select an incident");
      return;
    }

    const incident = mockIncidents.find(i => i.id === selectedIncident);
    const newRCA: RCARecord = {
      id: `RCA-${String(rcaRecords.length + 1).padStart(3, '0')}`,
      incidentId: selectedIncident,
      incidentTitle: incident?.title || "",
      method: "5-Whys",
      rootCause: whys[4] || "Root cause identified",
      contributingFactors: whys.filter(w => w).slice(0, 4),
      correctiveActions: correctiveActions.split('\n').filter(a => a),
      preventiveActions: preventiveActions.split('\n').filter(a => a),
      status: "Completed",
      createdBy: "Current User",
      createdDate: new Date().toISOString().split('T')[0],
    };

    setRcaRecords([...rcaRecords, newRCA]);
    toast.success("5 Whys analysis completed");
    setFiveWhysOpen(false);
    resetForm();
  };

  const handleCreateFishbone = () => {
    if (!selectedIncident || !rootCause) {
      toast.error("Please fill in required fields");
      return;
    }

    const incident = mockIncidents.find(i => i.id === selectedIncident);
    const newRCA: RCARecord = {
      id: `RCA-${String(rcaRecords.length + 1).padStart(3, '0')}`,
      incidentId: selectedIncident,
      incidentTitle: incident?.title || "",
      method: "Fishbone",
      rootCause,
      contributingFactors: [],
      correctiveActions: correctiveActions.split('\n').filter(a => a),
      preventiveActions: preventiveActions.split('\n').filter(a => a),
      status: "Completed",
      createdBy: "Current User",
      createdDate: new Date().toISOString().split('T')[0],
    };

    setRcaRecords([...rcaRecords, newRCA]);
    toast.success("Fishbone analysis completed");
    setDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedIncident("");
    setWhys(["", "", "", "", ""]);
    setRootCause("");
    setCorrectiveActions("");
    setPreventiveActions("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Root Cause Analysis</h1>
          <p className="text-muted-foreground">Conduct RCA using 5 Whys or Fishbone diagrams</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={fiveWhysOpen} onOpenChange={setFiveWhysOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                5 Whys Analysis
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>5 Whys Analysis</DialogTitle>
                <DialogDescription>Ask "Why?" five times to identify root cause</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Incident *</Label>
                  <Select value={selectedIncident} onValueChange={setSelectedIncident}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose incident" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {mockIncidents.map(inc => (
                        <SelectItem key={inc.id} value={inc.id}>
                          {inc.id} - {inc.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {whys.map((why, index) => (
                  <div key={index} className="space-y-2">
                    <Label>Why #{index + 1}?</Label>
                    <Textarea
                      value={why}
                      onChange={(e) => {
                        const newWhys = [...whys];
                        newWhys[index] = e.target.value;
                        setWhys(newWhys);
                      }}
                      placeholder={`Answer to why #${index + 1}`}
                      rows={2}
                    />
                  </div>
                ))}
                <div className="space-y-2">
                  <Label>Corrective Actions</Label>
                  <Textarea
                    value={correctiveActions}
                    onChange={(e) => setCorrectiveActions(e.target.value)}
                    placeholder="List corrective actions (one per line)"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Preventive Actions</Label>
                  <Textarea
                    value={preventiveActions}
                    onChange={(e) => setPreventiveActions(e.target.value)}
                    placeholder="List preventive actions (one per line)"
                    rows={3}
                  />
                </div>
                <Button onClick={handleCreate5Whys} className="w-full">
                  Complete Analysis
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Fishbone Diagram
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card max-w-2xl">
              <DialogHeader>
                <DialogTitle>Fishbone Diagram Analysis</DialogTitle>
                <DialogDescription>Identify root cause using Ishikawa diagram</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Incident *</Label>
                  <Select value={selectedIncident} onValueChange={setSelectedIncident}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose incident" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {mockIncidents.map(inc => (
                        <SelectItem key={inc.id} value={inc.id}>
                          {inc.id} - {inc.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Root Cause *</Label>
                  <Textarea
                    value={rootCause}
                    onChange={(e) => setRootCause(e.target.value)}
                    placeholder="Describe the root cause"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Corrective Actions</Label>
                  <Textarea
                    value={correctiveActions}
                    onChange={(e) => setCorrectiveActions(e.target.value)}
                    placeholder="List corrective actions (one per line)"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Preventive Actions</Label>
                  <Textarea
                    value={preventiveActions}
                    onChange={(e) => setPreventiveActions(e.target.value)}
                    placeholder="List preventive actions (one per line)"
                    rows={3}
                  />
                </div>
                <Button onClick={handleCreateFishbone} className="w-full">
                  Complete Analysis
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* RCA Records */}
      <div className="grid gap-6">
        {rcaRecords.map((rca) => (
          <Card key={rca.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{rca.id} - {rca.incidentTitle}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge>{rca.method}</Badge>
                    <Badge variant={rca.status === "Completed" ? "default" : "outline"}>
                      {rca.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>{rca.createdBy}</p>
                  <p>{new Date(rca.createdDate).toLocaleDateString()}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="findings">
                <TabsList>
                  <TabsTrigger value="findings">Findings</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>
                <TabsContent value="findings" className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Root Cause</h4>
                    <p className="text-sm text-muted-foreground">{rca.rootCause}</p>
                  </div>
                  {rca.contributingFactors.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Contributing Factors</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {rca.contributingFactors.map((factor, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground">{factor}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="actions" className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Corrective Actions</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {rca.correctiveActions.map((action, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground">{action}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Preventive Actions</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {rca.preventiveActions.map((action, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground">{action}</li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>

      {rcaRecords.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No RCA records yet</p>
            <p className="text-sm text-muted-foreground">
              Start by creating a 5 Whys or Fishbone analysis
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
