export type SddStandardId =
  | "iso-25010"
  | "owasp-asvs"
  | "agile-manifesto"
  | "cmmi-dev";

export interface SddRequirement {
  id: string;
  title: string;
  description: string;
  category: "functional" | "non-functional";
  drivers: string[];
  acceptanceCriteria: string[];
  priority: "critical" | "high" | "medium" | "low";
}

export interface SddNonFunctionalRequirementInput {
  attribute: string;
  metric: string;
  target: string;
  rationale?: string;
}

export interface SddStakeholderProfile {
  name: string;
  role: string;
  expectations: string[];
  engagementModel?: string;
}

export interface SddSpecificationInput {
  projectName: string;
  domain: string;
  summary: string;
  businessDrivers: string[];
  stakeholders: SddStakeholderProfile[];
  primaryModules: string[];
  requirements: SddRequirement[];
  nonFunctionalRequirements: SddNonFunctionalRequirementInput[];
  constraints?: string[];
  complianceTargets?: SddStandardId[];
  successCriteria?: string[];
  deliveryTimelineWeeks?: number;
}

export interface SddNonFunctionalRequirement {
  attribute: string;
  metric: string;
  target: string;
  rationale?: string;
  riskLevel: "low" | "medium" | "high";
}

export interface SddFunctionalTheme {
  name: string;
  description: string;
  supportingRequirements: string[];
  successSignals: string[];
}

export interface SddComplianceFinding {
  standardId: SddStandardId;
  score: number;
  summary: string;
  gaps: string[];
  recommendations: string[];
}

export interface SddRiskItem {
  id: string;
  title: string;
  probability: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
  mitigationPlan: string;
}

export interface SddSpecification {
  projectName: string;
  domain: string;
  executiveSummary: string;
  functionalThemes: SddFunctionalTheme[];
  nonFunctionalMatrix: SddNonFunctionalRequirement[];
  constraints: string[];
  successCriteria: string[];
  compliance: SddComplianceFinding[];
  risks: SddRiskItem[];
  createdAt: string;
}

export interface SddArchitecturePrinciple {
  name: string;
  statement: string;
  rationale: string;
  practices: string[];
}

export interface SddTechnologyChoice {
  layer: string;
  recommendation: string;
  justification: string;
  alternatives: string[];
}

export interface SddDeliveryPhase {
  id: string;
  name: string;
  durationWeeks: number;
  objectives: string[];
  entryCriteria: string[];
  exitCriteria: string[];
}

export interface SddTechnicalPlan {
  architecturePrinciples: SddArchitecturePrinciple[];
  technologyStack: SddTechnologyChoice[];
  deliveryPhases: SddDeliveryPhase[];
  automationBacklog: string[];
  qualityGates: string[];
  complianceFollowUps: SddComplianceFinding[];
  lastUpdated: string;
}

export type SddTaskStatus = "pending" | "in_progress" | "blocked" | "done";

export interface SddTask {
  id: string;
  title: string;
  description: string;
  owner?: string;
  status: SddTaskStatus;
  category: "analysis" | "planning" | "build" | "qa" | "governance";
  estimateHours: number;
  dependencies: string[];
  deliverables: string[];
  tags: string[];
}

export interface SddTaskBoard {
  swimlanes: Record<string, string[]>;
  focusAreas: string[];
}

export interface SddTaskPlan {
  tasks: SddTask[];
  board: SddTaskBoard;
  criticalPath: string[];
  generatedAt: string;
}

export interface SddTaskUpdate {
  taskId: string;
  status?: SddTaskStatus;
  owner?: string;
  note?: string;
}

export interface SddProgressSnapshot {
  timestamp: string;
  completed: number;
  inProgress: number;
  blocked: number;
  remainingHours: number;
  burndownNotes: string[];
}

export interface SddImplementationReport {
  title: string;
  summary: string;
  progress: SddProgressSnapshot;
  highlights: string[];
  blockers: string[];
  complianceDelta: SddComplianceFinding[];
  recommendations: string[];
}

export interface SddInitOptions {
  projectName: string;
  domain: string;
  description: string;
  outputDir?: string;
}

export interface SddConstitutionOptions {
  guidingPrinciples: string[];
  governanceModel: string;
  deliveryCadence: string;
}

export interface SddPlanOptions {
  specification?: SddSpecification;
}

export interface SddTasksOptions {
  plan?: SddTechnicalPlan;
}

export interface SddImplementationInput {
  updates?: SddTaskUpdate[];
  narrativeHighlights?: string[];
  blockers?: string[];
}

export interface SddTemplateRegistry {
  constitution: string;
  principles: string;
  report: string;
}

export interface SddProjectState {
  metadata: {
    name: string;
    domain: string;
    description: string;
    createdAt: string;
  };
  specification?: SddSpecification;
  plan?: SddTechnicalPlan;
  taskPlan?: SddTaskPlan;
  progressHistory: SddProgressSnapshot[];
}

export interface SddEngineOptions {
  projectRoot?: string;
  templates?: Partial<SddTemplateRegistry>;
}

export interface SddModuleContext {
  state: SddProjectState;
  saveState: (state: SddProjectState) => Promise<void>;
}

export interface SddEngineModule<TInput = unknown, TResult = unknown> {
  name: string;
  execute: (input: TInput, context: SddModuleContext) => Promise<TResult>;
}
