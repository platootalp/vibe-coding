export declare function ensureDir(targetPath: string): Promise<void>;
export declare function pathExists(targetPath: string): Promise<boolean>;
export declare function writeFileSafe(filePath: string, content: string, encoding?: BufferEncoding): Promise<void>;
export declare function readJsonFile<T>(filePath: string, fallback: T): Promise<T>;
export declare function writeJsonFile<T>(filePath: string, data: T): Promise<void>;
//# sourceMappingURL=fileSystem.d.ts.map