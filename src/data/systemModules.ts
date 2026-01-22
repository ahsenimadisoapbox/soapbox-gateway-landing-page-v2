import {
  AlertTriangle, ClipboardCheck, FileCheck, Calendar, Shield, CheckSquare,
  FileText, ListChecks, FileWarning, GraduationCap, FolderOpen, RefreshCw,
  AlertCircle, Target, Briefcase, Search, ClipboardList, Eye, Flame, Skull,
  Trash2, TriangleAlert, Heart, Activity, Users, FileSpreadsheet, Settings,
  BarChart3, Database, Lock, Gauge, Zap, Globe, Building2, Leaf, Droplets,
  Wind, Thermometer, Radio, Cpu, Brain, Bot, Layers, Network, Key, Smartphone,
  Mail, PieChart, HardDrive, Plug, ShieldCheck, Languages, Cloud, CreditCard,
  Wrench, Scale, BookOpen, Microscope, Factory, Truck, Package, TestTube,
  Stethoscope, BadgeCheck, Timer, Workflow, FileSearch, TrendingUp, Lightbulb,
  MapPin, Waves, Recycle, Car, DollarSign, LineChart, Megaphone, ClipboardPlus,
  UserCheck, Building, Headphones, FileCode, Calculator, Server, GitBranch,
  Award, Siren, Phone, HelpCircle, Map, Compass, Share2, Fingerprint, LayoutDashboard
} from "lucide-react";
import { SystemType } from "@/components/SystemTabs";

export interface ModuleData {
  title: string;
  description: string;
  url?: string;
  icon: any;
  comingSoon?: boolean;
}

export interface SystemSection {
  title: string;
  modules: ModuleData[];
}

