import Fastify from "fastify";
import cors from "@fastify/cors";
import { SddEngine } from "@sdd/core";
const server = Fastify({ logger: true });
await server.register(cors, { origin: true });
const projectRoot = process.env.SDD_PROJECT_ROOT ?? process.cwd();
const engine = new SddEngine({ projectRoot });
const ok = (data) => ({ success: true, data });
const fail = (error) => ({
    success: false,
    error: error instanceof Error ? error.message : "未知错误"
});
server.get("/healthz", async () => ok({ status: "ok" }));
server.post("/api/init", async (request, reply) => {
    return safeReply(reply, async () => {
        const state = await engine.initializeProject(request.body);
        return ok(state);
    });
});
server.post("/api/constitution", async (request, reply) => safeReply(reply, async () => {
    const filePath = await engine.updateConstitution(request.body);
    return ok({ filePath });
}));
server.post("/api/templates", async (request, reply) => safeReply(reply, async () => {
    const templates = await engine.updateTemplates(request.body);
    return ok(templates);
}));
server.post("/api/spec", async (request, reply) => safeReply(reply, async () => {
    const spec = await engine.specify(request.body);
    return ok(spec);
}));
server.post("/api/plan", async (request, reply) => safeReply(reply, async () => {
    const options = {};
    if (request.body.specification) {
        options.specification = await engine.specify(request.body.specification);
    }
    const plan = await engine.plan(options);
    return ok(plan);
}));
server.post("/api/tasks", async (request, reply) => safeReply(reply, async () => {
    const options = {};
    if (request.body.plan) {
        options.plan = request.body.plan;
    }
    const tasks = await engine.tasks(options);
    return ok(tasks);
}));
server.get("/api/tasks", async (_, reply) => safeReply(reply, async () => {
    const state = await engine.getState();
    return ok(state?.taskPlan ?? null);
}));
server.post("/api/implement", async (request, reply) => safeReply(reply, async () => {
    const result = await engine.implement(request.body);
    return ok(result);
}));
server.get("/api/progress", async (_, reply) => safeReply(reply, async () => {
    const state = await engine.getState();
    return ok(state?.progressHistory ?? []);
}));
server.get("/api/state", async (_, reply) => safeReply(reply, async () => {
    const state = await engine.getState();
    return ok(state);
}));
server.get("/api/templates", async (_, reply) => safeReply(reply, async () => ok(engine.getTemplates())));
async function safeReply(reply, task) {
    try {
        return await task();
    }
    catch (error) {
        reply.status(400);
        return fail(error);
    }
}
const port = Number(process.env.PORT ?? 4000);
const host = process.env.HOST ?? "0.0.0.0";
server
    .listen({ port, host })
    .then(() => {
    server.log.info(`SDD API 已启动: http://${host}:${port}`);
})
    .catch((error) => {
    server.log.error(error, "服务启动失败");
    process.exit(1);
});
