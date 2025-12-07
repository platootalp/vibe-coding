import { SddComplianceFinding, SddImplementationReport, SddProgressSnapshot, SddTemplateRegistry } from "../types.js";
interface ReportParams {
    projectName: string;
    progress: SddProgressSnapshot;
    highlights: string[];
    blockers: string[];
    complianceDelta: SddComplianceFinding[];
    templates: SddTemplateRegistry;
    projectRoot: string;
}
export declare function composeImplementationReport(params: ReportParams): Promise<{
    report: SddImplementationReport;
    filePath: string;
}>;
export {};
//# sourceMappingURL=reportService.d.ts.map