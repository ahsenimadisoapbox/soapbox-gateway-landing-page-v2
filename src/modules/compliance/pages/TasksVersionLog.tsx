import { Eye, GitCommit } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { FilterSearch } from "../components/FilterSearch";
import { Card, CardContent } from "../components/ui/card";

const TasksVersionLog = () => {
  const versions = [
    { id: "TVL-001", taskId: "TSK-001", version: 3, changeType: "UPDATE", changedBy: "john.smith@company.com", changedAt: "2024-12-01 14:30", reason: "Updated due date" },
    { id: "TVL-002", taskId: "TSK-001", version: 2, changeType: "UPDATE", changedBy: "admin@company.com", changedAt: "2024-11-15 10:00", reason: "Changed priority" },
    { id: "TVL-003", taskId: "TSK-001", version: 1, changeType: "CREATE", changedBy: "admin@company.com", changedAt: "2024-11-01 09:00", reason: "Initial creation" },
    { id: "TVL-004", taskId: "TSK-002", version: 2, changeType: "UPDATE", changedBy: "sarah.johnson@company.com", changedAt: "2024-12-05 16:45", reason: "Status change to overdue" },
  ];

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case "CREATE": return "bg-green-100 text-green-800";
      case "UPDATE": return "bg-blue-100 text-blue-800";
      case "DELETE": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filterGroups = [{ label: "Change Type", options: [{ label: "Create", value: "CREATE", checked: false }, { label: "Update", value: "UPDATE", checked: false }, { label: "Delete", value: "DELETE", checked: false }] }];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Task Version History</h1>
        <p className="text-muted-foreground">Full version timeline with snapshot comparisons</p>
      </div>
      <Card><CardContent className="pt-6"><FilterSearch searchPlaceholder="Search versions..." filterGroups={filterGroups} /></CardContent></Card>
      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Change Type</TableHead>
              <TableHead>Changed By</TableHead>
              <TableHead>Changed At</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {versions.map((v) => (
              <TableRow key={v.id}>
                <TableCell className="font-medium">{v.id}</TableCell>
                <TableCell><Badge variant="outline">{v.taskId}</Badge></TableCell>
                <TableCell><div className="flex items-center gap-1"><GitCommit className="w-3 h-3" />v{v.version}</div></TableCell>
                <TableCell><Badge className={getChangeTypeColor(v.changeType)}>{v.changeType}</Badge></TableCell>
                <TableCell>{v.changedBy.split("@")[0]}</TableCell>
                <TableCell>{v.changedAt}</TableCell>
                <TableCell className="max-w-[200px] truncate">{v.reason}</TableCell>
                <TableCell className="text-right"><Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TasksVersionLog;
