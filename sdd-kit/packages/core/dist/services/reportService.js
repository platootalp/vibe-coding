import path from "path";
import { renderTemplate } from "../utils/templateRenderer.js";
import { writeFileSafe } from "../utils/fileSystem.js";
export async function composeImplementationReport(params) {
    const report = {
        title: `${params.projectName} 实施报告`,
        summary: params.highlights[0] ?? "持续推进中",
        progress: params.progress,
        highlights: params.highlights,
        blockers: params.blockers,
        complianceDelta: params.complianceDelta,
        recommendations: [
            "保持每日节奏会跟踪风险",
            "将最新规范版本同步至知识库"
        ]
    };
    const content = renderTemplate(params.templates.report, {
        projectName: params.projectName,
        generatedAt: params.progress.timestamp,
        completedPercent: Math.round((params.progress.completed / Math.max(1, params.progress.completed + params.progress.inProgress)) *
            100),
        remainingHours: params.progress.remainingHours,
        highlights: params.highlights,
        blockers: params.blockers,
        complianceDelta: params.complianceDelta.map((finding) => ({
            standard: finding.standardId,
            summary: finding.summary
        })),
        recommendations: report.recommendations
    });
    const reportsDir = path.join(params.projectRoot, "reports");
    const filePath = path.join(reportsDir, `sdd-report-${new Date(params.progress.timestamp).toISOString().replace(/[:.]/g, "-")}.md`);
    await writeFileSafe(filePath, content);
    return { report, filePath };
}
//# sourceMappingURL=reportService.js.map