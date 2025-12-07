import path from "path";
import { existsSync, readFileSync } from "fs";
import { renderTemplate } from "./utils/templateRenderer.js";
import { ensureDir, writeFileSafe } from "./utils/fileSystem.js";
import { resolveTemplates } from "./templates/defaultTemplates.js";
import { SddStateStore } from "./services/stateStore.js";
import { generateSpecification } from "./services/specificationService.js";
import { buildTechnicalPlan } from "./services/planningService.js";
import {
  applyTaskUpdates,
  deriveTaskPlan,
  summarizeProgress
} from "./services/taskService.js";
import { composeImplementationReport } from "./services/reportService.js";
import {
  SddConstitutionOptions,
  SddEngineModule,
  SddEngineOptions,
  SddImplementationInput,
  SddInitOptions,
  SddPlanOptions,
  SddProjectState,
  SddSpecificationInput,
  SddTasksOptions,
  SddTemplateRegistry
} from "./types.js";

export class SddEngine {
  private projectRoot!: string;
  private templates!: SddTemplateRegistry;
  private stateStore!: SddStateStore;
  private readonly modules = new Map<string, SddEngineModule>();
  private templateStorePath = "";
  private customTemplateOverrides: Partial<SddTemplateRegistry> = {};

  constructor(options: SddEngineOptions = {}) {
    this.customTemplateOverrides = options.templates ?? {};
    this.configureProjectRoot(options.projectRoot ?? process.cwd(), this.customTemplateOverrides);
  }

  get root(): string {
    return this.projectRoot;
  }

  async initializeProject(options: SddInitOptions): Promise<SddProjectState> {
    const targetRoot = options.outputDir ? path.resolve(options.outputDir) : this.projectRoot;
    if (targetRoot !== this.projectRoot) {
      this.configureProjectRoot(targetRoot);
    }

    const docsDir = path.join(this.projectRoot, "docs");
    await ensureDir(docsDir);

    const constitution = renderTemplate(this.templates.constitution, {
      projectName: options.projectName,
      domain: options.domain,
      description: options.description,
      principles: [
        "业务价值优先",
        "端到端可追溯",
        "自动化即默认"
      ],
      governanceModel: "双周节奏会 + 规范审查委员会",
      deliveryCadence: "每两周一次增量评审",
      qualityBar: ["质量门槛数字化", "安全红线左移"],
      compliance: [
        { standard: "iso-25010", summary: "初始化基线" },
        { standard: "owasp-asvs", summary: "威胁建模排期" }
      ],
      generatedAt: new Date().toISOString()
    });

    const principlesDoc = renderTemplate(this.templates.principles, {
      principles: [
        {
          title: "标准即产品",
          statement: "所有规范均以可执行资产交付",
          impact: "减少认知偏差",
          practices: "模板+校验+报告"
        },
        {
          title: "透明化推进",
          statement: "每个任务状态可视",
          impact: "支撑治理决策",
          practices: "看板+报告"
        }
      ]
    });

    await writeFileSafe(path.join(docsDir, "constitution.md"), constitution);
    await writeFileSafe(path.join(docsDir, "principles.md"), principlesDoc);

    const state: SddProjectState = {
      metadata: {
        name: options.projectName,
        domain: options.domain,
        description: options.description,
        createdAt: new Date().toISOString()
      },
      progressHistory: []
    };

    await this.stateStore.write(state);
    return state;
  }

  async updateConstitution(options: SddConstitutionOptions): Promise<string> {
    const state = await this.requireState();
    const content = renderTemplate(this.templates.constitution, {
      projectName: state.metadata.name,
      domain: state.metadata.domain,
      description: state.metadata.description,
      principles: options.guidingPrinciples,
      governanceModel: options.governanceModel,
      deliveryCadence: options.deliveryCadence,
      qualityBar: ["度量透明化", "缺陷零容忍"],
      compliance: state.specification?.compliance ?? [],
      generatedAt: new Date().toISOString()
    });

    const filePath = path.join(this.projectRoot, "docs", "constitution.md");
    await writeFileSafe(filePath, content);
    return filePath;
  }

  async updateTemplates(partial: Partial<SddTemplateRegistry>) {
    this.customTemplateOverrides = {
      ...this.customTemplateOverrides,
      ...partial
    };
    this.templates = resolveTemplates(this.customTemplateOverrides);
    await writeFileSafe(
      this.templateStorePath,
      JSON.stringify(this.customTemplateOverrides, null, 2)
    );
    return this.templates;
  }

