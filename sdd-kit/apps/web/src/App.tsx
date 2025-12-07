import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  SddSpecificationInput,
  SddTaskStatus,
  SddTasksOptions,
  SddTemplateRegistry
} from "@sdd/core";
import { api } from "./lib/api";

const statusLabel: Record<SddTaskStatus, string> = {
  pending: "待开始",
  in_progress: "进行中",
  blocked: "受阻",
  done: "已完成"
};

const statusColor: Record<SddTaskStatus, string> = {
  pending: "#c084fc",
  in_progress: "#38bdf8",
  blocked: "#f97316",
  done: "#22c55e"
};

export default function App() {
  const queryClient = useQueryClient();
  const [initForm, setInitForm] = useState({ name: "", domain: "", summary: "" });
  const [specForm, setSpecForm] = useState({
    projectName: "",
    domain: "",
    summary: "",
    businessDrivers: "",
    modules: "",
    stakeholders: "",
    constraints: "",
    successCriteria: "",
    qualityTargets: "",
    timeline: "24"
  });
  const [implementForm, setImplementForm] = useState({
    taskId: "",
    status: "in_progress" as SddTaskStatus,
    owner: "",
    note: "",
    highlights: "",
    blockers: ""
  });
  const [templateDrafts, setTemplateDrafts] = useState<Partial<SddTemplateRegistry>>({});
  const [constitutionForm, setConstitutionForm] = useState({
    principles: "",
    governance: "",
    cadence: ""
  });
  const [toast, setToast] = useState<string | null>(null);

  const { data: projectState, isFetching: loadingState } = useQuery({
    queryKey: ["state"],
    queryFn: api.fetchState,
    refetchInterval: 10000
  });

  const { data: taskPlan } = useQuery({
    queryKey: ["taskPlan"],
    queryFn: api.fetchTaskPlan,
    refetchInterval: 10000
  });

  const { data: progressHistory } = useQuery({
    queryKey: ["progress"],
    queryFn: api.fetchProgress,
    refetchInterval: 12000
  });

  const { data: templates } = useQuery({
    queryKey: ["templates"],
    queryFn: api.fetchTemplates
  });

  useEffect(() => {
    if (templates) {
      setTemplateDrafts(templates);
    }
  }, [templates]);

  const initMutation = useMutation({
    mutationFn: api.initProject,
    onSuccess: () => {
      showToast("项目框架已生成");
      invalidateCore();
    }
  });

  const specMutation = useMutation({
    mutationFn: api.createSpecification,
    onSuccess: () => {
      showToast("规范生成成功");
      invalidateCore();
    }
  });

  const planMutation = useMutation({
    mutationFn: (payload: { specification?: SddSpecificationInput }) =>
      api.buildPlan(payload),
    onSuccess: () => {
      showToast("技术方案已更新");
      invalidateCore();
    }
  });

  const tasksMutation = useMutation({
    mutationFn: (payload: { plan?: SddTasksOptions["plan"] }) =>
      api.generateTasks(payload),
    onSuccess: () => {
      showToast("任务清单已刷新");
      invalidateCore();
    }
  });

  const implementMutation = useMutation({
    mutationFn: api.implement,
    onSuccess: () => {
      showToast("任务进展已同步");
      invalidateCore();
    }
  });

  const templateMutation = useMutation({
    mutationFn: api.updateTemplates,
    onSuccess: () => {
      showToast("模板已保存");
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    }
  });

  const constitutionMutation = useMutation({
    mutationFn: api.updateConstitution,
    onSuccess: () => showToast("宪章已更新")
  });

  const progressStats = useMemo(() => {
    if (!taskPlan) {
      return { total: 0, statusCount: {} as Record<SddTaskStatus, number> };
    }
    const statusCount: Record<SddTaskStatus, number> = {
      pending: 0,
      in_progress: 0,
      blocked: 0,
      done: 0
    };
    taskPlan.tasks.forEach((task) => {
      statusCount[task.status] += 1;
    });
    return { total: taskPlan.tasks.length, statusCount };
  }, [taskPlan]);

  function invalidateCore() {
    queryClient.invalidateQueries({ queryKey: ["state"] });
    queryClient.invalidateQueries({ queryKey: ["taskPlan"] });
    queryClient.invalidateQueries({ queryKey: ["progress"] });
  }

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }

  function parseLines(value: string) {
    return value
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  }

  function buildSpecificationPayload(): SddSpecificationInput {
    const drivers = parseLines(specForm.businessDrivers);
    const modules = parseLines(specForm.modules);
    const constraints = parseLines(specForm.constraints);
    const successCriteria = parseLines(specForm.successCriteria);
    const stakeholders = parseLines(specForm.stakeholders).map((line) => {
      const [name, role = "", expectations = ""] = line.split("|");
      return {
        name: name?.trim() ?? "未命名",
        role: role.trim() || "Owner",
        expectations: expectations.split(",").map((entry) => entry.trim()).filter(Boolean)
      };
    });

    const qualityMatrix = parseLines(specForm.qualityTargets).map((line) => {
      const [attribute, metric, target] = line.split("|");
      return {
        attribute: attribute?.trim() ?? "性能",
        metric: metric?.trim() ?? "P95",
        target: target?.trim() ?? "500ms"
      };
    });

    const requirements = (modules.length ? modules : ["核心体验"]).map((module, index) => ({
      id: `REQ-${index + 1}`,
      title: `${module} 能力`,
      description: `实现 ${module} 模块以支撑业务驱动`,
      category: "functional" as const,
      drivers: drivers.slice(0, 3),
      acceptanceCriteria: [
        `${module} 可完成端到端演练`,
        `${module} 指标满足定义`
      ],
      priority: index === 0 ? "critical" : "high"
    }));

    return {
      projectName:
        specForm.projectName || projectState?.metadata?.name || initForm.name || "SDD 项目",
      domain: specForm.domain || projectState?.metadata?.domain || initForm.domain || "general",
      summary:
        specForm.summary || projectState?.metadata?.description || initForm.summary || "",
      businessDrivers: drivers.length ? drivers : ["确保规范可执行", "全流程透明"],
      stakeholders: stakeholders.length
        ? stakeholders
        : [
            {
              name: "产品负责人",
              role: "Product",
              expectations: ["获得端到端透明度"]
            }
          ],
      primaryModules: modules.length ? modules : ["规范工作台"],
      requirements,
      nonFunctionalRequirements: qualityMatrix.length
        ? qualityMatrix
        : [
            { attribute: "性能", metric: "P95", target: "500ms" },
            { attribute: "可用性", metric: "SLA", target: "99.9%" }
          ],
      constraints,
      complianceTargets: ["iso-25010", "owasp-asvs", "agile-manifesto"],
      successCriteria: successCriteria.length ? successCriteria : ["发布第一版 SDD 包"],
      deliveryTimelineWeeks: Number(specForm.timeline || 24)
    };
  }

  function handleInitSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    initMutation.mutate({
      projectName: initForm.name,
      domain: initForm.domain,
      description: initForm.summary
    });
  }

  function handleSpecSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = buildSpecificationPayload();
    specMutation.mutate(payload);
  }

  function handlePlanClick() {
    planMutation.mutate({});
  }

  function handleTasksClick() {
    tasksMutation.mutate({});
  }

  function handleImplementSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    implementMutation.mutate({
      updates: implementForm.taskId
        ? [
            {
              taskId: implementForm.taskId,
              status: implementForm.status,
              owner: implementForm.owner,
              note: implementForm.note
            }
          ]
        : undefined,
      narrativeHighlights: parseLines(implementForm.highlights),
      blockers: parseLines(implementForm.blockers)
    });
  }

  function handleTemplateSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    templateMutation.mutate(templateDrafts);
  }

  function handleConstitutionSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const principles = parseLines(constitutionForm.principles);
    constitutionMutation.mutate({
      guidingPrinciples: principles.length ? principles : ["透明化", "标准化"],
      governanceModel:
        constitutionForm.governance || "双周节奏会 + 规范审查委员会",
      deliveryCadence: constitutionForm.cadence || "双周增量"
    });
  }

  return (
    <div className="app-shell">
      <header style={{ marginBottom: 32 }}>
        <p className="status-pill">
          {loadingState ? "同步中..." : "实时同步"}
        </p>
        <h1>SDD Kit 控制台</h1>
        <p>统一管理规范生成、计划推进、任务执行与报告。</p>
        {toast && <div className="status-pill" style={{ background: "#dcfce7", color: "#15803d" }}>{toast}</div>}
      </header>

      <section className="grid two-columns">
        <div className="card">
          <h2>1. 项目初始化 (/sdd.init)</h2>
          <form onSubmit={handleInitSubmit}>
            <label>项目名称</label>
            <input
              value={initForm.name}
              onChange={(event) => setInitForm({ ...initForm, name: event.target.value })}
              required
            />
            <label>领域</label>
            <input
              value={initForm.domain}
              onChange={(event) => setInitForm({ ...initForm, domain: event.target.value })}
              required
            />
            <label>项目愿景</label>
            <textarea
              value={initForm.summary}
              onChange={(event) => setInitForm({ ...initForm, summary: event.target.value })}
              required
            />
            <button type="submit" disabled={initMutation.isLoading}>
              {initMutation.isLoading ? "生成中..." : "生成基础框架"}
            </button>
          </form>
        </div>

        <div className="card">
          <h2>2. 规范与计划 (/sdd.specify, /sdd.plan, /sdd.tasks)</h2>
          <form onSubmit={handleSpecSubmit}>
            <label>项目名称</label>
            <input
              value={specForm.projectName}
              placeholder={projectState?.metadata?.name ?? ""}
              onChange={(event) => setSpecForm({ ...specForm, projectName: event.target.value })}
            />
            <label>领域</label>
            <input
              value={specForm.domain}
              placeholder={projectState?.metadata?.domain ?? ""}
              onChange={(event) => setSpecForm({ ...specForm, domain: event.target.value })}
            />
            <label>业务愿景</label>
            <textarea
              value={specForm.summary}
              placeholder="例如：打造可复制的规范自动化体验"
              onChange={(event) => setSpecForm({ ...specForm, summary: event.target.value })}
            />
            <label>业务驱动 (每行一个)</label>
            <textarea
              value={specForm.businessDrivers}
              placeholder="敏捷透明\n合规可追溯"
              onChange={(event) =>
                setSpecForm({ ...specForm, businessDrivers: event.target.value })
              }
            />
            <label>关键模块</label>
            <textarea
              value={specForm.modules}
              placeholder="规范工作台\n任务编排"
              onChange={(event) => setSpecForm({ ...specForm, modules: event.target.value })}
            />
            <label>干系人 (姓名|角色|期望,逗号分隔)</label>
            <textarea
              value={specForm.stakeholders}
              placeholder="Alice|产品|透明交付,快速反馈"
              onChange={(event) =>
                setSpecForm({ ...specForm, stakeholders: event.target.value })
              }
            />
            <label>约束</label>
            <textarea
              value={specForm.constraints}
              placeholder="需兼容现有流水线"
              onChange={(event) => setSpecForm({ ...specForm, constraints: event.target.value })}
            />
            <label>成功标准</label>
            <textarea
              value={specForm.successCriteria}
              placeholder="首个业务单元上线"
              onChange={(event) => setSpecForm({ ...specForm, successCriteria: event.target.value })}
            />
            <label>质量指标 (属性|度量|目标)</label>
            <textarea
              value={specForm.qualityTargets}
              placeholder="性能|P95|500ms"
              onChange={(event) => setSpecForm({ ...specForm, qualityTargets: event.target.value })}
            />
            <label>交付周期 (周)</label>
            <input
              type="number"
              value={specForm.timeline}
              onChange={(event) => setSpecForm({ ...specForm, timeline: event.target.value })}
            />
            <button type="submit" disabled={specMutation.isLoading}>
              {specMutation.isLoading ? "生成中..." : "生成规范"}
            </button>
          </form>
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button type="button" onClick={handlePlanClick} disabled={planMutation.isLoading}>
              {planMutation.isLoading ? "生成中..." : "生成技术方案"}
            </button>
            <button type="button" onClick={handleTasksClick} disabled={tasksMutation.isLoading}>
              {tasksMutation.isLoading ? "生成中..." : "生成任务"}
            </button>
          </div>
        </div>
      </section>

      <section className="grid two-columns" style={{ marginTop: 32 }}>
        <div className="card">
          <h2>3. 任务执行 (/sdd.implement)</h2>
          <form onSubmit={handleImplementSubmit}>
            <label>任务 ID</label>
            <input
              value={implementForm.taskId}
              placeholder="可从任务清单复制"
              onChange={(event) => setImplementForm({ ...implementForm, taskId: event.target.value })}
            />
            <label>状态</label>
            <select
              value={implementForm.status}
              onChange={(event) =>
                setImplementForm({ ...implementForm, status: event.target.value as SddTaskStatus })
              }
            >
              {Object.keys(statusLabel).map((key) => (
                <option key={key} value={key}>
                  {statusLabel[key as SddTaskStatus]}
                </option>
              ))}
            </select>
            <label>负责人</label>
            <input
              value={implementForm.owner}
              onChange={(event) => setImplementForm({ ...implementForm, owner: event.target.value })}
            />
            <label>备注</label>
            <textarea
              value={implementForm.note}
              onChange={(event) => setImplementForm({ ...implementForm, note: event.target.value })}
            />
            <label>亮点 (每行一条)</label>
            <textarea
              value={implementForm.highlights}
              onChange={(event) => setImplementForm({ ...implementForm, highlights: event.target.value })}
            />
            <label>阻塞 (每行一条)</label>
            <textarea
              value={implementForm.blockers}
              onChange={(event) => setImplementForm({ ...implementForm, blockers: event.target.value })}
            />
            <button type="submit" disabled={implementMutation.isLoading}>
              {implementMutation.isLoading ? "同步中..." : "更新任务并生成报告"}
            </button>
          </form>
        </div>

        <div className="card">
          <h2>4. 模板与宪章 (/sdd.kit.constitution, /sdd.templates)</h2>
          <form onSubmit={handleConstitutionSubmit} style={{ marginBottom: 16 }}>
            <label>指导原则 (每行一条)</label>
            <textarea
              value={constitutionForm.principles}
              onChange={(event) =>
                setConstitutionForm({ ...constitutionForm, principles: event.target.value })
              }
            />
            <label>治理模型</label>
            <input
              value={constitutionForm.governance}
              onChange={(event) =>
                setConstitutionForm({ ...constitutionForm, governance: event.target.value })
              }
            />
            <label>交付节奏</label>
            <input
              value={constitutionForm.cadence}
              onChange={(event) =>
                setConstitutionForm({ ...constitutionForm, cadence: event.target.value })
              }
            />
            <button type="submit" disabled={constitutionMutation.isLoading}>
              {constitutionMutation.isLoading ? "更新中..." : "更新宪章"}
            </button>
          </form>
          <form onSubmit={handleTemplateSubmit}>
            <label>宪章模板</label>
            <textarea
              value={templateDrafts.constitution ?? ""}
              onChange={(event) =>
                setTemplateDrafts({ ...templateDrafts, constitution: event.target.value })
              }
            />
            <label>原则模板</label>
            <textarea
              value={templateDrafts.principles ?? ""}
              onChange={(event) =>
                setTemplateDrafts({ ...templateDrafts, principles: event.target.value })
              }
            />
            <label>报告模板</label>
            <textarea
              value={templateDrafts.report ?? ""}
              onChange={(event) => setTemplateDrafts({ ...templateDrafts, report: event.target.value })}
            />
            <button type="submit" disabled={templateMutation.isLoading}>
              {templateMutation.isLoading ? "保存中..." : "保存模板"}
            </button>
          </form>
        </div>
      </section>

      <section className="grid" style={{ marginTop: 32 }}>
        <div className="card">
          <h2>实时任务进度</h2>
          {taskPlan ? (
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {Object.entries(progressStats.statusCount).map(([status, count]) => (
                <div key={status} className="status-pill" style={{ background: statusColor[status as SddTaskStatus] + "20" }}>
                  <span style={{ width: 12, height: 12, borderRadius: "50%", background: statusColor[status as SddTaskStatus] }} />
                  {statusLabel[status as SddTaskStatus]} {count}
                </div>
              ))}
              <div className="status-pill" style={{ background: "#f0fdf4", color: "#15803d" }}>
                总计 {progressStats.total}
              </div>
            </div>
          ) : (
            <p>暂无任务，请先生成列表。</p>
          )}
        </div>
        <div className="card">
          <h2>任务清单</h2>
          {taskPlan ? (
            <div style={{ maxHeight: 320, overflow: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>任务</th>
                    <th>状态</th>
                    <th>估时</th>
                    <th>负责人</th>
                  </tr>
                </thead>
                <tbody>
                  {taskPlan.tasks.map((task) => (
                    <tr key={task.id}>
                      <td>
                        <strong>{task.title}</strong>
                        <br />
                        <small>{task.id}</small>
                      </td>
                      <td>{statusLabel[task.status]}</td>
                      <td>{task.estimateHours}h</td>
                      <td>{task.owner ?? "待分配"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>尚未生成任务。</p>
          )}
        </div>
        <div className="card">
          <h2>实施报告与历史</h2>
          {progressHistory && progressHistory.length ? (
            <ul>
              {progressHistory.slice(-5).map((snapshot) => (
                <li key={snapshot.timestamp} style={{ marginBottom: 8 }}>
                  <strong>{new Date(snapshot.timestamp).toLocaleString()}</strong>
                  <div>完成 {snapshot.completed} / 进行中 {snapshot.inProgress} / 阻塞 {snapshot.blocked}</div>
                  <div>{snapshot.burndownNotes.join(" · ")}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p>暂无历史记录。</p>
          )}
        </div>
      </section>
    </div>
  );
}
