import { useState } from "react";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { GenericFormDialog } from "../components/shared/GenericFormDialog";
import { FilterSearch } from "../components/FilterSearch";

const CAPA = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create">("view");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const items = [
    { id: "CAPA-2024-001", title: "Implement encryption on backup storage", linkedNC: "NC-2024-001", owner: "Michael Chen", dueDate: "2025-10-30", priority: "high", status: "in-progress" },
    { id: "CAPA-2024-002", title: "Complete access control documentation", linkedNC: "NC-2024-002", owner: "Emily Rodriguez", dueDate: "2025-11-15", priority: "medium", status: "planned" },
  ];

  const getPriorityColor = (p: string) => p === "critical" ? "bg-red-100 text-red-800" : p === "high" ? "bg-orange-100 text-orange-800" : "bg-yellow-100 text-yellow-800";
  const getStatusColor = (s: string) => s === "completed" ? "bg-green-100 text-green-800" : s === "in-progress" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800";

  const formFields = [
    { id: "title", label: "Title", type: "text" as const, value: selectedItem?.title },
    { id: "linkedNC", label: "Linked NC", type: "text" as const, value: selectedItem?.linkedNC },
    { id: "owner", label: "Owner", type: "text" as const, value: selectedItem?.owner },
    { id: "dueDate", label: "Due Date", type: "date" as const, value: selectedItem?.dueDate },
    { id: "priority", label: "Priority", type: "select" as const, value: selectedItem?.priority, options: ["low", "medium", "high", "critical"] },
  ];

  const filterGroups = [{ label: "Status", options: [{ label: "Planned", value: "planned", checked: false }] }];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-3xl font-bold">CAPA Management</h1><p className="text-muted-foreground">Corrective and Preventive Actions</p></div>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => { setDialogMode("create"); setDialogOpen(true); }}><Plus className="w-4 h-4 mr-2" />New CAPA</Button>
      </div>
      <Card><CardContent className="pt-6"><FilterSearch searchPlaceholder="Search CAPA..." filterGroups={filterGroups} /></CardContent></Card>
      <Card><CardHeader><CardTitle>All CAPA Items</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Title</TableHead><TableHead>Owner</TableHead><TableHead>Due Date</TableHead><TableHead>Priority</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader><TableBody>{items.map((item) => (<TableRow key={item.id}><TableCell className="font-medium">{item.id}</TableCell><TableCell>{item.title}</TableCell><TableCell>{item.owner}</TableCell><TableCell>{item.dueDate}</TableCell><TableCell><Badge variant="secondary" className={getPriorityColor(item.priority)}>{item.priority}</Badge></TableCell><TableCell><Badge variant="secondary" className={getStatusColor(item.status)}>{item.status}</Badge></TableCell><TableCell><div className="flex gap-2"><Button variant="ghost" size="icon" onClick={() => { setSelectedItem(item); setDialogMode("view"); setDialogOpen(true); }}><Eye className="w-4 h-4" /></Button><Button variant="ghost" size="icon" onClick={() => { setSelectedItem(item); setDialogMode("edit"); setDialogOpen(true); }}><Edit className="w-4 h-4" /></Button></div></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
      <GenericFormDialog open={dialogOpen} onOpenChange={setDialogOpen} title="CAPA" fields={formFields} mode={dialogMode} />
    </div>
  );
};

export default CAPA;
