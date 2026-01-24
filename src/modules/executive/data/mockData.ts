// Executive Counsel Mock Data

export interface KPIData {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color: 'risk' | 'compliance' | 'incidents' | 'capa' | 'esg';
}

export interface RiskItem {
  id: string;
  name: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  likelihood: number;
  impact: number;
  owner: string;
  status: 'open' | 'mitigating' | 'closed';
  lastUpdated: Date;
}

export interface ComplianceItem {
  id: string;
  standard: string;
  coverage: number;
  status: 'compliant' | 'partial' | 'non-compliant';
  nextAudit: Date;
  gaps: number;
}

export interface AuditFinding {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  dueDate: Date;
  owner: string;
  status: 'open' | 'in-progress' | 'closed';
}

export interface IncidentData {
  id: string;
  title: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  site: string;
  date: Date;
  status: 'open' | 'investigating' | 'closed';
  injuryType?: string;
}

export interface CAPAItem {
  id: string;
  title: string;
  source: string;
  type: 'corrective' | 'preventive';
  priority: 'critical' | 'high' | 'medium' | 'low';
  owner: string;
  dueDate: Date;
  status: 'open' | 'in-progress' | 'verification' | 'closed' | 'ineffective';
  age: number;
}

export interface QualityMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

export interface SupplierRisk {
  id: string;
  name: string;
  riskLevel: 'high' | 'medium' | 'low';
  lastAudit: Date;
  issues: number;
  status: 'approved' | 'conditional' | 'suspended';
}

export interface ESGMetric {
  category: 'environmental' | 'social' | 'governance';
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  timestamp: Date;
  acknowledged: boolean;
  assignee?: string;
}

// Mock Data
export const kpiData: KPIData[] = [
  { label: 'Risk Score', value: '72/100', trend: 'down', trendValue: '↓ 5%', color: 'risk' },
  { label: 'Compliance', value: '94%', trend: 'up', trendValue: '↑ 2%', color: 'compliance' },
  { label: 'Incidents', value: '↓ 18%', trend: 'down', trendValue: 'vs last quarter', color: 'incidents' },
  { label: 'CAPA Aging', value: '12', trend: 'stable', trendValue: '⚠ Overdue', color: 'capa' },
  { label: 'ESG Rating', value: 'B+', trend: 'up', trendValue: '↑ from B', color: 'esg' },
];

export const riskData: RiskItem[] = [
  { id: 'R001', name: 'Regulatory Non-Compliance', category: 'Compliance', severity: 'high', likelihood: 4, impact: 5, owner: 'Sarah Chen', status: 'mitigating', lastUpdated: new Date() },
  { id: 'R002', name: 'Contractor Safety Exposure', category: 'Safety', severity: 'medium', likelihood: 3, impact: 4, owner: 'Mike Rodriguez', status: 'open', lastUpdated: new Date(Date.now() - 86400000) },
  { id: 'R003', name: 'Supplier Quality Drift', category: 'Quality', severity: 'medium', likelihood: 3, impact: 3, owner: 'Jennifer Walsh', status: 'mitigating', lastUpdated: new Date(Date.now() - 172800000) },
  { id: 'R004', name: 'Data Privacy Breach', category: 'IT Security', severity: 'critical', likelihood: 2, impact: 5, owner: 'John Doe', status: 'mitigating', lastUpdated: new Date() },
  { id: 'R005', name: 'Environmental Spill', category: 'Environmental', severity: 'high', likelihood: 2, impact: 5, owner: 'Sarah Chen', status: 'open', lastUpdated: new Date(Date.now() - 259200000) },
];

export const complianceData: ComplianceItem[] = [
  { id: 'C001', standard: 'ISO 45001', coverage: 95, status: 'compliant', nextAudit: new Date(Date.now() + 30 * 86400000), gaps: 2 },
  { id: 'C002', standard: 'ISO 9001', coverage: 90, status: 'compliant', nextAudit: new Date(Date.now() + 60 * 86400000), gaps: 4 },
  { id: 'C003', standard: 'ISO 14001', coverage: 85, status: 'partial', nextAudit: new Date(Date.now() + 45 * 86400000), gaps: 6 },
  { id: 'C004', standard: 'Regulatory', coverage: 92, status: 'compliant', nextAudit: new Date(Date.now() + 15 * 86400000), gaps: 3 },
];

