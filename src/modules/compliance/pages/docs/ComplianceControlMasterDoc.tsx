import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";

const ComplianceControlMasterDoc = () => {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">COMPLIANCE_CONTROL_MASTER</h1>
        <Badge variant="secondary">Control Repository Table</Badge>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Purpose / Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>Stores predefined controls for standardizing and to be extensible.</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Examples include: Access Control, Data Encryption, Audit Logging</li>
            <li>Some regulations may require specific controls to be implemented</li>
            <li>Ensures consistency by referencing controls from a master table</li>
            <li>Helps maintain a record of all controls, including their description and source table</li>
            <li>Essential for compliance with regulatory requirements and internal quality management processes</li>
            <li>Ensures all controls are documented and can be referenced for future audits or compliance checks</li>
            <li>Allows for tracking changes in controls over time</li>
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
                <li><code className="bg-muted px-1.5 py-0.5 rounded">CONTROL_ID</code> - Unique identifier for each control (Primary Key) [Not Null]</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">TENANT_ID</code> - Tenant ID to which this control belongs [Not Null, FK to TENANT_METADATA]</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">CONTROL_CODE</code> - Unique code (e.g., 'ACCESS_CONTROL', 'DATA_ENCRYPTION')</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">CONTROL_NAME</code> - Name of the control (e.g., 'ACCESS CONTROL', 'DATA ENCRYPTION')</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-2">Relationships</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><code className="bg-muted px-1.5 py-0.5 rounded">DOMAIN_ID</code> - FK to COMPLIANCE_DOMAIN table</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">CLAUSE_ID</code> - FK to COMPLIANCE_REGULATION_CLAUSES table</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-2">Control Details</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><code className="bg-muted px-1.5 py-0.5 rounded">REQUIREMENT_TEXT</code> - Detailed description of the control requirement (CLOB)</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">CONTROL_DESC</code> - Brief description of the control (max 4000 chars)</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">CONTROL_TYPE</code> - Type: 'TECHNICAL', 'ADMINISTRATIVE', 'PHYSICAL'</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-2">Severity & Scheduling</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><code className="bg-muted px-1.5 py-0.5 rounded">SEVERITY_NAME</code> - FK to SEVERITY_MASTER table</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">FREQUENCY</code> - Execution frequency: 'ONETIME', 'HOURLY', 'DAILY', 'WEEKLY', 'FORTNIGHTLY', 'ALTERNATE WEEKS', 'MONTHLY', 'QUATERLY', 'HALF-YEARLY', 'ANNUAL' [Default: 'WEEKLY']</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">MANDATORY_FLAG</code> - 'Y' = Mandatory, 'N' = Optional [Default: 'Y']</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-2">Ownership & Lifecycle</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><code className="bg-muted px-1.5 py-0.5 rounded">OWNER</code> - User email of responsible party (FK to USERS_METADATA)</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">EFFECTIVE_DATE</code> - When control takes effect</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">EXPIRY_DATE</code> - Optional expiry/retirement date</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-2">Audit Fields</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><code className="bg-muted px-1.5 py-0.5 rounded">CREATED_BY</code> - User email who created (FK to USERS_METADATA)</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">CREATED_AT</code> - Creation timestamp (auto-generated)</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">UPDATED_BY</code> - User email who last updated (FK to USERS_METADATA)</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">UPDATED_AT</code> - Last update timestamp (auto-generated)</li>
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
            <li><strong>Primary Key:</strong> CONTROL_ID</li>
            <li><strong>Not Null:</strong> TENANT_ID, CONTROL_ID</li>
            <li><strong>Check Constraints:</strong>
              <ul className="list-circle list-inside ml-6 mt-1">
                <li>FREQUENCY IN ('ONETIME','HOURLY','WEEKLY','DAILY','FORTNIGHTLY', 'ALTERNATE WEEKS','MONTHLY', 'QUATERLY', 'HALF-YEARLY', 'ANNUAL')</li>
                <li>MANDATORY_FLAG IN ('Y', 'N')</li>
              </ul>
            </li>
            <li><strong>Default Values:</strong>
              <ul className="list-circle list-inside ml-6 mt-1">
                <li>FREQUENCY = 'WEEKLY'</li>
                <li>MANDATORY_FLAG = 'Y'</li>
                <li>CREATED_AT = SYSTIMESTAMP</li>
                <li>UPDATED_AT = SYSTIMESTAMP</li>
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
                <li>COMPLIANCE_DOMAIN (DOMAIN_ID) - Associates control with compliance domain</li>
                <li>COMPLIANCE_REGULATION_CLAUSES (CLAUSE_ID) - Links control to specific regulation clause</li>
                <li>SEVERITY_MASTER (SEVERITY_NAME) - Control severity level</li>
                <li>USERS_METADATA (USER_EMAIL) - via OWNER (control owner)</li>
                <li>USERS_METADATA (USER_EMAIL) - via CREATED_BY</li>
                <li>USERS_METADATA (USER_EMAIL) - via UPDATED_BY</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Referenced BY:</h4>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>COMPLIANCE_OBLIGATION_CONTROL_MAPPING (CONTROL_ID)</li>
                <li>Assessment and audit tables</li>
                <li>Control execution and monitoring tables</li>
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
            <li><strong>Control Library Management:</strong> Maintain centralized repository of all compliance controls</li>
            <li><strong>Regulatory Mapping:</strong> Link controls to specific regulatory clauses for traceability</li>
            <li><strong>Control Scheduling:</strong> Define execution frequency for each control (daily, weekly, monthly, etc.)</li>
            <li><strong>Ownership Assignment:</strong> Assign responsibility for each control to specific users</li>
            <li><strong>Multi-Tenant Support:</strong> Isolate controls by tenant in multi-tenant environments</li>
            <li><strong>Control Categorization:</strong> Classify controls by type (technical, administrative, physical) and domain</li>
            <li><strong>Severity Management:</strong> Prioritize controls based on severity levels</li>
            <li><strong>Mandatory vs Optional:</strong> Flag controls as mandatory or optional for flexibility</li>
            <li><strong>Lifecycle Tracking:</strong> Track when controls become effective or expire</li>
            <li><strong>Audit Planning:</strong> Use control frequency and type to plan audit schedules</li>
            <li><strong>Compliance Dashboards:</strong> Report on control coverage and execution status</li>
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
                  <th className="border border-border p-2 text-left">CONTROL_CODE</th>
                  <th className="border border-border p-2 text-left">CONTROL_NAME</th>
                  <th className="border border-border p-2 text-left">CONTROL_TYPE</th>
                  <th className="border border-border p-2 text-left">FREQUENCY</th>
                  <th className="border border-border p-2 text-left">MANDATORY</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-2">ACCESS_CONTROL</td>
                  <td className="border border-border p-2">User Access Control</td>
                  <td className="border border-border p-2">TECHNICAL</td>
                  <td className="border border-border p-2">DAILY</td>
                  <td className="border border-border p-2"><Badge variant="destructive">Y</Badge></td>
                </tr>
                <tr>
                  <td className="border border-border p-2">DATA_ENCRYPTION</td>
                  <td className="border border-border p-2">Data Encryption at Rest</td>
                  <td className="border border-border p-2">TECHNICAL</td>
                  <td className="border border-border p-2">ONETIME</td>
                  <td className="border border-border p-2"><Badge variant="destructive">Y</Badge></td>
                </tr>
                <tr>
                  <td className="border border-border p-2">AUDIT_LOGGING</td>
                  <td className="border border-border p-2">Security Audit Logging</td>
                  <td className="border border-border p-2">TECHNICAL</td>
                  <td className="border border-border p-2">HOURLY</td>
                  <td className="border border-border p-2"><Badge variant="destructive">Y</Badge></td>
                </tr>
                <tr>
                  <td className="border border-border p-2">SECURITY_TRAINING</td>
                  <td className="border border-border p-2">Security Awareness Training</td>
                  <td className="border border-border p-2">ADMINISTRATIVE</td>
                  <td className="border border-border p-2">ANNUAL</td>
                  <td className="border border-border p-2"><Badge variant="destructive">Y</Badge></td>
                </tr>
                <tr>
                  <td className="border border-border p-2">PHYSICAL_ACCESS</td>
                  <td className="border border-border p-2">Physical Access Control</td>
                  <td className="border border-border p-2">PHYSICAL</td>
                  <td className="border border-border p-2">WEEKLY</td>
                  <td className="border border-border p-2"><Badge variant="destructive">Y</Badge></td>
                </tr>
                <tr>
                  <td className="border border-border p-2">BACKUP_VERIFY</td>
                  <td className="border border-border p-2">Backup Verification</td>
                  <td className="border border-border p-2">TECHNICAL</td>
                  <td className="border border-border p-2">MONTHLY</td>
                  <td className="border border-border p-2"><Badge variant="outline">N</Badge></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes / Special Logic</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Multi-Tenant Architecture:</strong> TENANT_ID is mandatory, enabling isolation in multi-tenant deployments</li>
            <li><strong>Control Types:</strong> Three types (TECHNICAL, ADMINISTRATIVE, PHYSICAL) cover all control categories</li>
            <li><strong>Flexible Frequency:</strong> Wide range of frequencies from ONETIME to ANNUAL supports various control execution patterns</li>
            <li><strong>Mandatory Flag:</strong> Allows differentiation between must-have and nice-to-have controls</li>
            <li><strong>Clause Linkage:</strong> Direct FK to COMPLIANCE_REGULATION_CLAUSES enables precise regulatory traceability</li>
            <li><strong>Domain Organization:</strong> FK to COMPLIANCE_DOMAIN groups controls by functional area</li>
            <li><strong>Owner Assignment:</strong> Each control has a designated owner for accountability</li>
            <li><strong>CLOB for Requirements:</strong> REQUIREMENT_TEXT supports detailed, lengthy control descriptions</li>
            <li><strong>Lifecycle Dates:</strong> EFFECTIVE_DATE and EXPIRY_DATE allow temporal control management</li>
            <li><strong>Extensibility:</strong> Structure designed to be extended with additional control metadata as needed</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceControlMasterDoc;
