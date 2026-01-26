import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";

const ComplianceTasksDoc = () => {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">COMPLIANCE_TASKS</h1>
        <Badge variant="secondary">Task Management Table</Badge>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Purpose / Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>Stores all key information about tasks related to compliance obligations.</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Each obligation can have multiple tasks assigned to different users or groups for execution and tracking</li>
            <li>Tasks can have various statuses (OPEN, IN_PROGRESS, COMPLETED, OVERDUE), due dates, priorities, and severity levels</li>
            <li>Essential for managing compliance activities, assigning responsibilities, and tracking task completion</li>
            <li>Enables accountability through owner assignments and provides audit trails for compliance verification and reporting</li>
            <li>Helps maintain a record of all tasks, including their status, priority, and completion details for regulatory audits</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Fields & Meanings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-primary mb-2">Identifiers</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><code className="bg-muted px-1.5 py-0.5 rounded">TASK_ID</code> - Unique identifier for each task (Primary Key) [Not Null]</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">TENANT_ID</code> - Tenant ID to which this task belongs [Not Null, FK to TENANT_METADATA]</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">CORRELATION_ID</code> - ID to correlate with external systems or processes</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-2">Relationships</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><code className="bg-muted px-1.5 py-0.5 rounded">OBLIGATION_ID</code> - FK to COMPLIANCE_OBLIGATIONS table</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">CONTROL_MAP_ID</code> - FK to COMPLIANCE_OBLIGATION_CONTROL_MAPPING table</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">SITE_ID</code> - Site ID where task is applicable (FK to TENANT_SITES)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-2">Task Content</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><code className="bg-muted px-1.5 py-0.5 rounded">TITLE</code> - Title of the task [Not Null, max 4000 chars]</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">DESCRIPTION</code> - Detailed description of the task (CLOB)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-2">Ownership & Scheduling</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><code className="bg-muted px-1.5 py-0.5 rounded">OWNER_ID</code> - User email of responsible party (FK to USERS_METADATA)</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">DUE_DATE</code> - Due date for the task</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-2">Status & Priority</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><code className="bg-muted px-1.5 py-0.5 rounded">STATUS</code> - Task status: 'OPEN', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE' [Not Null]</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">SEVERITY</code> - Severity level: 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">ESCALATION_LEVEL</code> - Number of times the task has been escalated [Default: 0]</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-2">Version Control & Soft Delete</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><code className="bg-muted px-1.5 py-0.5 rounded">VERSION_NO</code> - Version number for tracking changes [Default: 1]</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">DELETED_FLAG</code> - 'Y' = Deleted, 'N' = Active [Default: 'N']</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-2">Audit Fields</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><code className="bg-muted px-1.5 py-0.5 rounded">CREATED_BY</code> - User email who created (FK to USERS_METADATA)</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">CREATED_AT</code> - Creation timestamp (auto-generated)</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">UPDATED_BY</code> - User email who last updated (FK to USERS_METADATA)</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">UPDATED_AT</code> - Last update timestamp</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Constraints</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Primary Key:</strong> TASK_ID</li>
            <li><strong>Not Null:</strong> TASK_ID, TENANT_ID, TITLE, STATUS</li>
            <li><strong>Check Constraints:</strong>
              <ul className="list-circle list-inside ml-6 mt-1">
                <li>DELETED_FLAG IN ('Y', 'N')</li>
              </ul>
            </li>
            <li><strong>Default Values:</strong>
              <ul className="list-circle list-inside ml-6 mt-1">
                <li>ESCALATION_LEVEL = 0</li>
                <li>VERSION_NO = 1</li>
                <li>DELETED_FLAG = 'N'</li>
                <li>CREATED_AT = SYSTIMESTAMP</li>
              </ul>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Foreign Key Relationships</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold mb-2">References TO:</h4>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>TENANT_METADATA (TENANT_ID) - Multi-tenancy support</li>
                <li>COMPLIANCE_OBLIGATIONS (OBLIGATION_ID) - Parent obligation</li>
                <li>COMPLIANCE_OBLIGATION_CONTROL_MAPPING (MAPPING_ID) - via CONTROL_MAP_ID</li>
                <li>TENANT_SITES (SITE_ID) - Site-specific tasks</li>
                <li>USERS_METADATA (USER_EMAIL) - via OWNER_ID (task owner)</li>
                <li>USERS_METADATA (USER_EMAIL) - via CREATED_BY</li>
                <li>USERS_METADATA (USER_EMAIL) - via UPDATED_BY</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Referenced BY:</h4>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Task execution logs</li>
                <li>Task comments/notes tables</li>
                <li>Task attachments/evidence tables</li>
                <li>Task history/audit tables</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Use Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Task Assignment:</strong> Assign compliance tasks to specific users with clear ownership</li>
            <li><strong>Deadline Management:</strong> Track due dates and identify overdue tasks</li>
            <li><strong>Status Tracking:</strong> Monitor task progress through lifecycle (OPEN → IN_PROGRESS → COMPLETED)</li>
            <li><strong>Escalation Management:</strong> Track and manage escalations for overdue or critical tasks</li>
            <li><strong>Multi-Site Support:</strong> Assign tasks to specific sites in multi-location organizations</li>
            <li><strong>Obligation Breakdown:</strong> Break down complex obligations into manageable tasks</li>
            <li><strong>Control Execution:</strong> Link tasks to specific control implementations</li>
            <li><strong>Priority Management:</strong> Prioritize work based on severity levels (LOW, MEDIUM, HIGH, CRITICAL)</li>
            <li><strong>External Integration:</strong> Correlate tasks with external systems via CORRELATION_ID</li>
            <li><strong>Audit Trail:</strong> Maintain complete history of task creation, updates, and completion</li>
            <li><strong>Workload Visibility:</strong> Generate reports on task distribution across users and sites</li>
            <li><strong>Soft Delete:</strong> Preserve historical data while marking tasks as deleted</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Example Records (Dummy Sample)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="border border-border p-2 text-left">TITLE</th>
                  <th className="border border-border p-2 text-left">OWNER</th>
                  <th className="border border-border p-2 text-left">STATUS</th>
                  <th className="border border-border p-2 text-left">SEVERITY</th>
                  <th className="border border-border p-2 text-left">DUE_DATE</th>
                  <th className="border border-border p-2 text-left">ESCALATION</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-2">Review data processing agreements</td>
                  <td className="border border-border p-2">john.doe@example.com</td>
                  <td className="border border-border p-2"><Badge variant="secondary">IN_PROGRESS</Badge></td>
                  <td className="border border-border p-2"><Badge variant="destructive">HIGH</Badge></td>
                  <td className="border border-border p-2">2025-01-15</td>
                  <td className="border border-border p-2">0</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">Conduct quarterly access review</td>
                  <td className="border border-border p-2">jane.smith@example.com</td>
                  <td className="border border-border p-2"><Badge variant="outline">OPEN</Badge></td>
                  <td className="border border-border p-2"><Badge variant="default">MEDIUM</Badge></td>
                  <td className="border border-border p-2">2025-01-20</td>
                  <td className="border border-border p-2">0</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">Update privacy policy</td>
                  <td className="border border-border p-2">legal@example.com</td>
                  <td className="border border-border p-2"><Badge variant="destructive">OVERDUE</Badge></td>
                  <td className="border border-border p-2"><Badge variant="destructive">CRITICAL</Badge></td>
                  <td className="border border-border p-2">2024-12-31</td>
                  <td className="border border-border p-2">2</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">Verify backup restoration process</td>
                  <td className="border border-border p-2">it.admin@example.com</td>
                  <td className="border border-border p-2"><Badge variant="default">COMPLETED</Badge></td>
                  <td className="border border-border p-2"><Badge variant="secondary">LOW</Badge></td>
                  <td className="border border-border p-2">2024-12-15</td>
                  <td className="border border-border p-2">0</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">Security awareness training completion</td>
                  <td className="border border-border p-2">hr@example.com</td>
                  <td className="border border-border p-2"><Badge variant="secondary">IN_PROGRESS</Badge></td>
                  <td className="border border-border p-2"><Badge variant="default">MEDIUM</Badge></td>
                  <td className="border border-border p-2">2025-01-30</td>
                  <td className="border border-border p-2">0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Diagram or Hierarchy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg font-mono text-sm">
            <pre>{`
COMPLIANCE_OBLIGATIONS (Parent)
    │
    └── COMPLIANCE_TASKS (This Table)
            ├── Linked to OBLIGATION_ID
            ├── Linked to CONTROL_MAP_ID
            └── Assigned to OWNER_ID

Task Lifecycle Flow:
    OPEN
      ↓
    IN_PROGRESS
      ↓
    COMPLETED  ←→  OVERDUE (if past DUE_DATE)

Escalation Pattern:
    Task Created (ESCALATION_LEVEL = 0)
      ↓
    First Escalation (ESCALATION_LEVEL = 1)
      ↓
    Second Escalation (ESCALATION_LEVEL = 2)
      ↓
    Critical Escalation (ESCALATION_LEVEL = 3+)

Multi-Tenant Structure:
    TENANT A
      ├── Site 1 → Tasks
      ├── Site 2 → Tasks
      └── Site 3 → Tasks
    
    TENANT B
      └── Site 1 → Tasks
            `}</pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes / Special Logic</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Multi-Tenant Isolation:</strong> TENANT_ID is mandatory, ensuring complete data isolation between tenants</li>
            <li><strong>Soft Delete Pattern:</strong> DELETED_FLAG enables "deletion" without losing historical data</li>
            <li><strong>Version Control:</strong> VERSION_NO tracks changes to tasks over time</li>
            <li><strong>Escalation Tracking:</strong> ESCALATION_LEVEL increments each time a task is escalated</li>
            <li><strong>Flexible Ownership:</strong> Tasks can be assigned to any user via OWNER_ID</li>
            <li><strong>Site-Specific Tasks:</strong> SITE_ID enables location-specific compliance task management</li>
            <li><strong>External Correlation:</strong> CORRELATION_ID supports integration with external task management systems</li>
            <li><strong>Status-Driven Workflows:</strong> Task statuses can trigger automated workflows and notifications</li>
            <li><strong>Overdue Detection:</strong> System can automatically flag tasks as OVERDUE based on DUE_DATE</li>
            <li><strong>Two-Way Linking:</strong> Tasks link both to obligations (what) and control mappings (how)</li>
            <li><strong>Audit Compliance:</strong> Complete audit trail supports regulatory examination requirements</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceTasksDoc;
