import { SddComplianceFinding, SddNonFunctionalRequirementInput, SddRequirement, SddStandardId } from "../types.js";
export interface ComplianceContext {
    businessDrivers: string[];
    nonFunctionalRequirements: SddNonFunctionalRequirementInput[];
    requirements: SddRequirement[];
}
export declare function evaluateCompliance(requestedStandards: SddStandardId[] | undefined, context: ComplianceContext): SddComplianceFinding[];
//# sourceMappingURL=complianceService.d.ts.map