import {
  SddComplianceFinding,
  SddNonFunctionalRequirementInput,
  SddRequirement,
  SddStandardId
} from "../types.js";

export interface ComplianceContext {
  businessDrivers: string[];
  nonFunctionalRequirements: SddNonFunctionalRequirementInput[];
  requirements: SddRequirement[];
}

interface RuleEvaluation {
  summary: string;
  score: number;
  gaps: string[];
  recommendations: string[];
}

type RuleEvaluator = (context: ComplianceContext) => RuleEvaluation;

const ruleEvaluators: Record<SddStandardId, RuleEvaluator> = {
  "iso-25010": (context) => {
    const coverage = context.nonFunctionalRequirements.length;
    const hasReliability = context.nonFunctionalRequirements.some((item) =>
      /reliab|uptime|availability/i.test(item.attribute)
    );
    const hasSecurity = context.nonFunctionalRequirements.some((item) =>
      /security|privacy|access/i.test(item.attribute)
    );

    const baseScore = 60 + Math.min(coverage * 5, 25);
    const score = Math.min(baseScore + (hasReliability ? 5 : 0) + (hasSecurity ? 5 : 0), 95);

    const gaps: string[] = [];
    if (!hasReliability) {
      gaps.push("缺少可靠性或可用性指标");
    }
    if (!hasSecurity) {
      gaps.push("缺少安全相关的度量");
    }

    return {
      summary: "产品质量模型覆盖度评估",
      score,
      gaps,
      recommendations: [
        "为每个质量属性定义可量化指标",
        "维护指标与业务目标的映射"
      ]
    };
  },
  "owasp-asvs": (context) => {
    const securityRequirements = context.requirements.filter((req) =>
      /security|auth|encryption|audit|owasp/i.test(req.description + req.title)
    );

    const hasThreatModel = context.businessDrivers.some((driver) =>
      /threat|attack|compliance|risk/i.test(driver)
    );

    const score = Math.min(55 + securityRequirements.length * 6 + (hasThreatModel ? 15 : 0), 90);
    const gaps = securityRequirements.length < 3 ? ["安全需求不足，建议覆盖鉴权/日志/加密"] : [];

    return {
      summary: "应用安全控制成熟度",
      score,
      gaps,
      recommendations: [
        "引入威胁建模工作坊",
        "将安全验收准入条件纳入质量门禁"
      ]
    };
  },
  "agile-manifesto": (context) => {
    const iterativeSignals = context.businessDrivers.filter((driver) =>
      /iteration|agile|sprint|feedback|increment/i.test(driver)
    );

    const score = Math.min(50 + iterativeSignals.length * 10, 85);
    const gaps = iterativeSignals.length === 0 ? ["缺少迭代式交付驱动"] : [];

    return {
      summary: "敏捷价值匹配度",
      score,
      gaps,
      recommendations: [
        "明确 MVP 范围与反馈节奏",
        "建立可视化交付节奏仪表盘"
      ]
    };
  },
  "cmmi-dev": (context) => {
    const governanceSignals = context.requirements.filter((req) =>
      /process|compliance|audit|trace/i.test(req.description)
    );
    const score = Math.min(45 + governanceSignals.length * 8, 80);
    const gaps = governanceSignals.length < 2 ? ["过程治理活动未显式建模"] : [];

    return {
      summary: "过程成熟度基线",
      score,
      gaps,
      recommendations: [
        "为关键里程碑设定检查表",
        "跟踪需求到交付的全链路可追溯性"
      ]
    };
  }
};

export function evaluateCompliance(
  requestedStandards: SddStandardId[] | undefined,
  context: ComplianceContext
): SddComplianceFinding[] {
  const standards = requestedStandards?.length
    ? requestedStandards
    : (Object.keys(ruleEvaluators) as SddStandardId[]);

  return standards.map((standardId) => {
    const evaluation = ruleEvaluators[standardId](context);
    return {
      standardId,
      summary: evaluation.summary,
      score: evaluation.score,
      gaps: evaluation.gaps,
      recommendations: evaluation.recommendations
    };
  });
}
