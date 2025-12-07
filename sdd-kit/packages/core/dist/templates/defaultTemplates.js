export const defaultTemplates = {
    constitution: `# {{projectName}} 研发宪章\n\n> 领域：{{domain}}\n> 使命：{{description}}\n\n## 交付基本法\n{{#principles}}- {{.}}\n{{/principles}}\n\n## 治理模型\n{{governanceModel}}\n\n## 交付节奏\n{{deliveryCadence}}\n\n## 质量红线\n{{#qualityBar}}- {{.}}\n{{/qualityBar}}\n\n## 合规对齐\n{{#compliance}}- {{standard}}：{{summary}}\n{{/compliance}}\n\n---\n由 SDD Kit 自动生成于 {{generatedAt}}\n`,
    principles: `# 开发基本原则\n\n{{#principles}}## {{title}}\n{{statement}}\n- 影响面：{{impact}}\n- 保障手段：{{practices}}\n\n{{/principles}}`,
    report: `# {{projectName}} 实施报告\n\n- 更新时间：{{generatedAt}}\n- 完成度：{{completedPercent}}%\n- 剩余工时：{{remainingHours}} 小时\n\n## 亮点\n{{#highlights}}- {{.}}\n{{/highlights}}\n\n## 阻塞\n{{#blockers}}- {{.}}\n{{/blockers}}\n\n## 标准偏差\n{{#complianceDelta}}- {{standard}}：{{summary}}\n{{/complianceDelta}}\n\n## 下一步\n{{#recommendations}}- {{.}}\n{{/recommendations}}\n`
};
export function resolveTemplates(custom) {
    return {
        constitution: custom?.constitution ?? defaultTemplates.constitution,
        principles: custom?.principles ?? defaultTemplates.principles,
        report: custom?.report ?? defaultTemplates.report
    };
}
//# sourceMappingURL=defaultTemplates.js.map