import type {
  SddConstitutionOptions,
  SddImplementationInput,
  SddInitOptions,
  SddPlanOptions,
  SddProjectState,
  SddSpecificationInput,
  SddTaskPlan,
  SddTasksOptions,
  SddTemplateRegistry
} from "@sdd/core";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    ...init
  });

  const payload = (await response.json()) as ApiEnvelope<T>;
  if (!payload.success) {
    throw new Error(payload.error ?? "未知错误");
  }
  return payload.data as T;
}

export const api = {
  initProject(body: SddInitOptions) {
    return request<SddProjectState>("/api/init", {
      method: "POST",
      body: JSON.stringify(body)
    });
  },
  updateConstitution(body: SddConstitutionOptions) {
    return request<{ filePath: string }>("/api/constitution", {
      method: "POST",
      body: JSON.stringify(body)
    });
  },
  updateTemplates(body: Partial<SddTemplateRegistry>) {
    return request<SddTemplateRegistry>("/api/templates", {
      method: "POST",
      body: JSON.stringify(body)
    });
  },
  fetchTemplates() {
    return request<SddTemplateRegistry>("/api/templates", { method: "GET" });
  },
  createSpecification(body: SddSpecificationInput) {
    return request("/api/spec", {
      method: "POST",
      body: JSON.stringify(body)
    });
  },
  buildPlan(options: { specification?: SddSpecificationInput }) {
    return request("/api/plan", {
      method: "POST",
      body: JSON.stringify(options)
    });
  },
  generateTasks(options: { plan?: SddTasksOptions["plan"] }) {
    return request<SddTaskPlan>("/api/tasks", {
      method: "POST",
      body: JSON.stringify(options)
    });
  },
  fetchTaskPlan() {
    return request<SddTaskPlan | null>("/api/tasks", { method: "GET" });
  },
  implement(body: SddImplementationInput) {
    return request("/api/implement", {
      method: "POST",
      body: JSON.stringify(body)
    });
  },
  fetchState() {
    return request<SddProjectState | null>("/api/state", { method: "GET" });
  },
  fetchProgress() {
    return request("/api/progress", { method: "GET" });
  }
};
