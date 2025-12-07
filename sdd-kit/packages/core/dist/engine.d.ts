import { SddConstitutionOptions, SddEngineModule, SddEngineOptions, SddImplementationInput, SddInitOptions, SddPlanOptions, SddProjectState, SddSpecificationInput, SddTasksOptions, SddTemplateRegistry } from "./types.js";
export declare class SddEngine {
    private projectRoot;
    private templates;
    private stateStore;
    private readonly modules;
    private templateStorePath;
    private customTemplateOverrides;
    constructor(options?: SddEngineOptions);
    get root(): string;
    initializeProject(options: SddInitOptions): Promise<SddProjectState>;
    updateConstitution(options: SddConstitutionOptions): Promise<string>;
    updateTemplates(partial: Partial<SddTemplateRegistry>): Promise<SddTemplateRegistry>;
    specify(input: SddSpecificationInput): Promise<import("./types.js").SddSpecification | undefined>;
    plan(options?: SddPlanOptions): Promise<import("./types.js").SddTechnicalPlan>;
    tasks(options?: SddTasksOptions): Promise<import("./types.js").SddTaskPlan>;
    implement(input?: SddImplementationInput): Promise<{
        report: import("./types.js").SddImplementationReport;
        filePath: string;
        progress: import("./types.js").SddProgressSnapshot;
    }>;
    getState(): Promise<SddProjectState | null>;
    getTemplates(): SddTemplateRegistry;
    registerModule(key: string, module: SddEngineModule): void;
    runModule<TInput, TResult>(key: string, input: TInput): Promise<TResult>;
    private configureProjectRoot;
    private loadPersistedTemplates;
    private requireState;
    private initializeFallbackState;
}
//# sourceMappingURL=engine.d.ts.map