  async specify(input: SddSpecificationInput) {
    const specification = generateSpecification(input);
    const state = await this.stateStore.update((previous) => ({
      ...(previous ?? {
        metadata: {
          name: input.projectName,
          domain: input.domain,
          description: input.summary,
          createdAt: new Date().toISOString()
        },
        progressHistory: []
      }),
      specification
    }));

    return state.specification;
  }

  async plan(options: SddPlanOptions = {}) {
    const spec = options.specification ?? (await this.requireState()).specification;
    if (!spec) {
      throw new Error("尚未生成规范，无法制定技术方案");
    }

    const plan = buildTechnicalPlan(spec);
    await this.stateStore.update((state) => ({
      ...(state ?? {
        metadata: spec
          ? {
              name: spec.projectName,
              domain: spec.domain,
              description: spec.executiveSummary,
              createdAt: new Date().toISOString()
            }
          : {
              name: "",
              domain: "",
              description: "",
              createdAt: new Date().toISOString()
            },
        progressHistory: []
      }),
      specification: spec,
      plan
    }));

    return plan;
  }

  async tasks(options: SddTasksOptions = {}) {
    const snapshot = await this.requireState();
    const plan = options.plan ?? snapshot.plan;
    const spec = snapshot.specification;
    if (!plan || !spec) {
      throw new Error("缺少技术方案或规范，无法分解任务");
    }

    const taskPlan = deriveTaskPlan(spec, plan);
    await this.stateStore.update((state) => ({
      ...(state ?? snapshot),
      specification: spec,
      plan,
      taskPlan
    }));

    return taskPlan;
  }

  async implement(input: SddImplementationInput = {}) {
    const snapshot = await this.requireState();
    if (!snapshot.taskPlan) {
      throw new Error("请先生成任务清单");
    }

    const updatedTaskPlan = input.updates?.length
      ? applyTaskUpdates(snapshot.taskPlan, input.updates)
      : snapshot.taskPlan;
    const progress = summarizeProgress(updatedTaskPlan);

    const state = await this.stateStore.update(() => ({
      ...snapshot,
      taskPlan: updatedTaskPlan,
      progressHistory: [...(snapshot.progressHistory ?? []), progress]
    }));

    const { report, filePath } = await composeImplementationReport({
      projectName: state.metadata.name,
      progress,
      highlights: input.narrativeHighlights ?? ["保持稳定推进"],
      blockers: input.blockers ?? [],
      complianceDelta: state.specification?.compliance ?? [],
      templates: this.templates,
      projectRoot: this.projectRoot
    });

    return { report, filePath, progress };
  }

  async getState(): Promise<SddProjectState | null> {
    return this.stateStore.read();
  }

  getTemplates(): SddTemplateRegistry {
    return this.templates;
  }

  registerModule(key: string, module: SddEngineModule): void {
    this.modules.set(key, module);
  }

  async runModule<TInput, TResult>(key: string, input: TInput): Promise<TResult> {
    const module = this.modules.get(key) as SddEngineModule<TInput, TResult> | undefined;
    if (!module) {
      throw new Error(`未注册模块 ${key}`);
    }

    const state = await this.stateStore.read();
    const context = {
      state: state ?? (await this.initializeFallbackState()),
      saveState: async (nextState: SddProjectState) => {
        await this.stateStore.write(nextState);
      }
    };

    return module.execute(input, context);
  }

  private configureProjectRoot(
    root: string,
    overrides?: Partial<SddTemplateRegistry>
  ): void {
    this.projectRoot = root;
    this.stateStore = new SddStateStore(root);
    this.templateStorePath = path.join(root, ".sdd", "templates.json");
    const persisted = this.loadPersistedTemplates();
    this.customTemplateOverrides = {
      ...(persisted ?? {}),
      ...(overrides ?? this.customTemplateOverrides)
    };
    this.templates = resolveTemplates(this.customTemplateOverrides);
  }

  private loadPersistedTemplates(): Partial<SddTemplateRegistry> | undefined {
    if (!this.templateStorePath || !existsSync(this.templateStorePath)) {
      return undefined;
    }

    try {
      const raw = readFileSync(this.templateStorePath, "utf-8");
      return JSON.parse(raw) as Partial<SddTemplateRegistry>;
    } catch {
      return undefined;
    }
  }

  private async requireState(): Promise<SddProjectState> {
    const state = await this.stateStore.read();
    if (!state) {
      throw new Error("尚未初始化 SDD 项目");
    }
    return state;
  }

  private async initializeFallbackState(): Promise<SddProjectState> {
    const fallback: SddProjectState = {
      metadata: {
        name: "未命名项目",
        domain: "",
        description: "",
        createdAt: new Date().toISOString()
      },
      progressHistory: []
    };
    await this.stateStore.write(fallback);
    return fallback;
  }
}
