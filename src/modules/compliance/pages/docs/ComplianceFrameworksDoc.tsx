import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";

const ComplianceFrameworksDoc = () => {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">COMPLIANCE_FRAMEWORKS</h1>
        <Badge variant="secondary">Core Registry Table</Badge>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Purpose / Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>Canonical registry of compliance frameworks (e.g., GDPR, HIPAA, ISO27001).</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Provides canonical framework codes, versioning, publisher, jurisdiction, effective/expiry dates and rich metadata</li>
            <li>Serves as the central reference used by regulations, domains, controls, obligations, assessments and reporting</li>
            <li>Enables lifecycle management, auditability and integration with external regulatory feeds/updates</li>
            <li>Designed for reuse across compliance modules to ensure consistent linkage, traceability and simplified updates</li>
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
                <li><code className="bg-muted px-1.5 py-0.5 rounded">FRAMEWORK_ID</code> - Unique identifier for framework (Primary Key, auto-generated via SYS_GUID())</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">FRAMEWORK_CODE</code> - Unique code (e.g., 'GDPR', 'HIPAA', 'ISO27001') [Unique, Not Null]</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">FRAMEWORK_NAME</code> - Name of the framework [Not Null]</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-2">Metadata</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><code className="bg-muted px-1.5 py-0.5 rounded">DESCRIPTION</code> - Brief description of the framework (CLOB)</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">VERSION_NO</code> - Version of the framework</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">PUBLISHER</code> - Entity or organization that published the framework</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-2">Lifecycle Dates</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><code className="bg-muted px-1.5 py-0.5 rounded">ISSUE_DATE</code> - Date when the framework was issued</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">LAST_REVIEW_DATE</code> - Date when the framework was last reviewed</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">EFFECTIVE_DATE</code> - When framework takes effect</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">EXPIRY_DATE</code> - Optional expiry/retirement date</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-2">Status & Audit</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><code className="bg-muted px-1.5 py-0.5 rounded">STATUS</code> - Status of the framework: 'ACTIVE', 'REVOKED', 'EXPIRED' [Default: 'ACTIVE']</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">CREATED_AT</code> - Creation timestamp (auto-generated)</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">UPDATED_AT</code> - Last update timestamp (auto-generated)</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">CREATED_BY</code> - User email who created (FK to USERS_METADATA)</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">UPDATED_BY</code> - User email who last updated (FK to USERS_METADATA)</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">LAST_REVIEWED_BY</code> - User email who last reviewed (FK to USERS_METADATA)</li>
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
            <li><strong>Primary Key:</strong> FRAMEWORK_ID</li>
            <li><strong>Unique Constraints:</strong> FRAMEWORK_CODE must be unique</li>
            <li><strong>Not Null:</strong> FRAMEWORK_CODE, FRAMEWORK_NAME</li>
            <li><strong>Check Constraints:</strong> STATUS IN ('ACTIVE', 'REVOKED', 'EXPIRED')</li>
            <li><strong>Default Values:</strong>
              <ul className="list-circle list-inside ml-6 mt-1">
                <li>FRAMEWORK_ID = SYS_GUID()</li>
                <li>STATUS = 'ACTIVE'</li>
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
                <li>USERS_METADATA (USER_EMAIL) - via CREATED_BY</li>
                <li>USERS_METADATA (USER_EMAIL) - via UPDATED_BY</li>
                <li>USERS_METADATA (USER_EMAIL) - via LAST_REVIEWED_BY</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Referenced BY:</h4>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>COMPLIANCE_DOMAIN (FRAMEWORK_ID)</li>
                <li>COMPLIANCE_REGULATIONS (FRAMEWORK_ID)</li>
                <li>Other compliance modules linking to frameworks</li>
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
            <li><strong>Regulatory Framework Management:</strong> Maintain a master list of all compliance frameworks applicable to the organization</li>
            <li><strong>Version Control:</strong> Track different versions of frameworks as they evolve over time</li>
            <li><strong>Lifecycle Tracking:</strong> Monitor when frameworks become effective, need review, or expire</li>
            <li><strong>Multi-Framework Compliance:</strong> Support organizations subject to multiple regulatory requirements</li>
            <li><strong>Audit Trail:</strong> Maintain complete history of who created, updated, and reviewed each framework</li>
            <li><strong>Central Reference:</strong> Serve as single source of truth for all framework-related data across the system</li>
            <li><strong>Integration Ready:</strong> Enable integration with external regulatory feeds for automatic updates</li>
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
                  <th className="border border-border p-2 text-left">FRAMEWORK_CODE</th>
                  <th className="border border-border p-2 text-left">FRAMEWORK_NAME</th>
                  <th className="border border-border p-2 text-left">VERSION_NO</th>
                  <th className="border border-border p-2 text-left">PUBLISHER</th>
                  <th className="border border-border p-2 text-left">STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-2">GDPR</td>
                  <td className="border border-border p-2">General Data Protection Regulation</td>
                  <td className="border border-border p-2">2016/679</td>
                  <td className="border border-border p-2">European Union</td>
                  <td className="border border-border p-2"><Badge variant="default">ACTIVE</Badge></td>
                </tr>
                <tr>
                  <td className="border border-border p-2">HIPAA</td>
                  <td className="border border-border p-2">Health Insurance Portability and Accountability Act</td>
                  <td className="border border-border p-2">1996</td>
                  <td className="border border-border p-2">U.S. Department of Health & Human Services</td>
                  <td className="border border-border p-2"><Badge variant="default">ACTIVE</Badge></td>
                </tr>
                <tr>
                  <td className="border border-border p-2">ISO27001</td>
                  <td className="border border-border p-2">Information Security Management</td>
                  <td className="border border-border p-2">2013</td>
                  <td className="border border-border p-2">International Organization for Standardization</td>
                  <td className="border border-border p-2"><Badge variant="default">ACTIVE</Badge></td>
                </tr>
                <tr>
                  <td className="border border-border p-2">PCI-DSS</td>
                  <td className="border border-border p-2">Payment Card Industry Data Security Standard</td>
                  <td className="border border-border p-2">4.0</td>
                  <td className="border border-border p-2">PCI Security Standards Council</td>
                  <td className="border border-border p-2"><Badge variant="default">ACTIVE</Badge></td>
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
            <li><strong>Unique Framework Codes:</strong> Each framework must have a unique code to prevent duplicates</li>
            <li><strong>Status Management:</strong> Frameworks can transition between ACTIVE → REVOKED or ACTIVE → EXPIRED</li>
            <li><strong>Auto-Generated IDs:</strong> FRAMEWORK_ID is automatically generated using SYS_GUID() for guaranteed uniqueness</li>
            <li><strong>Timestamp Tracking:</strong> Both creation and update timestamps are automatically managed</li>
            <li><strong>Audit Trail:</strong> Three-level user tracking: creator, last updater, and last reviewer</li>
            <li><strong>Optional Expiry:</strong> EXPIRY_DATE can be NULL for frameworks without retirement dates</li>
            <li><strong>Integration Point:</strong> This table is the foundation for all compliance-related modules</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceFrameworksDoc;
