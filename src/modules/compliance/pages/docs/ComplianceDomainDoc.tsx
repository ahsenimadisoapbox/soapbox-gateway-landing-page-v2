import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";

const ComplianceDomainDoc = () => {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">COMPLIANCE_DOMAIN</h1>
        <Badge variant="secondary">Framework Organization Table</Badge>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Purpose / Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>Stores and categorizes different compliance domains/areas within frameworks.</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Domains represent major functional areas of compliance (e.g., Data Protection, Information Security, Health Information Security)</li>
            <li>Helps organize regulations, obligations, assessments, audits, and controls into specific domains for better structure and traceability</li>
            <li>Each domain is linked to a framework and can contain multiple regulations, controls, and obligations related to that specific compliance area</li>
            <li>Essential for regulatory mapping, compliance audits, and ensuring consistent organization of compliance requirements across the system</li>
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
                <li><code className="bg-muted px-1.5 py-0.5 rounded">DOMAIN_ID</code> - Unique identifier for domain (Primary Key, auto-generated via SYS_GUID())</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">FRAMEWORK_ID</code> - Foreign key to COMPLIANCE_FRAMEWORKS table [Not Null]</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">DOMAIN_CODE</code> - Unique code (e.g., 'DATA_PROTECTION', 'INFORMATION_SECURITY') [Unique, Not Null]</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">DOMAIN_NAME</code> - Name of the domain [Not Null]</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-2">Content</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><code className="bg-muted px-1.5 py-0.5 rounded">DESCRIPTION</code> - Brief description of the domain (CLOB)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-2">Audit Fields</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><code className="bg-muted px-1.5 py-0.5 rounded">CREATED_AT</code> - Creation timestamp (auto-generated)</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">UPDATED_AT</code> - Last update timestamp (auto-generated)</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">CREATED_BY</code> - User email who created (FK to USERS_METADATA)</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">UPDATED_BY</code> - User email who last updated (FK to USERS_METADATA)</li>
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
            <li><strong>Primary Key:</strong> DOMAIN_ID</li>
            <li><strong>Unique Constraints:</strong> DOMAIN_CODE must be unique</li>
            <li><strong>Not Null:</strong> FRAMEWORK_ID, DOMAIN_CODE, DOMAIN_NAME</li>
            <li><strong>Default Values:</strong>
              <ul className="list-circle list-inside ml-6 mt-1">
                <li>DOMAIN_ID = SYS_GUID()</li>
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
                <li>COMPLIANCE_FRAMEWORKS (FRAMEWORK_ID) - Parent framework</li>
                <li>USERS_METADATA (USER_EMAIL) - via CREATED_BY</li>
                <li>USERS_METADATA (USER_EMAIL) - via UPDATED_BY</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Referenced BY:</h4>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>COMPLIANCE_REGULATIONS (DOMAIN_ID)</li>
                <li>COMPLIANCE_CONTROL_MASTER (DOMAIN_ID)</li>
                <li>Other compliance modules linking to domains</li>
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
            <li><strong>Compliance Organization:</strong> Structure compliance requirements into logical functional areas</li>
            <li><strong>Multi-Domain Frameworks:</strong> Support frameworks with multiple distinct compliance areas (e.g., ISO27001 has multiple domains)</li>
            <li><strong>Regulatory Mapping:</strong> Map specific regulations to their appropriate domain within a framework</li>
            <li><strong>Control Categorization:</strong> Organize controls by domain for easier management and assessment</li>
            <li><strong>Audit Planning:</strong> Enable domain-specific audits and assessments</li>
            <li><strong>Reporting:</strong> Generate compliance reports organized by domain</li>
            <li><strong>Access Control:</strong> Allow role-based access to specific compliance domains</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Example Records (Dummy Sample)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border">
              <thead className="bg-muted">
                <tr>
                  <th className="border border-border p-2 text-left">DOMAIN_CODE</th>
                  <th className="border border-border p-2 text-left">DOMAIN_NAME</th>
                  <th className="border border-border p-2 text-left">FRAMEWORK</th>
                  <th className="border border-border p-2 text-left">DESCRIPTION</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-2">DATA_PROTECTION</td>
                  <td className="border border-border p-2">Data Protection</td>
                  <td className="border border-border p-2">GDPR</td>
                  <td className="border border-border p-2">Personal data processing and privacy rights</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">INFO_SECURITY</td>
                  <td className="border border-border p-2">Information Security</td>
                  <td className="border border-border p-2">ISO27001</td>
                  <td className="border border-border p-2">Information security management controls</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">HEALTH_INFO_SEC</td>
                  <td className="border border-border p-2">Health Information Security</td>
                  <td className="border border-border p-2">HIPAA</td>
                  <td className="border border-border p-2">Protected health information security</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">PAYMENT_SECURITY</td>
                  <td className="border border-border p-2">Payment Card Security</td>
                  <td className="border border-border p-2">PCI-DSS</td>
                  <td className="border border-border p-2">Payment card data protection</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">ACCESS_CONTROL</td>
                  <td className="border border-border p-2">Access Control</td>
                  <td className="border border-border p-2">ISO27001</td>
                  <td className="border border-border p-2">User access management and authentication</td>
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
COMPLIANCE_FRAMEWORKS (Parent)
    │
    ├── COMPLIANCE_DOMAIN (This Table)
    │       │
    │       ├── COMPLIANCE_REGULATIONS
    │       ├── COMPLIANCE_CONTROL_MASTER
    │       └── Other Domain-Specific Modules
    │
    └── Other Framework Components

Example Hierarchy:
GDPR (Framework)
    ├── Data Protection (Domain)
    ├── Data Subject Rights (Domain)
    └── Security of Processing (Domain)

ISO27001 (Framework)
    ├── Information Security (Domain)
    ├── Access Control (Domain)
    ├── Cryptography (Domain)
    └── Physical Security (Domain)
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
            <li><strong>Framework Dependency:</strong> Every domain must belong to a framework (FRAMEWORK_ID is NOT NULL)</li>
            <li><strong>Unique Domain Codes:</strong> Each domain must have a unique code across all frameworks</li>
            <li><strong>Commented Out Field:</strong> PARENT_DOMAIN_ID is commented out but could support hierarchical domains in future</li>
            <li><strong>Organizational Flexibility:</strong> Allows different frameworks to organize compliance requirements differently</li>
            <li><strong>No Status Field:</strong> Unlike frameworks, domains don't have a status - they're implicitly active if their parent framework is active</li>
            <li><strong>CLOB Description:</strong> Supports large text descriptions for comprehensive domain documentation</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceDomainDoc;
