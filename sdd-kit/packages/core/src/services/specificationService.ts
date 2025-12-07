import { randomUUID } from "crypto";
import {
  SddFunctionalTheme,
  SddNonFunctionalRequirement,
  SddNonFunctionalRequirementInput,
  SddRequirement,
  SddRiskItem,
  SddSpecification,
  SddSpecificationInput
} from "../types.js";
import { ComplianceContext, evaluateCompliance } from "./complianceService.js";

export function generateSpecification(
  input: SddSpecificationInput
): SddSpecification {
  const complianceContext: ComplianceContext = {
    businessDrivers: input.businessDrivers,
    nonFunctionalRequirements: input.nonFunctionalRequirements,
    requirements: input.requirements
  };

  const compliance = evaluateCompliance(input.complianceTargets, complianceContext);

  const functionalThemes = buildFunctionalThemes(
    input.primaryModules,
    input.requirements
  );
  const nonFunctionalMatrix = buildNonFunctionalMatrix(
    input.nonFunctionalRequirements
  );
  const risks = deriveRisks(input.constraints ?? [], nonFunctionalMatrix);

  return {
    projectName: input.projectName,
    domain: input.domain,
    executiveSummary: `${input.projectName} 旨在 ${input.summary}，面向 ${input.domain} 领域，通过 ${input.primaryModules.join(", ") || "核心模块"} 提升业务驱动。`,
    functionalThemes,
    nonFunctionalMatrix,
    constraints: input.constraints ?? [],
    successCriteria: input.successCriteria ?? [
      "建立端到端可观测链路",
      "实现首个可用 MVP"
    ],
    compliance,
    risks,
    createdAt: new Date().toISOString()
  };
}

function buildFunctionalThemes(
  modules: string[],
  requirements: SddRequirement[]
): SddFunctionalTheme[] {
  if (!modules.length) {
    return [
      {
        name: "核心体验",
        description: "围绕关键用户价值主张构建端到端体验",
        supportingRequirements: requirements.map((req) => req.id),
        successSignals: ["实现端到端正向体验", "关键指标达到发布门槛"]
      }
    ];
  }

  return modules.map((moduleName) => {
    const relatedReqs = requirements.filter((req) =>
      req.title.toLowerCase().includes(moduleName.toLowerCase())
    );

    return {
      name: moduleName,
      description: `实现 ${moduleName} 模块以支撑主要业务场景。`,
      supportingRequirements: relatedReqs.map((req) => req.id),
      successSignals: [
        `${moduleName} 完成端到端流转`,
        "关键关键业务指标达到预期"
      ]
    };
  });
}

function buildNonFunctionalMatrix(
  requirements: SddNonFunctionalRequirementInput[]
): SddNonFunctionalRequirement[] {
  return requirements.map((item) => {
    const riskLevel: "low" | "medium" | "high" = /99|99\.9|严格|严格|安全/i.test(
      `${item.attribute} ${item.metric} ${item.target}`
    )
      ? "high"
      : item.attribute.length > 8
      ? "medium"
      : "low";

    return {
      attribute: item.attribute,
      metric: item.metric,
      target: item.target,
      rationale: item.rationale,
      riskLevel
    };
  });
}

function deriveRisks(
  constraints: string[],
  nonFunctionalMatrix: SddNonFunctionalRequirement[]
): SddRiskItem[] {
  const risks: SddRiskItem[] = constraints.map((constraint) => ({
    id: randomUUID(),
    title: constraint,
    probability: /legacy|external|dependency/i.test(constraint) ? "high" : "medium",
    impact: /security|compliance|finance/i.test(constraint) ? "high" : "medium",
    mitigationPlan: "建立跨团队同步机制并限定风险缓解决策窗口"
  }));

  nonFunctionalMatrix.forEach((nfr) => {
    if (nfr.riskLevel === "high") {
      risks.push({
        id: randomUUID(),
        title: `${nfr.attribute} 指标存在挑战`,
        probability: "medium",
        impact: "high",
        mitigationPlan: `在技术方案阶段预留 ${nfr.attribute} 相关验证实验`
      });
    }
  });

  return risks;
}
