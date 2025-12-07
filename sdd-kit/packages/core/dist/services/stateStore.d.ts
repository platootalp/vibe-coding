import { SddProjectState } from "../types.js";
export declare class SddStateStore {
    private readonly projectRoot;
    private readonly stateFile;
    constructor(projectRoot: string);
    read(): Promise<SddProjectState | null>;
    write(state: SddProjectState): Promise<void>;
    update(updater: (prev: SddProjectState | null) => SddProjectState): Promise<SddProjectState>;
}
//# sourceMappingURL=stateStore.d.ts.map