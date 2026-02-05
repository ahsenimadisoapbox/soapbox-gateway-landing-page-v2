import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Edit, Trash2, Plus, Building, MapPin } from "lucide-react";
import { toast } from "sonner";

const Organization = () => {
  // Mock organization data
  const sites = [
    { id: "SITE-001", name: "Headquarters", address: "123 Main St, City, State 12345", type: "Office", inspections: 45, status: "Active" },
    { id: "SITE-002", name: "Manufacturing Plant", address: "456 Industrial Blvd, City, State 12346", type: "Production", inspections: 78, status: "Active" },
    { id: "SITE-003", name: "Warehouse", address: "789 Storage Ave, City, State 12347", type: "Storage", inspections: 23, status: "Active" },
    { id: "SITE-004", name: "Office Building", address: "321 Business Rd, City, State 12348", type: "Office", inspections: 12, status: "Active" },
  ];

  const departments = [
    { id: "DEPT-001", name: "EHS Department", site: "Headquarters", head: "Jennifer Walsh", employees: 12 },
    { id: "DEPT-002", name: "Production", site: "Manufacturing Plant", head: "Mike Rodriguez", employees: 145 },
    { id: "DEPT-003", name: "Quality Assurance", site: "Manufacturing Plant", head: "Sarah Chen", employees: 24 },
    { id: "DEPT-004", name: "Warehouse Operations", site: "Warehouse", head: "David Kim", employees: 18 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Organization Management</h1>
        <p className="text-muted-foreground">Configure sites, departments, and organizational structure</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Sites & Locations</CardTitle>
              <CardDescription>Physical locations where inspections are conducted</CardDescription>
            </div>
            <Button onClick={() => toast.info("Add Site dialog opening...")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Site
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {sites.map((site) => (
              <Card key={site.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Building className="h-8 w-8 text-primary" />
                    <Badge variant="outline" className="border-success text-success bg-success/10">
                      {site.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-2">{site.name}</CardTitle>
                  <CardDescription className="text-xs">{site.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-muted-foreground">{site.address}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2">
                    <span className="text-muted-foreground">Type:</span>
                    <Badge variant="outline">{site.type}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Inspections:</span>
                    <span className="font-medium">{site.inspections}</span>
                  </div>
                  <div className="flex gap-1 pt-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.info(`Editing site: ${site.name}`)}>
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => {
                      if (confirm(`Delete site ${site.name}?`)) {
                        toast.success(`Site ${site.name} deleted`);
                      }
                    }}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Departments</CardTitle>
              <CardDescription>Organizational units within sites</CardDescription>
            </div>
            <Button onClick={() => toast.info("Add Department dialog opening...")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Department Head</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell className="font-medium">{dept.id}</TableCell>
                  <TableCell>{dept.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{dept.site}</Badge>
                  </TableCell>
                  <TableCell>{dept.head}</TableCell>
                  <TableCell>{dept.employees}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => toast.info(`Editing department: ${dept.name}`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => {
                        if (confirm(`Delete department ${dept.name}?`)) {
                          toast.success(`Department ${dept.name} deleted`);
                        }
                      }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Organization;
