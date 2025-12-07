export function buildTechnicalPlan(specification) {
    const architecturePrinciples = derivePrinciples(specification);
    const technologyStack = suggestTechnologyStack(specification);
    const deliveryPhases = buildDeliveryPhases(specification);
    return {
        architecturePrinciples,
        technologyStack,
        deliveryPhases,
        automationBacklog: [
            "流水线：静态扫描 + 单元测试 + 构建 + 部署",
            "质量门禁：关键指标未达标即阻断",
            "知识库：自动生成规范与报告"
        ],
        qualityGates: [
            "规范审查通过",
            "关键指标度量可用",
            "安全扫描零阻塞"
        ],
        complianceFollowUps: specification.compliance.filter((finding) => finding.gaps.length > 0),
        lastUpdated: new Date().toISOString()
    };
}
function derivePrinciples(spec) {
    return spec.functionalThemes.map((theme) => ({
        name: `${theme.name} 端到端`,
        statement: `围绕 ${theme.name} 打造可扩展能力`,
        rationale: `${theme.description}，确保需求可持续演化`,
        practices: [
            "模块边界清晰",
            "可观测性纳入设计",
            "公共契约自动化测试"
        ]
    }));
}
function suggestTechnologyStack(spec) {
    return [
        {
            layer: "接口层",
            recommendation: "Node.js + GraphQL / REST 混合",
            justification: "满足多终端编排需求",
            alternatives: ["Go HTTP", "Java Spring"]
        },
        {
            layer: "体验层",
            recommendation: "React + Tailwind + 状态图引擎",
            justification: "便于快速搭建可视化 SDD 工具",
            alternatives: ["Vue", "Svelte"]
        },
        {
            layer: "知识存储",
            recommendation: "JSON 文档库 + 向量索引",
            justification: "支持规范模板与搜索",
            alternatives: ["PostgreSQL", "SQLite"]
        }
    ];
}
function buildDeliveryPhases(spec) {
    const baseTimeline = Math.max(12, spec.successCriteria.length * 2);
    return [
        {
            id: "discovery",
            name: "洞察与规范化",
            durationWeeks: Math.round(baseTimeline * 0.25),
            objectives: ["锁定业务驱动", "完成规范建模"],
            entryCriteria: ["核心干系人确认"],
            exitCriteria: ["规范包版本 v1"],
        },
        {
            id: "foundation",
            name: "技术方案与底座",
            durationWeeks: Math.round(baseTimeline * 0.35),
            objectives: ["完成技术蓝图", "建立自助化工具"],
            entryCriteria: ["规范包可执行"],
            exitCriteria: ["通过质量门禁"],
        },
        {
            id: "scale",
            name: "增量交付",
            durationWeeks: Math.round(baseTimeline * 0.4),
            objectives: ["迭代交付任务", "生成实施报告"],
            entryCriteria: ["底座上线"],
            exitCriteria: ["整体验收"],
        }
    ];
}
//# sourceMappingURL=planningService.js.map