export const auditFindings: AuditFinding[] = [
  { id: 'AF001', title: 'Missing documentation for chemical handling', severity: 'high', source: 'ISO 14001 Audit', dueDate: new Date(Date.now() + 7 * 86400000), owner: 'Sarah Chen', status: 'open' },
  { id: 'AF002', title: 'Inadequate emergency response training records', severity: 'high', source: 'Safety Audit', dueDate: new Date(Date.now() + 14 * 86400000), owner: 'Mike Rodriguez', status: 'in-progress' },
  { id: 'AF003', title: 'Calibration records incomplete', severity: 'medium', source: 'ISO 9001 Audit', dueDate: new Date(Date.now() + 21 * 86400000), owner: 'Jennifer Walsh', status: 'open' },
  { id: 'AF004', title: 'Supplier qualification gaps', severity: 'high', source: 'Supplier Audit', dueDate: new Date(Date.now() - 7 * 86400000), owner: 'John Doe', status: 'open' },
];

export const incidentData: IncidentData[] = [
  { id: 'INC001', title: 'Slip and fall - Warehouse A', type: 'Injury', severity: 'medium', site: 'Site A', date: new Date(Date.now() - 2 * 86400000), status: 'investigating', injuryType: 'Minor' },
  { id: 'INC002', title: 'Near miss - Forklift collision', type: 'Near Miss', severity: 'high', site: 'Site B', date: new Date(Date.now() - 5 * 86400000), status: 'closed' },
  { id: 'INC003', title: 'Chemical exposure incident', type: 'Exposure', severity: 'high', site: 'Site A', date: new Date(Date.now() - 10 * 86400000), status: 'investigating', injuryType: 'Medical treatment' },
  { id: 'INC004', title: 'Equipment malfunction', type: 'Property Damage', severity: 'low', site: 'Site C', date: new Date(Date.now() - 15 * 86400000), status: 'closed' },
];

export const capaData: CAPAItem[] = [
  { id: 'CAPA001', title: 'Update chemical handling procedures', source: 'Audit Finding', type: 'corrective', priority: 'high', owner: 'Sarah Chen', dueDate: new Date(Date.now() + 7 * 86400000), status: 'in-progress', age: 30 },
  { id: 'CAPA002', title: 'Implement forklift safety training', source: 'Incident', type: 'preventive', priority: 'high', owner: 'Mike Rodriguez', dueDate: new Date(Date.now() - 5 * 86400000), status: 'open', age: 45 },
  { id: 'CAPA003', title: 'Review emergency response plan', source: 'Management Review', type: 'preventive', priority: 'medium', owner: 'John Doe', dueDate: new Date(Date.now() + 14 * 86400000), status: 'verification', age: 60 },
  { id: 'CAPA004', title: 'Calibration schedule update', source: 'Audit Finding', type: 'corrective', priority: 'medium', owner: 'Jennifer Walsh', dueDate: new Date(Date.now() - 10 * 86400000), status: 'ineffective', age: 75 },
];

export const qualityMetrics: QualityMetric[] = [
  { id: 'Q001', name: 'NCRs', value: 18, target: 10, unit: 'count', trend: 'down' },
  { id: 'Q002', name: 'Customer Complaints', value: 9, target: 5, unit: 'count', trend: 'stable' },
  { id: 'Q003', name: 'Recalls', value: 0, target: 0, unit: 'count', trend: 'stable' },
  { id: 'Q004', name: 'Calibration Compliance', value: 98, target: 100, unit: '%', trend: 'up' },
];

export const supplierRisks: SupplierRisk[] = [
  { id: 'S001', name: 'Acme Components', riskLevel: 'high', lastAudit: new Date(Date.now() - 90 * 86400000), issues: 5, status: 'conditional' },
  { id: 'S002', name: 'Global Materials Inc', riskLevel: 'medium', lastAudit: new Date(Date.now() - 60 * 86400000), issues: 2, status: 'approved' },
  { id: 'S003', name: 'Tech Solutions Ltd', riskLevel: 'low', lastAudit: new Date(Date.now() - 30 * 86400000), issues: 0, status: 'approved' },
  { id: 'S004', name: 'FastParts Co', riskLevel: 'high', lastAudit: new Date(Date.now() - 180 * 86400000), issues: 8, status: 'suspended' },
];

