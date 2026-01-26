import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";

const ComplianceRegulationsDoc = () => {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">COMPLIANCE_REGULATIONS + COMPLIANCE_REGULATION_CLAUSES</h1>
        <div className="flex gap-2">
          <Badge variant="secondary">Regulation Management</Badge>
          <Badge variant="secondary">Hierarchical Structure</Badge>
        </div>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Purpose / Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-lg mb-2">COMPLIANCE_REGULATIONS</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Stores all key information about regulations, such as their code, title, description, content, effective dates, jurisdiction, version, status, and metadata</li>
              <li>Helps in managing regulatory requirements and ensuring compliance with various laws and standards</li>
              <li>Maintains a list of all regulations (e.g., GDPR, HIPAA, ISO27001) ensuring consistency in regulation naming</li>
              <li>Essential for compliance with regulatory requirements and internal quality management processes</li>
              <li>Allows for tracking changes in regulations over time and can be referenced for future audits or compliance checks</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-2">COMPLIANCE_REGULATION_CLAUSES</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provides hierarchical clauses/subclauses for regulations with structured breakdown of regulatory requirements</li>
              <li>Supports nested/hierarchical structure via PARENT_ID self-referential foreign key for multi-level organization</li>
              <li>Each clause can have multiple child clauses enabling granular mapping of complex regulatory requirements</li>
              <li>Captures detailed clause text, content type, and hierarchy level for accurate representation of regulatory structure</li>
              <li>Essential for compliance audits, regulatory reporting, and ensuring complete coverage of all regulatory mandates</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Fields & Meanings - COMPLIANCE_REGULATIONS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-primary mb-2">Identifiers</h4>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li><code className="bg-muted px-1.5 py-0.5 rounded">REGULATION_ID</code> - Unique identifier (Primary Key, auto-generated)</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">FRAMEWORK_ID</code> - FK to COMPLIANCE_FRAMEWORKS [Not Null]</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">DOMAIN_ID</code> - FK to COMPLIANCE_DOMAIN</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">CODE</code> - Regulation code (e.g., GDPR, HIPAA, ISO27001:2013)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-2">Source & External Integration</h4>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li><code className="bg-muted px-1.5 py-0.5 rounded">SOURCE</code> - Source of regulation (e.g., 'INTERNAL', 'FEEDXYZ')</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">EXTERNAL_ID</code> - ID from source system/feed</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">SOURCE_URL</code> - Link to official source</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-2">Content</h4>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li><code className="bg-muted px-1.5 py-0.5 rounded">TITLE</code> - Short title of regulation</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">DESCRIPTION</code> - Brief description/summary (CLOB)</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">CONTENT</code> - Full text (could be JSON or HTML, CLOB)</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">CONTENT_TYPE</code> - Format (e.g., 'TEXT/HTML', 'TEXT/PLAIN', 'APPLICATION/JSON')</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-2">Lifecycle & Versioning</h4>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li><code className="bg-muted px-1.5 py-0.5 rounded">VERSION</code> - Version number (e.g., 1.0, 2.1, 2013)</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">EFFECTIVE_DATE</code> - When regulation takes effect</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">EXPIRY_DATE</code> - Optional expiry/retirement date</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">IS_CURRENT</code> - Boolean flag (0 or 1) [Default: 1]</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">SUPERSEDED_BY</code> - Reference to another REGULATION_ID</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-2">Geographic & Localization</h4>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li><code className="bg-muted px-1.5 py-0.5 rounded">JURISDICTION</code> - Geographic scope (e.g., EU, US, UK, GLOBAL)</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">JURISDICTION_REGION</code> - Specific region (e.g., CALIFORNIA, ONTARIO)</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">LANGUAGE</code> - Language code (e.g., EN, FR, ES)</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">LOCALE</code> - Locale code (e.g., EN-US, FR-CA)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-2">Status & Metadata</h4>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li><code className="bg-muted px-1.5 py-0.5 rounded">STATUS</code> - 'DRAFT', 'ACTIVE', 'WITHDRAWN', 'SUPERSEDED', 'ARCHIVED' [Default: 'ACTIVE']</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">METADATA</code> - JSON: Extra metadata, tags, identifiers (CLOB)</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">TAGS</code> - JSON array of tags/categories for faceted search (CLOB)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Fields & Meanings - COMPLIANCE_REGULATION_CLAUSES</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-primary mb-2">Identifiers & Hierarchy</h4>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li><code className="bg-muted px-1.5 py-0.5 rounded">CLAUSE_ID</code> - Unique identifier (Primary Key, auto-generated)</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">REGULATION_ID</code> - FK to COMPLIANCE_REGULATIONS [Not Null]</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">PARENT_ID</code> - Self-referential FK for hierarchy</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">CLAUSE_CODE</code> - Clause numbering (e.g., '1.1', 'A.3.2')</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">LEVEL_NO</code> - Depth in hierarchy (numeric)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-2">Content</h4>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li><code className="bg-muted px-1.5 py-0.5 rounded">TITLE</code> - Short title of clause</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">CLAUSE_TEXT</code> - Full text of clause (CLOB)</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">CONTENT_TYPE</code> - Format (e.g., 'TEXT/HTML', 'TEXT/PLAIN')</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded">METADATA</code> - JSON: Extra metadata (CLOB)</li>
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
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold mb-2">COMPLIANCE_REGULATIONS</h4>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li><strong>Primary Key:</strong> REGULATION_ID</li>
                <li><strong>Unique Constraint:</strong> (SOURCE, CODE, VERSION, JURISDICTION) combination must be unique</li>
                <li><strong>Check Constraints:</strong> STATUS IN ('DRAFT', 'ACTIVE', 'WITHDRAWN', 'SUPERSEDED', 'ARCHIVED')</li>
                <li><strong>Check Constraints:</strong> IS_CURRENT IN (0, 1)</li>
                <li><strong>Default Values:</strong> STATUS = 'ACTIVE', IS_CURRENT = 1</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">COMPLIANCE_REGULATION_CLAUSES</h4>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li><strong>Primary Key:</strong> CLAUSE_ID</li>
                <li><strong>Not Null:</strong> REGULATION_ID</li>
                <li><strong>Self-Referential:</strong> PARENT_ID references own table for hierarchy</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Foreign Key Relationships</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">COMPLIANCE_REGULATIONS References TO:</h4>
              <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                <li>COMPLIANCE_FRAMEWORKS (FRAMEWORK_ID)</li>
                <li>COMPLIANCE_DOMAIN (DOMAIN_ID)</li>
                <li>COMPLIANCE_REGULATIONS (SUPERSEDED_BY) - self-reference</li>
                <li>USERS_METADATA (CREATED_BY, UPDATED_BY)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">COMPLIANCE_REGULATION_CLAUSES References TO:</h4>
              <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                <li>COMPLIANCE_REGULATIONS (REGULATION_ID)</li>
                <li>COMPLIANCE_REGULATION_CLAUSES (PARENT_ID) - self-reference for hierarchy</li>
                <li>USERS_METADATA (CREATED_BY, UPDATED_BY)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Referenced BY:</h4>
              <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                <li>COMPLIANCE_CONTROL_MASTER (CLAUSE_ID)</li>
                <li>COMPLIANCE_OBLIGATIONS (linking to regulations or clauses)</li>
                <li>Audit and assessment modules</li>
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
            <li><strong>Regulatory Repository:</strong> Central repository for all applicable regulations with full text and metadata</li>
            <li><strong>Version Management:</strong> Track multiple versions of same regulation across time</li>
            <li><strong>Supersession Tracking:</strong> Maintain history when regulations are superseded by newer versions</li>
            <li><strong>Multi-Jurisdiction Support:</strong> Handle regulations applicable to different geographic regions</li>
            <li><strong>External Feed Integration:</strong> Import regulations from external regulatory feeds and track their source</li>
            <li><strong>Granular Clause Mapping:</strong> Map obligations and controls to specific regulation clauses</li>
            <li><strong>Hierarchical Navigation:</strong> Navigate complex regulatory structures with parent-child relationships</li>
            <li><strong>Audit Traceability:</strong> Provide complete audit trail from high-level regulation down to specific clauses</li>
            <li><strong>Compliance Gap Analysis:</strong> Identify which specific clauses are covered or not covered</li>
            <li><strong>Localization:</strong> Support multiple languages and locales for international compliance</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Example Records (Dummy Sample)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">COMPLIANCE_REGULATIONS</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="border border-border p-2 text-left">CODE</th>
                      <th className="border border-border p-2 text-left">TITLE</th>
                      <th className="border border-border p-2 text-left">VERSION</th>
                      <th className="border border-border p-2 text-left">JURISDICTION</th>
                      <th className="border border-border p-2 text-left">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-2">GDPR-ART5</td>
                      <td className="border border-border p-2">Principles relating to processing of personal data</td>
                      <td className="border border-border p-2">2016/679</td>
                      <td className="border border-border p-2">EU</td>
                      <td className="border border-border p-2"><Badge>ACTIVE</Badge></td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2">HIPAA-164.312</td>
                      <td className="border border-border p-2">Technical Safeguards</td>
                      <td className="border border-border p-2">2013</td>
                      <td className="border border-border p-2">US</td>
                      <td className="border border-border p-2"><Badge>ACTIVE</Badge></td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2">ISO27001-A.9</td>
                      <td className="border border-border p-2">Access Control</td>
                      <td className="border border-border p-2">2013</td>
                      <td className="border border-border p-2">GLOBAL</td>
                      <td className="border border-border p-2"><Badge>ACTIVE</Badge></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">COMPLIANCE_REGULATION_CLAUSES (Hierarchical Example)</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="border border-border p-2 text-left">CLAUSE_CODE</th>
                      <th className="border border-border p-2 text-left">TITLE</th>
                      <th className="border border-border p-2 text-left">LEVEL</th>
                      <th className="border border-border p-2 text-left">PARENT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-2">5</td>
                      <td className="border border-border p-2">Principles relating to processing</td>
                      <td className="border border-border p-2">1</td>
                      <td className="border border-border p-2">-</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2">5.1</td>
                      <td className="border border-border p-2">Personal data shall be</td>
                      <td className="border border-border p-2">2</td>
                      <td className="border border-border p-2">5</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2">5.1.a</td>
                      <td className="border border-border p-2">Processed lawfully, fairly and transparently</td>
                      <td className="border border-border p-2">3</td>
                      <td className="border border-border p-2">5.1</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2">5.1.b</td>
                      <td className="border border-border p-2">Collected for specified, explicit purposes</td>
                      <td className="border border-border p-2">3</td>
                      <td className="border border-border p-2">5.1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
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
COMPLIANCE_FRAMEWORKS
    │
    ├── COMPLIANCE_DOMAIN
    │       │
    │       └── COMPLIANCE_REGULATIONS
    │               │
    │               ├── COMPLIANCE_REGULATION_CLAUSES (Level 1)
    │               │       │
    │               │       ├── COMPLIANCE_REGULATION_CLAUSES (Level 2)
    │               │       │       │
    │               │       │       └── COMPLIANCE_REGULATION_CLAUSES (Level 3)
    │               │       │
    │               │       └── [More Level 2 Clauses...]
    │               │
    │               └── [More Level 1 Clauses...]
    │
    └── [Referenced by Controls, Obligations, etc.]

Example GDPR Article 5 Hierarchy:
GDPR-ART5 (Regulation)
    │
    ├── 5 - Principles relating to processing (Clause Level 1)
    │   │
    │   ├── 5.1 - Personal data shall be (Clause Level 2)
    │   │   │
    │   │   ├── 5.1.a - Lawful, fair, transparent (Clause Level 3)
    │   │   ├── 5.1.b - Purpose limitation (Clause Level 3)
    │   │   ├── 5.1.c - Data minimization (Clause Level 3)
    │   │   ├── 5.1.d - Accuracy (Clause Level 3)
    │   │   ├── 5.1.e - Storage limitation (Clause Level 3)
    │   │   └── 5.1.f - Integrity and confidentiality (Clause Level 3)
    │   │
    │   └── 5.2 - Controller responsibility (Clause Level 2)
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
            <li><strong>Unique Constraint Logic:</strong> Combination of SOURCE + CODE + VERSION + JURISDICTION must be unique to prevent duplicates</li>
            <li><strong>Supersession Chain:</strong> SUPERSEDED_BY creates a chain allowing tracking of regulatory evolution over time</li>
            <li><strong>No Cascade Delete:</strong> FK to SUPERSEDED_BY has no cascade to preserve history</li>
            <li><strong>IS_CURRENT Flag:</strong> Indicates whether this is the current active version of a regulation</li>
            <li><strong>Hierarchical Clauses:</strong> Self-referential PARENT_ID enables unlimited depth in clause hierarchy</li>
            <li><strong>Level Numbering:</strong> LEVEL_NO helps with rendering and querying hierarchical structures</li>
            <li><strong>Content Flexibility:</strong> CONTENT and CLAUSE_TEXT are CLOB supporting JSON, HTML, or plain text</li>
            <li><strong>External Integration:</strong> SOURCE and EXTERNAL_ID fields enable tracking of regulations from external feeds</li>
            <li><strong>Rich Metadata:</strong> JSON METADATA and TAGS fields enable flexible categorization and search</li>
            <li><strong>Multi-Language Support:</strong> LANGUAGE and LOCALE fields support international compliance requirements</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceRegulationsDoc;
