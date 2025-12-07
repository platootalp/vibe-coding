import path from "path";
import { ensureDir, pathExists, readJsonFile, writeJsonFile } from "../utils/fileSystem.js";
export class SddStateStore {
    projectRoot;
    stateFile;
    constructor(projectRoot) {
        this.projectRoot = projectRoot;
        this.stateFile = path.join(this.projectRoot, ".sdd", "state.json");
    }
    async read() {
        if (!(await pathExists(this.stateFile))) {
            return null;
        }
        return readJsonFile(this.stateFile, null);
    }
    async write(state) {
        await ensureDir(path.dirname(this.stateFile));
        await writeJsonFile(this.stateFile, state);
    }
    async update(updater) {
        const current = await this.read();
        const next = updater(current);
        await this.write(next);
        return next;
    }
}
//# sourceMappingURL=stateStore.js.map