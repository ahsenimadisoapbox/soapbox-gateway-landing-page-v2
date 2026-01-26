import { Upload, FileText, Image, File } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useState } from "react";
import { EvidenceDialog } from "../components/evidence/EvidenceDialog";

type Evidence = {
  id: string;
  name: string;
  type: string;
  obligation: string;
  uploadedBy: string;
  uploadedDate: string;
  status: string;
};

const Evidence = () => {
  const [dialogState, setDialogState] = useState<{
    mode: "view" | "upload" | null;
    evidence: Evidence | null;
    open: boolean;
  }>({
    mode: null,
    evidence: null,
    open: false,
  });

  const evidenceItems: Evidence[] = [
    {
      id: "EV-2024-001",
      name: "GDPR DPIA Report 2024",
      type: "PDF",
      obligation: "OBL-2024-001",
      uploadedBy: "Sarah Johnson",
      uploadedDate: "2024-10-15",
      status: "verified",
    },
    {
      id: "EV-2024-002",
      name: "ISO 27001 Audit Certificate",
      type: "PDF",
      obligation: "OBL-2024-002",
      uploadedBy: "Mike Rodriguez",
      uploadedDate: "2024-10-10",
      status: "verified",
    },
    {
      id: "EV-2024-003",
      name: "Financial Controls Documentation",
      type: "DOCX",
      obligation: "OBL-2024-003",
      uploadedBy: "Jennifer Walsh",
      uploadedDate: "2024-10-05",
      status: "pending",
    },
  ];

  const getFileIcon = (type: string) => {
    if (type === "PDF") return FileText;
    if (type === "IMAGE") return Image;
    return File;
  };

  const handleUploadClick = () => {
    setDialogState({ mode: "upload", evidence: null, open: true });
  };

  const handleViewClick = (item: Evidence) => {
    setDialogState({ mode: "view", evidence: item, open: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Evidence</h1>
          <p className="text-muted-foreground">Manage compliance evidence and documentation</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={handleUploadClick}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Evidence
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {evidenceItems.map((item) => {
          const FileIcon = getFileIcon(item.type);
          return (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">{item.name}</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {item.id} • {item.type}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="text-muted-foreground">Linked to: {item.obligation}</p>
                  <p className="text-muted-foreground">
                    Uploaded by {item.uploadedBy} on {item.uploadedDate}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className={
                      item.status === "verified"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                    }
                  >
                    {item.status}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => handleViewClick(item)}>
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <EvidenceDialog
        mode={dialogState.mode}
        evidence={dialogState.evidence}
        open={dialogState.open}
        onOpenChange={(open) => setDialogState({ ...dialogState, open })}
      />
    </div>
  );
};

export default Evidence;
