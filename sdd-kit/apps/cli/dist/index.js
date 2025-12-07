#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import path from "path";
import { readFile } from "fs/promises";
import { SddEngine } from "@sdd/core";
const program = new Command();
program.name("sdd").description("规范驱动开发工具链");
const engine = new SddEngine({ projectRoot: process.cwd() });
const collectValues = (value, previous) => {
    if (!value) {
        return previous;
    }
    return [...previous, value];
};
async function loadJson(filePath, hint) {
    const absolutePath = path.isAbsolute(filePath)
        ? filePath
        : path.join(process.cwd(), filePath);
    const buffer = await readFile(absolutePath, "utf-8");
    try {
        return JSON.parse(buffer);
    }
    catch (error) {
        throw new Error(`${hint} JSON 解析失败: ${error.message}`);
    }
}
async function runWithSpinner(label, task) {
    const spinner = ora(label).start();
    try {
        const result = await task();
        spinner.succeed(`${label} 完成`);
        return result;
    }
    catch (error) {
        spinner.fail(`${label} 失败`);
        throw error;
    }
}
program
    .command("/sdd.init")
    .alias("init")
    .description("创建项目框架与基础文档")
    .requiredOption("-n, --name <string>", "项目名称")
    .requiredOption("-d, --domain <string>", "所属领域")
    .requiredOption("-s, --summary <string>", "项目愿景描述")
    .option("-o, --output <path>", "输出目录", process.cwd())
    .action(async (options) => {
    await runAction(async () => {
        const initOptions = {
            projectName: options.name,
            domain: options.domain,
            description: options.summary,
            outputDir: options.output
        };
        await runWithSpinner("初始化项目", () => engine.initializeProject(initOptions));
        console.log(chalk.green("✔ 已生成 docs/constitution.md 与 docs/principles.md"));
    });
});
program
    .command("/sdd.kit.constitution")
    .alias("constitution")
    .description("更新开发指南与宪章")
    .option("-p, --principle <value>", "指导原则，可重复传入", collectValues, [])
    .requiredOption("-g, --governance <string>", "治理模型描述")
    .requiredOption("-c, --cadence <string>", "交付节奏")
    .action(async (options) => {
    await runAction(async () => {
        const filePath = await runWithSpinner("更新宪章", () => engine.updateConstitution({
            guidingPrinciples: options.principle.length
                ? options.principle
                : ["透明度", "标准化", "自助自动化"],
            governanceModel: options.governance,
            deliveryCadence: options.cadence
        }));
        console.log(chalk.green(`✔ 宪章已更新: ${filePath}`));
    });
});
program
    .command("/sdd.templates")
    .alias("templates")
    .description("自定义规范模板")
    .requiredOption("-f, --file <file>", "包含模板字段的 JSON 文件")
    .action(async (options) => {
    await runAction(async () => {
        const overrides = await loadJson(options.file, "模板配置");
        const updated = await runWithSpinner("更新模板", () => engine.updateTemplates(overrides));
        console.log(chalk.green("✔ 模板已更新"));
        console.log(chalk.gray(JSON.stringify(updated, null, 2)));
    });
});
program
    .command("/sdd.specify")
    .alias("specify")
    .description("生成规范包")
    .requiredOption("-i, --input <file>", "包含需求等信息的 JSON 文件")
    .action(async (options) => {
    await runAction(async () => {
        const payload = await loadJson(options.input, "规格输入");
        const specification = await runWithSpinner("生成规范", () => engine.specify(payload));
        console.log(chalk.cyan("规范摘要:"));
        console.log(chalk.cyan(JSON.stringify(specification, null, 2)));
    });
});
program
    .command("/sdd.plan")
    .alias("plan")
    .description("生成技术实施方案")
    .option("-s, --spec <file>", "可选，外部规范 JSON")
    .action(async (options) => {
    await runAction(async () => {
        const specPayload = options.spec
            ? await loadJson(options.spec, "规范输入")
            : undefined;
        const planOptions = {};
        if (specPayload) {
            planOptions.specification = await engine.specify(specPayload);
        }
        const plan = await runWithSpinner("生成技术方案", () => engine.plan(planOptions));
        console.log(chalk.cyan(JSON.stringify(plan, null, 2)));
    });
});
program
    .command("/sdd.tasks")
    .alias("tasks")
    .description("生成任务清单")
    .option("-p, --plan <file>", "可选，外部技术方案 JSON")
    .action(async (options) => {
    await runAction(async () => {
        const planOptions = {};
        if (options.plan) {
            planOptions.plan = await loadJson(options.plan, "技术方案");
        }
        const taskPlan = await runWithSpinner("生成任务清单", () => engine.tasks(planOptions));
        console.log(chalk.magenta(JSON.stringify(taskPlan, null, 2)));
    });
});
program
    .command("/sdd.implement")
    .alias("implement")
    .description("任务执行与报告生成")
    .option("-u, --updates <file>", "任务更新 JSON")
    .option("-h, --highlights <items>", "亮点，逗号分隔")
    .option("-b, --blockers <items>", "阻塞，逗号分隔")
    .action(async (options) => {
    await runAction(async () => {
        const payload = {};
        if (options.updates) {
            payload.updates = await loadJson(options.updates, "任务更新");
        }
        if (options.highlights) {
            payload.narrativeHighlights = options.highlights.split(",").map((item) => item.trim());
        }
        if (options.blockers) {
            payload.blockers = options.blockers.split(",").map((item) => item.trim());
        }
        const result = await runWithSpinner("生成实施报告", () => engine.implement(payload));
        console.log(chalk.green(`✔ 报告输出在 ${result.filePath}`));
        console.log(chalk.cyan(JSON.stringify(result.report, null, 2)));
    });
});
program
    .command("/sdd.modules")
    .alias("modules")
    .description("列出模块扩展能力")
    .action(async () => {
    await runAction(async () => {
        console.log(chalk.yellow("当前版本暂未内置额外模块，可通过 SDK 注册"));
    });
});
program.addHelpCommand(true);
async function runAction(task) {
    try {
        await task();
    }
    catch (error) {
        console.error(chalk.red(error.message));
        process.exit(1);
    }
}
program.parseAsync(process.argv);