export const systemModules: Record<SystemType, SystemSection[]> = {
  "EHS": [
    {
      title: "Core EHS Engine",
      modules: [
        { title: "Executive Console", description: "Executive dashboard for EHS oversight and analytics.", url: "https://id-preview--0d956257-b78e-45fe-baea-c5ebfd5be2b3.lovable.app/", icon: LayoutDashboard },
        { title: "Incident Management", description: "Reports, tracks, investigates, and closes incidents with SLAs.", url: "https://preview--ops-resolve-dash.lovable.app/dashboard", icon: AlertTriangle },
        { title: "Audit Management", description: "Streamlines audit planning, execution, and closure.", url: "https://preview--soapbox-audit-craft.lovable.app/dashboard", icon: ClipboardCheck },
        { title: "CAPA", description: "Manages corrective/preventive actions with workflows.", url: "https://preview--soapbox-capa-flow.lovable.app/", icon: FileCheck },
        { title: "Risk Management", description: "Identifies, assesses, and mitigates organizational risks.", url: "https://preview--random-page.lovable.app/", icon: Shield },
        { title: "Compliance Management", description: "Monitors compliance with regulations.", url: "https://preview--compliance-orb.lovable.app/", icon: CheckSquare },
        { title: "Non-Compliance Reporting", description: "Track non-compliance events with corrective actions.", url: "https://id-preview--6223ccbc-ecf4-42dd-8762-474380de042e.lovable.app/", icon: FileWarning },
        { title: "Inspection", description: "Digital inspection forms and automated workflows.", url: "https://preview--soapbox-inspect-iq.lovable.app/help", icon: Search },
        { title: "Job Safety Analysis (JSA)", description: "Systematic evaluation of job tasks and safety.", url: "https://id-preview--2c806b9c-2226-4ae7-b27f-1bd7b4067456.lovable.app/", icon: ClipboardList },
        { title: "Safety Observation Reporting", description: "Report and track safety observations.", url: "https://id-preview--028c806b-042b-48fa-a108-cb742fe05d07.lovable.app/", icon: Eye },
        { title: "Occupational Health", description: "Health monitoring and management.", url: "https://id-preview--0d475589-e0d6-4ae7-a555-0ac8b22b24bb.lovable.app/", icon: Stethoscope },
      ]
    },
    {
      title: "Advanced Modules",
      modules: [
        { title: "HAZMAT", description: "Track and control hazardous substances.", url: "https://id-preview--e109f455-540d-4502-9bff-878a1238071c.lovable.app/", icon: Skull },
        { title: "Hot Work Permits", description: "Manage permits for welding and hot work.", url: "https://id-preview--b569da81-3986-4487-aa6c-d204c7ec2c65.lovable.app/", icon: Flame },
        { title: "Permit to Work (PTW)", description: "Digital permit system for high-risk work.", url: "https://id-preview--81b969a2-0de7-4940-9300-5e7255ea671a.lovable.app/", icon: FileText },
        { title: "Near Miss Reporting", description: "Capture near-miss incidents to prevent accidents.", url: "https://id-preview--290a6b11-cd72-4c91-982a-d65938091ff8.lovable.app/", icon: TriangleAlert },
        { title: "Event Tracking", description: "Tracks planned/unplanned events and analytics.", url: "https://id-preview--66a6c22a-9185-4f11-bc75-6f851488f8e7.lovable.app/", icon: Calendar },
        { title: "Operational Risk Management", description: "Real-time operational risk monitoring.", url: "https://id-preview--ca0a2037-70be-45ec-a950-794182b91fd6.lovable.app/", icon: Briefcase },
        { title: "Waste Management", description: "Monitor waste disposal and recycling.", url: "https://id-preview--b644d756-cb90-4b28-9324-4d6ec0c81c99.lovable.app/", icon: Trash2 },
      ]
    },
    {
      title: "Additional Advanced Modules",
      modules: [
        { title: "Advanced Incident Management", description: "Enhanced tracking with AI-powered insights.", icon: AlertCircle, comingSoon: true },
        { title: "Advanced Risk Management", description: "Predictive risk analytics and modeling.", icon: Target, comingSoon: true },
        { title: "Advanced Compliance", description: "AI-driven compliance monitoring.", icon: CheckSquare, comingSoon: true },
        { title: "Change Management", description: "Manage changes with impact assessments.", url: "https://id-preview--736491cb-a76c-4cd6-94fc-085c7c60cfe5.lovable.app/", icon: RefreshCw },
        { title: "Training Management", description: "Schedule and certify training programs.", url: "https://id-preview--63ac40ad-200e-4d94-8c37-124cfbdd6334.lovable.app/", icon: GraduationCap },
        { title: "Document Management", description: "Centralized EHS documents and version control.", url: "https://id-preview--42fa2e52-fd78-40e1-b451-be0a881c8195.lovable.app/", icon: FolderOpen },
        { title: "Checklists Management", description: "Create and track safety checklists.", url: "https://id-preview--e447bfce-0b7f-4ec6-b539-02a40d86875c.lovable.app/", icon: ListChecks },
        { title: "Advanced Predictive Analytics", description: "AI-powered predictive analytics.", icon: TrendingUp, comingSoon: true },
        { title: "Artificial Intelligence Module", description: "AI module for automation.", icon: Brain, comingSoon: true },
        { title: "BCM", description: "Business continuity management.", icon: Building2, comingSoon: true },
        { title: "Emergency Management", description: "Emergency response and planning.", icon: Siren, comingSoon: true },
        { title: "Sustainability Management", description: "Sustainability tracking and reporting.", icon: Leaf, comingSoon: true },
        { title: "Legal & Regulatory Change", description: "Monitor regulatory changes.", icon: Scale, comingSoon: true },
        { title: "Environmental Data", description: "Environmental data management.", icon: Database, comingSoon: true },
        { title: "Contractor & Supplier", description: "Contractor and supplier management.", icon: Truck, comingSoon: true },
        { title: "Employee Wellbeing", description: "Wellbeing and mental health tracking.", icon: Heart, comingSoon: true },
        { title: "Ergonomics Assessment", description: "Ergonomics evaluation tools.", icon: Activity, comingSoon: true },
      ]
    }
  ],
  "eQMS": [
    {
      title: "Core eQMS Engine",
      modules: [
        { title: "Document & Records Control", description: "Manage documents with version control.", icon: FileText, comingSoon: true },
        { title: "Training & Competency", description: "Track training and competency.", icon: GraduationCap, comingSoon: true },
        { title: "CAPA & Issue Resolution", description: "Corrective actions and issue management.", icon: FileCheck, comingSoon: true },
        { title: "Nonconformance Management", description: "Handle deviations and NCRs.", icon: FileWarning, comingSoon: true },
        { title: "Quality Events & Incident Management", description: "Quality incident management.", url: "https://id-preview--05abec7d-6f9b-4d48-b83e-5d91a91118ea.lovable.app/", icon: AlertTriangle },
        { title: "Audit & Inspection", description: "Quality audits and inspections.", icon: ClipboardCheck, comingSoon: true },
        { title: "Quality Risk Management", description: "Risk assessment for quality.", icon: Shield, comingSoon: true },
        { title: "Change Management", description: "Quality change control.", icon: RefreshCw, comingSoon: true },
        { title: "Complaint & Customer Feedback", description: "Customer feedback management.", url: "https://id-preview--629aff38-aa42-4edd-807b-890c36a1b069.lovable.app/", icon: Megaphone },
        { title: "Supplier & Vendor Quality Management", description: "Vendor quality management.", url: "https://id-preview--32e5665f-bc7e-4f5c-ab35-27714a7bf028.lovable.app/", icon: Truck },
        { title: "Calibration & Equipment Management", description: "Equipment calibration tracking.", url: "https://id-preview--1969ee24-59d4-49a3-a056-351e0d1c5849.lovable.app/", icon: Settings },
        { title: "Quality Inspections & Product Release", description: "Product inspection and release.", url: "https://id-preview--96ff7a12-4629-431f-acf0-a56383f4a798.lovable.app/", icon: Search },
        { title: "Product Lifecycle Quality", description: "Quality across product lifecycle.", url: "https://id-preview--abd0bea0-8945-456d-9fe1-fd81b2fc1556.lovable.app/", icon: Layers },
        { title: "Validation Management", description: "Validation and verification.", url: "https://id-preview--c60da579-6f19-4fa2-bf83-25bbad8f29ee.lovable.app/", icon: BadgeCheck },
        { title: "SPC & Quality Analytics", description: "Statistical process control.", icon: BarChart3, comingSoon: true },
        { title: "KPI & Dashboards", description: "Performance dashboards.", icon: PieChart, comingSoon: true },
        { title: "Management Review", description: "Management review module.", url: "https://id-preview--af7b0073-1baf-4191-a1ec-b75156c1aff1.lovable.app/", icon: Users },
        { title: "Supplier Qualification", description: "Supplier qualification workflow.", icon: UserCheck, comingSoon: true },
      ]
    },
    {
      title: "Advanced Modules",
      modules: [
        { title: "SPC Charts & Run Rules", description: "Advanced SPC charting.", icon: LineChart, comingSoon: true },
        { title: "Supplier Portal", description: "Supplier collaboration portal.", icon: Globe, comingSoon: true },
        { title: "CAPA Effectiveness", description: "CAPA effectiveness framework.", icon: Target, comingSoon: true },
        { title: "Material Traceability", description: "Lot genealogy and traceability.", icon: Package, comingSoon: true },
        { title: "Lab Investigation (LIR)", description: "Lab investigation reporting.", icon: Microscope, comingSoon: true },
        { title: "Forms & Checklists", description: "Forms and checklists framework.", icon: ClipboardPlus, comingSoon: true },
        { title: "Training Verification", description: "Training effectiveness verification.", icon: Award, comingSoon: true },
        { title: "Validation Review", description: "Periodic validation review.", icon: Timer, comingSoon: true },
      ]
    }
  ],
  "ESG": [
    {
      title: "Core ESG Engine",
      modules: [
        { title: "Data Collection", description: "ESG data ingestion.", icon: Database, comingSoon: true },
        { title: "GHG Emissions", description: "Greenhouse gas management.", icon: Wind, comingSoon: true },
        { title: "Sustainability KPIs", description: "Sustainability KPI library.", icon: Gauge, comingSoon: true },
        { title: "ESG Reporting", description: "ESG disclosure and reporting.", icon: FileSpreadsheet, comingSoon: true },
        { title: "Materiality Assessment", description: "Stakeholder mapping.", icon: Users, comingSoon: true },
        { title: "Supply Chain ESG", description: "Supply chain assessments.", icon: Truck, comingSoon: true },
        { title: "Social Impact", description: "Human rights management.", icon: Heart, comingSoon: true },
        { title: "Governance Reporting", description: "Board reporting.", icon: Building, comingSoon: true },
        { title: "Targets & Roadmaps", description: "Sustainability roadmaps.", icon: Map, comingSoon: true },
        { title: "Carbon Accounting", description: "Carbon offsets tracking.", icon: Leaf, comingSoon: true },
        { title: "Data Quality", description: "Data quality assurance.", icon: BadgeCheck, comingSoon: true },
        { title: "Climate Risk", description: "Scenario analysis.", icon: Thermometer, comingSoon: true },
        { title: "Investment ESG Scoring", description: "ESG investment scoring.", icon: TrendingUp, comingSoon: true },
        { title: "Sustainability Tracker", description: "Task and action tracker.", icon: ListChecks, comingSoon: true },
      ]
    },
    {
      title: "Advanced Modules",
      modules: [
        { title: "Scope 3 Analysis", description: "Scope 3 hotspot analysis.", icon: PieChart, comingSoon: true },
        { title: "Life Cycle Assessment", description: "LCA tools.", icon: Recycle, comingSoon: true },
        { title: "ESG Benchmarking", description: "Rating aggregation.", icon: BarChart3, comingSoon: true },
        { title: "Investor Portal", description: "Investor reporting portal.", icon: DollarSign, comingSoon: true },
        { title: "ESG Scorecards", description: "Scorecards and heatmaps.", icon: Gauge, comingSoon: true },
        { title: "Regulatory Watch", description: "Automated monitoring.", icon: Eye, comingSoon: true },
        { title: "Taxonomy Compliance", description: "Taxonomy compliance.", icon: Scale, comingSoon: true },
        { title: "Carbon Marketplace", description: "Carbon credit integrations.", icon: Globe, comingSoon: true },
      ]
    }
  ],
  "GRC": [
    {
      title: "Core GRC Engine",
      modules: [
        { title: "Policy Management", description: "Policy and procedure management.", icon: FileText, comingSoon: true },
        { title: "Regulatory Registry", description: "Regulatory requirements registry.", icon: BookOpen, comingSoon: true },
        { title: "Risk Management", description: "Enterprise risk management.", icon: Shield, comingSoon: true },
        { title: "Control Management", description: "Control framework management.", icon: Settings, comingSoon: true },
        { title: "Compliance Management", description: "Compliance tracking.", icon: CheckSquare, comingSoon: true },
        { title: "Issue & Remediation", description: "Issue management.", icon: Wrench, comingSoon: true },
        { title: "Audit Management", description: "GRC audit management.", icon: ClipboardCheck, comingSoon: true },
        { title: "Third-Party Risk", description: "Vendor risk management.", icon: Users, comingSoon: true },
        { title: "Incident Investigation", description: "Incident investigation.", icon: Search, comingSoon: true },
        { title: "Control Libraries", description: "Business control libraries.", icon: Layers, comingSoon: true },
        { title: "Risk Appetite & KRIs", description: "Key risk indicators.", icon: Gauge, comingSoon: true },
        { title: "Compliance Attestations", description: "Attestation management.", icon: BadgeCheck, comingSoon: true },
        { title: "Workflow Engine", description: "Workflow and escalation.", icon: Workflow, comingSoon: true },
        { title: "Approvals", description: "Approval workflows.", icon: FileCheck, comingSoon: true },
      ]
    },
    {
      title: "Advanced Modules",
      modules: [
        { title: "SOX Compliance", description: "Sarbanes-Oxley compliance.", icon: Scale, comingSoon: true },
        { title: "Privacy & Data Protection", description: "Data privacy management.", icon: Lock, comingSoon: true },
        { title: "Legal Case Tracker", description: "Legal case management.", icon: Briefcase, comingSoon: true },
        { title: "Regulatory Monitoring", description: "Automated regulatory change.", icon: Radio, comingSoon: true },
        { title: "Operational Risk (ORM)", description: "Operational risk management.", icon: Target, comingSoon: true },
        { title: "Scenario Planning", description: "Stress testing.", icon: TrendingUp, comingSoon: true },
        { title: "Policy Attestation Portal", description: "Employee attestation portal.", icon: UserCheck, comingSoon: true },
      ]
    }
  ],
  "BCM": [
    {
      title: "Core",
      modules: [
        { title: "Business Impact Analysis", description: "BIA assessment.", icon: BarChart3, comingSoon: true },
        { title: "Risk & Threat Catalog", description: "Threat cataloging.", icon: AlertTriangle, comingSoon: true },
        { title: "Continuity Plans", description: "Business continuity plans.", icon: FileText, comingSoon: true },
        { title: "Crisis Management", description: "Crisis response.", icon: Siren, comingSoon: true },
        { title: "Stakeholder Directory", description: "Key contacts directory.", icon: Users, comingSoon: true },
        { title: "Recovery Teams & RACI", description: "Team assignments.", icon: UserCheck, comingSoon: true },
        { title: "Testing & Exercising", description: "Plan testing.", icon: ClipboardCheck, comingSoon: true },
        { title: "Third-Party Resilience", description: "Vendor resilience.", icon: Building2, comingSoon: true },
        { title: "IT DR Integration", description: "Disaster recovery integration.", icon: Server, comingSoon: true },
        { title: "Plan Versioning", description: "Plan version control.", icon: GitBranch, comingSoon: true },
        { title: "Crisis Communication", description: "Communication management.", icon: Megaphone, comingSoon: true },
        { title: "Scenario Simulation", description: "Scenario simulations.", icon: Cpu, comingSoon: true },
        { title: "Training & Awareness", description: "BCM training.", icon: GraduationCap, comingSoon: true },
        { title: "Incident Logs & Reviews", description: "Incident review logs.", icon: FileSearch, comingSoon: true },
      ]
    },
    {
      title: "Advanced Modules",
      modules: [
        { title: "Alternate Site Management", description: "Alternate site planning.", icon: MapPin, comingSoon: true },
        { title: "Insurance & Claims", description: "Claims coordination.", icon: DollarSign, comingSoon: true },
        { title: "Pandemic Planning", description: "Pandemic response.", icon: Activity, comingSoon: true },
        { title: "Emergency Services", description: "Emergency integration.", icon: Phone, comingSoon: true },
        { title: "Mobile Response", description: "Mobile checklists.", icon: Smartphone, comingSoon: true },
      ]
    }
  ],
  "OHSM": [
    {
      title: "Core",
      modules: [
        { title: "Incident Management", description: "Occupational incident tracking.", icon: AlertTriangle, comingSoon: true },
        { title: "Hazard Register", description: "Hazard identification.", icon: AlertCircle, comingSoon: true },
        { title: "JSA/JSEA", description: "Job safety analysis.", icon: ClipboardList, comingSoon: true },
        { title: "PTW & Hot Work", description: "Work permits.", icon: Flame, comingSoon: true },
        { title: "Safety Observations", description: "Behavior-based safety.", icon: Eye, comingSoon: true },
        { title: "Inspections & Checklists", description: "Safety inspections.", icon: ListChecks, comingSoon: true },
        { title: "Audits & Compliance", description: "Safety audits.", icon: ClipboardCheck, comingSoon: true },
        { title: "Occupational Health", description: "Health monitoring.", url: "https://id-preview--0d475589-e0d6-4ae7-a555-0ac8b22b24bb.lovable.app/", icon: Stethoscope },
        { title: "Training & Competency", description: "Safety training.", icon: GraduationCap, comingSoon: true },
        { title: "PPE Management", description: "PPE tracking.", icon: ShieldCheck, comingSoon: true },
        { title: "Contractor Safety", description: "Contractor management.", icon: Users, comingSoon: true },
        { title: "Emergency Drills", description: "Emergency drills.", icon: Siren, comingSoon: true },
        { title: "Toolbox Talks", description: "Safety communications.", icon: Megaphone, comingSoon: true },
        { title: "Corrective Actions", description: "Corrective action tracking.", icon: FileCheck, comingSoon: true },
        { title: "OSHA Reporting", description: "OSHA compliance.", icon: FileSpreadsheet, comingSoon: true },
        { title: "Fatigue & Substance", description: "Fatigue and substance screening.", icon: Activity, comingSoon: true },
      ]
    },
    {
      title: "Advanced Modules",
      modules: [
        { title: "Ergonomics Assessment", description: "Ergonomics evaluation.", icon: Activity, comingSoon: true },
        { title: "Noise & Exposure", description: "Exposure monitoring.", icon: Radio, comingSoon: true },
        { title: "Confined Space Logs", description: "Confined space tracking.", icon: Lock, comingSoon: true },
        { title: "Return-to-Work", description: "RTW management.", icon: UserCheck, comingSoon: true },
        { title: "Mental Health Tracking", description: "Mental health monitoring.", icon: Heart, comingSoon: true },
        { title: "Mobile Incident Capture", description: "Mobile incident reporting.", icon: Smartphone, comingSoon: true },
        { title: "Claims & Insurance", description: "Claims integration.", icon: DollarSign, comingSoon: true },
      ]
    }
  ],
  "EMS-ENV": [
    {
      title: "Core Engine",
      modules: [
        { title: "Permit Management", description: "Environmental permits.", icon: FileText, comingSoon: true },
        { title: "Emissions Monitoring", description: "Emissions tracking.", icon: Wind, comingSoon: true },
        { title: "Waste & Water", description: "Waste and water management.", icon: Droplets, comingSoon: true },
        { title: "Pollution Control", description: "Pollution prevention.", icon: Factory, comingSoon: true },
        { title: "Environmental Incidents", description: "Environmental incidents.", icon: AlertTriangle, comingSoon: true },
        { title: "Sampling & Monitoring", description: "Environmental sampling.", icon: TestTube, comingSoon: true },
        { title: "Compliance Calendar", description: "Compliance scheduling.", icon: Calendar, comingSoon: true },
        { title: "Environmental Risk", description: "Environmental risk assessment.", icon: Shield, comingSoon: true },
        { title: "Biodiversity", description: "Biodiversity management.", icon: Leaf, comingSoon: true },
        { title: "KPIs & Dashboards", description: "Environmental dashboards.", icon: BarChart3, comingSoon: true },
        { title: "Permit Alerts", description: "Permit notifications.", icon: AlertCircle, comingSoon: true },
        { title: "Environmental Objectives", description: "Objectives tracking.", icon: Target, comingSoon: true },
      ]
    },
    {
      title: "Advanced Modules",
      modules: [
        { title: "GIS Mapping", description: "Geographic mapping.", icon: Map, comingSoon: true },
        { title: "IoT Sensors", description: "IoT sensor integration.", icon: Radio, comingSoon: true },
        { title: "Lab Integration", description: "Laboratory integration.", icon: Microscope, comingSoon: true },
        { title: "Contractor & Carrier", description: "Contractor management.", icon: Truck, comingSoon: true },
        { title: "Environmental Audits", description: "Environmental audits.", icon: ClipboardCheck, comingSoon: true },
        { title: "Permit Automation", description: "Automated permits.", icon: Workflow, comingSoon: true },
        { title: "Environmental Training", description: "Environmental training.", icon: GraduationCap, comingSoon: true },
      ]
    }
  ],
  "EMS-ENERGY": [
    {
      title: "Core",
      modules: [
        { title: "Energy Metering", description: "Energy metering.", icon: Gauge, comingSoon: true },
        { title: "Energy Data Management", description: "Energy data tracking.", icon: Database, comingSoon: true },
        { title: "EnPI & Benchmarking", description: "Energy performance indicators.", icon: BarChart3, comingSoon: true },
        { title: "Energy Audits", description: "Energy audits.", icon: ClipboardCheck, comingSoon: true },
        { title: "Project Tracking", description: "Energy project tracking.", icon: ListChecks, comingSoon: true },
        { title: "Load Management", description: "Load management.", icon: Zap, comingSoon: true },
        { title: "Renewable Tracking", description: "Renewable energy tracking.", icon: Leaf, comingSoon: true },
        { title: "Baselines", description: "Energy baselines.", icon: LineChart, comingSoon: true },
        { title: "ISO 50001 Reporting", description: "ISO 50001 compliance.", icon: FileSpreadsheet, comingSoon: true },
        { title: "Billing & Cost", description: "Cost allocation.", icon: DollarSign, comingSoon: true },
        { title: "Anomaly Alerts", description: "Energy anomaly detection.", icon: AlertCircle, comingSoon: true },
        { title: "BMS/SCADA", description: "BMS/SCADA integration.", icon: Settings, comingSoon: true },
      ]
    },
    {
      title: "Advanced Modules",
      modules: [
        { title: "Predictive Optimization", description: "Predictive energy optimization.", icon: Brain, comingSoon: true },
        { title: "DER Management", description: "Distributed energy resources.", icon: Network, comingSoon: true },
        { title: "EV Charging", description: "EV charging management.", icon: Car, comingSoon: true },
        { title: "Tariff Optimization", description: "Tariff optimization.", icon: Calculator, comingSoon: true },
        { title: "Demand Response", description: "Automated demand response.", icon: Workflow, comingSoon: true },
        { title: "ESG Carbon Link", description: "Carbon ESG integration.", icon: Globe, comingSoon: true },
      ]
    }
  ],
  "Advanced AI": [
    {
      title: "AI Capabilities",
      modules: [
        { title: "Data Ingestion", description: "Data ingestion and feature store.", icon: Database, comingSoon: true },
        { title: "Predictive Analytics", description: "Predictive analytics models.", icon: TrendingUp, comingSoon: true },
        { title: "Anomaly Detection", description: "AI anomaly detection.", icon: AlertCircle, comingSoon: true },
        { title: "NLP", description: "Natural language processing.", icon: FileSearch, comingSoon: true },
        { title: "Computer Vision", description: "Computer vision capabilities.", icon: Eye, comingSoon: true },
        { title: "Prescriptive Analytics", description: "Prescriptive recommendations.", icon: Lightbulb, comingSoon: true },
        { title: "Root Cause Automation", description: "Automated root cause analysis.", icon: Search, comingSoon: true },
        { title: "Process Mining", description: "Process mining tools.", icon: Workflow, comingSoon: true },
        { title: "Knowledge Graphs", description: "Knowledge graph construction.", icon: Network, comingSoon: true },
        { title: "Digital Twins", description: "Digital twin simulation.", icon: Layers, comingSoon: true },
        { title: "ModelOps", description: "Model governance.", icon: Settings, comingSoon: true },
        { title: "Auto-Classification", description: "Automatic classification.", icon: Cpu, comingSoon: true },
        { title: "Conversational AI", description: "AI chatbot capabilities.", icon: Bot, comingSoon: true },
        { title: "Document Intelligence", description: "Document AI processing.", icon: FileText, comingSoon: true },
        { title: "Explainable AI", description: "XAI interpretability.", icon: HelpCircle, comingSoon: true },
        { title: "Risk Scoring", description: "AI risk scoring.", icon: Target, comingSoon: true },
        { title: "Synthetic Data", description: "Synthetic data generation.", icon: Database, comingSoon: true },
        { title: "Auto-Generated Insights", description: "Automated insight generation.", icon: Brain, comingSoon: true },
      ]
    }
  ],
  "Cross Modules & Platform Services": [
    {
      title: "Platform Services",
      modules: [
        { title: "Multi-Tenancy", description: "Multi-tenant architecture.", icon: Building2, comingSoon: true },
        { title: "RBAC", description: "Role-based access control.", icon: Users, comingSoon: true },
        { title: "SSO/MFA/SAML", description: "Authentication services.", icon: Key, comingSoon: true },
        { title: "Audit Trails", description: "Complete audit logging.", icon: FileSearch, comingSoon: true },
        { title: "Workflow Designer", description: "Low-code workflow designer.", icon: Workflow, comingSoon: true },
        { title: "Mobile Apps", description: "Mobile applications.", icon: Smartphone, comingSoon: true },
        { title: "Notifications Engine", description: "Notification services.", icon: Mail, comingSoon: true },
        { title: "Reporting Engine", description: "Report generation.", icon: FileSpreadsheet, comingSoon: true },
        { title: "Dashboards & Analytics", description: "Ad-hoc analytics.", icon: PieChart, comingSoon: true },
        { title: "Data Retention", description: "Data retention policies.", icon: HardDrive, comingSoon: true },
        { title: "API Gateway", description: "API management.", icon: Plug, comingSoon: true },
        { title: "Integrations Marketplace", description: "Integration marketplace.", icon: Share2, comingSoon: true },
        { title: "Encryption & Security", description: "Security services.", icon: Lock, comingSoon: true },
        { title: "Tenant Templates", description: "Tenant configuration templates.", icon: FileCode, comingSoon: true },
        { title: "Localization", description: "Multi-language support.", icon: Languages, comingSoon: true },
        { title: "Backup & DR", description: "Backup and disaster recovery.", icon: Cloud, comingSoon: true },
        { title: "Consent & PII Masking", description: "Privacy management.", icon: Fingerprint, comingSoon: true },
        { title: "Billing & Metering", description: "Usage metering.", icon: CreditCard, comingSoon: true },
        { title: "Admin Consoles", description: "Administration consoles.", icon: Settings, comingSoon: true },
        { title: "Data Warehouse Export", description: "Data export capabilities.", icon: Database, comingSoon: true },
      ]
    }
  ]
};
