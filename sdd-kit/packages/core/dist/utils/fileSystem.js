import { mkdir, writeFile, readFile, stat } from "fs/promises";
import path from "path";
export async function ensureDir(targetPath) {
    await mkdir(targetPath, { recursive: true });
}
export async function pathExists(targetPath) {
    try {
        await stat(targetPath);
        return true;
    }
    catch {
        return false;
    }
}
export async function writeFileSafe(filePath, content, encoding = "utf-8") {
    await ensureDir(path.dirname(filePath));
    await writeFile(filePath, content, { encoding });
}
export async function readJsonFile(filePath, fallback) {
    try {
        const buffer = await readFile(filePath, "utf-8");
        return JSON.parse(buffer);
    }
    catch {
        return fallback;
    }
}
export async function writeJsonFile(filePath, data) {
    await writeFileSafe(filePath, JSON.stringify(data, null, 2));
}
//# sourceMappingURL=fileSystem.js.map