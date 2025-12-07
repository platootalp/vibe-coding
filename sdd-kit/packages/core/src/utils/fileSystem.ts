import { mkdir, writeFile, readFile, stat } from "fs/promises";
import path from "path";

export async function ensureDir(targetPath: string): Promise<void> {
  await mkdir(targetPath, { recursive: true });
}

export async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

export async function writeFileSafe(
  filePath: string,
  content: string,
  encoding: BufferEncoding = "utf-8"
): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await writeFile(filePath, content, { encoding });
}

export async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const buffer = await readFile(filePath, "utf-8");
    return JSON.parse(buffer) as T;
  } catch {
    return fallback;
  }
}

export async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await writeFileSafe(filePath, JSON.stringify(data, null, 2));
}
