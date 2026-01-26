import { useState } from "react";
import { Eye, Edit, Trash2, Plus, ChevronRight, ChevronDown, Link2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { FilterSearch } from "../components/FilterSearch";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";

type Clause = {
  id: string;
  regulationId: string;
  parentId: string | null;
  code: string;
  title: string;
  text: string;
  level: number;
  children?: Clause[];
  controlsCount: number;
  obligationsCount: number;
};

const ClauseTreeItem = ({ 
  clause, 
  onView, 
  onEdit 
}: { 
  clause: Clause; 
  onView: (c: Clause) => void; 
  onEdit: (c: Clause) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = clause.children && clause.children.length > 0;

  return (
    <div className="border-l-2 border-muted pl-4 ml-2">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center gap-2 py-2 hover:bg-muted/50 rounded px-2">
          {hasChildren ? (
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          ) : (
            <div className="w-6" />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">{clause.code}</Badge>
              <span className="font-medium">{clause.title}</span>
            </div>
            <p className="text-sm text-muted-foreground truncate max-w-[500px]">{clause.text}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">{clause.controlsCount} Controls</Badge>
            <Badge variant="secondary" className="text-xs">{clause.obligationsCount} Obligations</Badge>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onView(clause)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(clause)}>
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {hasChildren && (
          <CollapsibleContent>
            {clause.children?.map((child) => (
              <ClauseTreeItem key={child.id} clause={child} onView={onView} onEdit={onEdit} />
            ))}
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
};

const RegulationClauses = () => {
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create" | null>(null);
  const [selectedClause, setSelectedClause] = useState<Clause | null>(null);
  const [selectedRegulation, setSelectedRegulation] = useState<string>("REG-001");

  const clauses: Clause[] = [
    {
      id: "CL-001",
      regulationId: "REG-001",
      parentId: null,
      code: "Art.5.1",
      title: "Principles relating to processing",
      text: "Personal data shall be processed lawfully, fairly and in a transparent manner",
      level: 1,
      controlsCount: 5,
      obligationsCount: 3,
      children: [
        {
          id: "CL-002",
          regulationId: "REG-001",
          parentId: "CL-001",
          code: "Art.5.1(a)",
          title: "Lawfulness, fairness and transparency",
          text: "Processed lawfully, fairly and in a transparent manner in relation to the data subject",
          level: 2,
          controlsCount: 2,
          obligationsCount: 1,
          children: [
            {
              id: "CL-003",
              regulationId: "REG-001",
              parentId: "CL-002",
              code: "Art.5.1(a)(i)",
              title: "Lawful basis requirement",
              text: "Processing must have a valid legal basis under Article 6",
              level: 3,
              controlsCount: 1,
              obligationsCount: 1,
            },
          ],
        },
        {
          id: "CL-004",
          regulationId: "REG-001",
          parentId: "CL-001",
          code: "Art.5.1(b)",
          title: "Purpose limitation",
          text: "Collected for specified, explicit and legitimate purposes",
          level: 2,
          controlsCount: 2,
          obligationsCount: 2,
        },
        {
          id: "CL-005",
          regulationId: "REG-001",
          parentId: "CL-001",
          code: "Art.5.1(c)",
          title: "Data minimisation",
          text: "Adequate, relevant and limited to what is necessary",
          level: 2,
          controlsCount: 1,
          obligationsCount: 1,
        },
      ],
    },
    {
      id: "CL-006",
      regulationId: "REG-001",
      parentId: null,
      code: "Art.5.2",
      title: "Accountability",
      text: "The controller shall be responsible for, and be able to demonstrate compliance with",
      level: 1,
      controlsCount: 3,
      obligationsCount: 2,
    },
  ];

  const handleView = (clause: Clause) => {
    setSelectedClause(clause);
    setDialogMode("view");
  };

  const handleEdit = (clause: Clause) => {
    setSelectedClause(clause);
    setDialogMode("edit");
  };

  const handleCreate = () => {
    setSelectedClause(null);
    setDialogMode("create");
  };

  const filterGroups = [
    {
      label: "Level",
      options: [
        { label: "Level 1", value: "1", checked: false },
        { label: "Level 2", value: "2", checked: false },
        { label: "Level 3", value: "3", checked: false },
      ],
    },
  ];

  const isViewMode = dialogMode === "view";
  const dialogTitle = dialogMode === "create" ? "Create Clause" : dialogMode === "edit" ? "Edit Clause" : "Clause Details";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Regulation Clauses</h1>
          <p className="text-muted-foreground">Hierarchical clause explorer with nested structure</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Clause
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label>Regulation</Label>
              <Select value={selectedRegulation} onValueChange={setSelectedRegulation}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REG-001">GDPR Art.5 - Principles</SelectItem>
                  <SelectItem value="REG-002">GDPR Art.17 - Right to erasure</SelectItem>
                  <SelectItem value="REG-003">HIPAA 164.502 - Uses and disclosures</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <FilterSearch
              searchPlaceholder="Search clauses..."
              filterGroups={filterGroups}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">Total Clauses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Root Clauses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">14</div>
            <p className="text-xs text-muted-foreground">Linked Controls</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">10</div>
            <p className="text-xs text-muted-foreground">Linked Obligations</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clause Hierarchy</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            {clauses.map((clause) => (
              <ClauseTreeItem key={clause.id} clause={clause} onView={handleView} onEdit={handleEdit} />
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={dialogMode !== null} onOpenChange={(open) => !open && setDialogMode(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="mapping">Mappings</TabsTrigger>
              <TabsTrigger value="hierarchy">Hierarchy</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Clause Code</Label>
                  <Input id="code" defaultValue={selectedClause?.code} disabled={isViewMode} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Input id="level" type="number" defaultValue={selectedClause?.level} disabled={isViewMode} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" defaultValue={selectedClause?.title} disabled={isViewMode} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parent">Parent Clause</Label>
                {isViewMode ? (
                  <Input defaultValue={selectedClause?.parentId || "None (Root)"} disabled />
                ) : (
                  <Select defaultValue={selectedClause?.parentId || "none"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent clause" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Root Clause)</SelectItem>
                      <SelectItem value="CL-001">Art.5.1 - Principles</SelectItem>
                      <SelectItem value="CL-002">Art.5.1(a) - Lawfulness</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="text">Clause Text</Label>
                <Textarea id="text" defaultValue={selectedClause?.text} disabled={isViewMode} rows={6} />
              </div>
            </TabsContent>
            
            <TabsContent value="mapping" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Link2 className="w-4 h-4" /> Mapped Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">ACCESS_CONTROL_01</span>
                        <Button variant="ghost" size="sm">Remove</Button>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">DATA_ENCRYPTION_02</span>
                        <Button variant="ghost" size="sm">Remove</Button>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">+ Add Control Mapping</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Link2 className="w-4 h-4" /> Mapped Obligations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">OBL-2024-001</span>
                        <Button variant="ghost" size="sm">Remove</Button>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">+ Add Obligation Mapping</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="hierarchy" className="space-y-4 mt-4">
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">Hierarchy Path:</div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline">Regulation: GDPR Art.5</Badge>
                  <ChevronRight className="w-4 h-4" />
                  <Badge variant="outline">Art.5.1</Badge>
                  <ChevronRight className="w-4 h-4" />
                  <Badge>Art.5.1(a)</Badge>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogMode(null)}>
              {isViewMode ? "Close" : "Cancel"}
            </Button>
            {!isViewMode && (
              <Button type="submit">
                {dialogMode === "create" ? "Create" : "Save Changes"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegulationClauses;
