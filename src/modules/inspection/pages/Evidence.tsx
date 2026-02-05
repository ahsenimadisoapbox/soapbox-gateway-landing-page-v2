import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Search, Filter, Download, Trash2, Image as ImageIcon, FileText, Video } from "lucide-react";

const Evidence = () => {
  // Mock evidence data
  const evidenceItems = [
    { id: "EV-001", type: "image", name: "fire_extinguisher_101.jpg", inspection: "INS-001", date: "2025-11-12", size: "2.4 MB", location: "Building A, 2F" },
    { id: "EV-002", type: "image", name: "emergency_exit_blocked.jpg", inspection: "INS-001", date: "2025-11-12", size: "1.8 MB", location: "Building A, 1F" },
    { id: "EV-003", type: "document", name: "training_records.pdf", inspection: "INS-002", date: "2025-11-10", size: "456 KB", location: "HR Department" },
    { id: "EV-004", type: "image", name: "waste_segregation.jpg", inspection: "INS-005", date: "2025-11-09", size: "3.1 MB", location: "Waste Area" },
    { id: "EV-005", type: "video", name: "safety_walkthrough.mp4", inspection: "INS-001", date: "2025-11-12", size: "45.2 MB", location: "Building A" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Evidence Library</h1>
          <p className="text-muted-foreground">Centralized repository of inspection evidence</p>
        </div>
        <Button>
          <ImageIcon className="h-4 w-4 mr-2" />
          Upload Evidence
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evidence Gallery</CardTitle>
          <CardDescription>Photos, videos, and documents from inspections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search evidence..." className="pl-9" />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {evidenceItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  {item.type === "image" && <ImageIcon className="h-16 w-16 text-muted-foreground" />}
                  {item.type === "video" && <Video className="h-16 w-16 text-muted-foreground" />}
                  {item.type === "document" && <FileText className="h-16 w-16 text-muted-foreground" />}
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="font-medium text-sm truncate flex-1">{item.name}</div>
                      <Badge variant="outline" className="ml-2">
                        {item.type}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Inspection: {item.inspection}</div>
                      <div>Date: {item.date}</div>
                      <div>Size: {item.size}</div>
                      <div>Location: {item.location}</div>
                    </div>
                    <div className="flex gap-1 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Evidence;
