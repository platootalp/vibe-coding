import path from "path";
import { SddProjectState } from "../types.js";
import { ensureDir, pathExists, readJsonFile, writeJsonFile } from "../utils/fileSystem.js";

export class SddStateStore {
  private readonly stateFile: string;

  constructor(private readonly projectRoot: string) {
    this.stateFile = path.join(this.projectRoot, ".sdd", "state.json");
  }

  async read(): Promise<SddProjectState | null> {
    if (!(await pathExists(this.stateFile))) {
      return null;
    }

    return readJsonFile<SddProjectState | null>(this.stateFile, null);
  }

  async write(state: SddProjectState): Promise<void> {
    await ensureDir(path.dirname(this.stateFile));
    await writeJsonFile(this.stateFile, state);
  }

  async update(
    updater: (prev: SddProjectState | null) => SddProjectState
  ): Promise<SddProjectState> {
    const current = await this.read();
    const next = updater(current);
    await this.write(next);
    return next;
  }
}
