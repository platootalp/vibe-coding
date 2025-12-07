import { randomUUID } from "crypto";
import {
  SddProgressSnapshot,
  SddSpecification,
  SddTask,
  SddTaskPlan,
  SddTaskStatus,
  SddTaskUpdate,
  SddTechnicalPlan
} from "../types.js";

export function deriveTaskPlan(
  specification: SddSpecification,
  plan: SddTechnicalPlan
): SddTaskPlan {
  const tasks: SddTask[] = [];

  specification.functionalThemes.forEach((theme) => {
    tasks.push({
      id: randomUUID(),
      title: `${theme.name} 规范定稿`,
      description: `完成 ${theme.name} 相关规范与验收标准`,
      status: "pending",
      category: "analysis",
      estimateHours: 16,
      dependencies: [],
      deliverables: ["规范文档", "验收 checklist"],
      tags: [theme.name]
    });
  });

  plan.deliveryPhases.forEach((phase, index) => {
    tasks.push({
      id: randomUUID(),
      title: `${phase.name} 里程碑`,
      description: `确保 ${phase.name} 目标达成`,
      status: index === 0 ? "in_progress" : "pending",
      category: index === 0 ? "analysis" : "planning",
      estimateHours: phase.durationWeeks * 8,
      dependencies: index === 0 ? [] : [tasks[tasks.length - 2].id],
      deliverables: phase.exitCriteria,
      tags: [phase.id]
    });
  });

  plan.architecturePrinciples.forEach((principle) => {
    tasks.push({
      id: randomUUID(),
      title: `${principle.name} 审查`,
      description: principle.statement,
      status: "pending",
      category: "governance",
      estimateHours: 8,
      dependencies: [],
      deliverables: principle.practices,
      tags: ["architecture"]
    });
  });

  const swimlanes: Record<string, string[]> = {
    分析: tasks.filter((task) => task.category === "analysis").map((task) => task.id),
    规划: tasks.filter((task) => task.category === "planning").map((task) => task.id),
    落地: tasks.filter((task) => task.category === "build").map((task) => task.id)
  };

  const criticalPath = tasks
    .filter((task) => task.category !== "governance")
    .slice(0, 5)
    .map((task) => task.id);

  return {
    tasks,
    board: {
      swimlanes,
      focusAreas: specification.functionalThemes.map((theme) => theme.name)
    },
    criticalPath,
    generatedAt: new Date().toISOString()
  };
}

export function applyTaskUpdates(
  taskPlan: SddTaskPlan,
  updates: SddTaskUpdate[]
): SddTaskPlan {
  const taskMap = new Map(taskPlan.tasks.map((task) => [task.id, { ...task }]));
  updates.forEach((update) => {
    const task = taskMap.get(update.taskId);
    if (!task) {
      return;
    }

    if (update.status) {
      task.status = update.status;
    }

    if (update.owner) {
      task.owner = update.owner;
    }

    if (update.note) {
      task.deliverables = [...task.deliverables, update.note];
    }
  });

  return {
    ...taskPlan,
    tasks: Array.from(taskMap.values())
  };
}

export function summarizeProgress(taskPlan: SddTaskPlan): SddProgressSnapshot {
  const counts = taskPlan.tasks.reduce(
    (acc, task) => {
      acc[task.status] += 1;
      if (task.status !== "done") {
        acc.remainingHours += task.estimateHours;
      }
      return acc;
    },
    {
      pending: 0,
      in_progress: 0,
      blocked: 0,
      done: 0,
      remainingHours: 0
    } as Record<SddTaskStatus, number> & { remainingHours: number }
  );

  const completed = counts.done;
  const inProgress = counts.in_progress;
  const blocked = counts.blocked;
  const remainingHours = counts.remainingHours;
  const total = taskPlan.tasks.length;
  const completedPercent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    timestamp: new Date().toISOString(),
    completed,
    inProgress,
    blocked,
    remainingHours,
    burndownNotes: [
      `完成率 ${completedPercent}%`,
      `剩余 ${remainingHours} 小时`
    ]
  };
}
