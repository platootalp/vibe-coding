import { SddProgressSnapshot, SddSpecification, SddTaskPlan, SddTaskUpdate, SddTechnicalPlan } from "../types.js";
export declare function deriveTaskPlan(specification: SddSpecification, plan: SddTechnicalPlan): SddTaskPlan;
export declare function applyTaskUpdates(taskPlan: SddTaskPlan, updates: SddTaskUpdate[]): SddTaskPlan;
export declare function summarizeProgress(taskPlan: SddTaskPlan): SddProgressSnapshot;
//# sourceMappingURL=taskService.d.ts.map