export const esgMetrics: ESGMetric[] = [
  { category: 'environmental', name: 'Carbon Emissions', value: 85, target: 80, unit: 'tons CO2e', trend: 'down' },
  { category: 'environmental', name: 'Waste Compliance', value: 96, target: 100, unit: '%', trend: 'up' },
  { category: 'environmental', name: 'Water Usage', value: 1200, target: 1000, unit: 'm³', trend: 'down' },
  { category: 'social', name: 'Training Coverage', value: 92, target: 100, unit: '%', trend: 'up' },
  { category: 'social', name: 'LTIR', value: 0.8, target: 0.5, unit: 'rate', trend: 'down' },
  { category: 'social', name: 'Diversity Index', value: 42, target: 50, unit: '%', trend: 'up' },
  { category: 'governance', name: 'Policy Acknowledgment', value: 100, target: 100, unit: '%', trend: 'stable' },
  { category: 'governance', name: 'Ethics Training', value: 98, target: 100, unit: '%', trend: 'up' },
];

export const executiveAlerts: Alert[] = [
  { id: 'A001', title: 'Regulatory Deadline Miss', description: 'Site B regulatory filing deadline is approaching in 3 days', severity: 'critical', source: 'Compliance', timestamp: new Date(), acknowledged: false },
  { id: 'A002', title: 'High-Severity Audit Finding', description: 'Audit finding AF001 requires immediate attention', severity: 'high', source: 'Audit', timestamp: new Date(Date.now() - 3600000), acknowledged: false },
  { id: 'A003', title: 'CAPA Ineffective', description: 'CAPA004 has been marked as ineffective - repeat issue detected', severity: 'high', source: 'CAPA', timestamp: new Date(Date.now() - 7200000), acknowledged: false, assignee: 'Jennifer Walsh' },
  { id: 'A004', title: 'Supplier Suspended', description: 'FastParts Co has been suspended due to quality issues', severity: 'medium', source: 'Quality', timestamp: new Date(Date.now() - 86400000), acknowledged: true },
];

export const incidentTrendData = [
  { month: 'Jan', incidents: 12, severity: 2.1 },
  { month: 'Feb', incidents: 15, severity: 2.3 },
  { month: 'Mar', incidents: 11, severity: 1.9 },
  { month: 'Apr', incidents: 14, severity: 2.0 },
  { month: 'May', incidents: 10, severity: 1.8 },
  { month: 'Jun', incidents: 8, severity: 1.6 },
  { month: 'Jul', incidents: 9, severity: 1.7 },
  { month: 'Aug', incidents: 7, severity: 1.5 },
  { month: 'Sep', incidents: 6, severity: 1.4 },
  { month: 'Oct', incidents: 8, severity: 1.6 },
  { month: 'Nov', incidents: 5, severity: 1.3 },
  { month: 'Dec', incidents: 4, severity: 1.2 },
];

export const complianceTrendData = [
  { month: 'Jan', iso45001: 88, iso9001: 85, iso14001: 80, regulatory: 90 },
  { month: 'Feb', iso45001: 89, iso9001: 86, iso14001: 81, regulatory: 90 },
  { month: 'Mar', iso45001: 90, iso9001: 87, iso14001: 82, regulatory: 91 },
  { month: 'Apr', iso45001: 91, iso9001: 88, iso14001: 82, regulatory: 91 },
  { month: 'May', iso45001: 92, iso9001: 88, iso14001: 83, regulatory: 92 },
  { month: 'Jun', iso45001: 93, iso9001: 89, iso14001: 84, regulatory: 92 },
  { month: 'Jul', iso45001: 93, iso9001: 89, iso14001: 84, regulatory: 92 },
  { month: 'Aug', iso45001: 94, iso9001: 90, iso14001: 85, regulatory: 92 },
  { month: 'Sep', iso45001: 94, iso9001: 90, iso14001: 85, regulatory: 92 },
  { month: 'Oct', iso45001: 95, iso9001: 90, iso14001: 85, regulatory: 92 },
  { month: 'Nov', iso45001: 95, iso9001: 90, iso14001: 85, regulatory: 92 },
  { month: 'Dec', iso45001: 95, iso9001: 90, iso14001: 85, regulatory: 92 },
];

export const highRiskSites = [
  { name: 'Site A', issue: 'Contractor Incidents ↑', riskLevel: 'high', incidentCount: 8 },
  { name: 'Site C', issue: 'Near Misses ↑', riskLevel: 'medium', incidentCount: 5 },
  { name: 'Site B', issue: 'Regulatory Gaps', riskLevel: 'medium', incidentCount: 3 },
];

export const rootCausePatterns = [
  { cause: 'Process Non-Adherence', count: 15, percentage: 38 },
  { cause: 'Training Gaps', count: 12, percentage: 30 },
  { cause: 'Equipment Failure', count: 8, percentage: 20 },
  { cause: 'Communication Issues', count: 5, percentage: 12 },
];
