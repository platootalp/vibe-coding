type TemplatePrimitive = string | number | boolean | null | undefined;

type TemplateRecord = Record<string, unknown>;

function isRecord(value: unknown): value is TemplateRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function formatValue(value: unknown): string {
  if (value === undefined || value === null) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.map((item) => formatValue(item)).join(", ");
  }

  if (isRecord(value)) {
    return Object.entries(value)
      .map(([key, val]) => `${key}: ${formatValue(val)}`)
      .join(", ");
  }

  return String(value);
}

export function renderTemplate(template: string, data: Record<string, unknown>): string {
  let rendered = template;

  rendered = rendered.replace(/{{#(\w+)}}([\s\S]*?){{\/(\w+)}}/g, (match, key, block, closingKey) => {
    if (key !== closingKey) {
      return "";
    }

    const value = data[key];
    if (Array.isArray(value)) {
      return value
        .map((item) => {
          if (isRecord(item)) {
            return renderTemplate(block, item);
          }

          return renderTemplate(block, { ".": item as TemplatePrimitive });
        })
        .join("");
    }

    if (isRecord(value)) {
      return renderTemplate(block, value);
    }

    if (value) {
      return renderTemplate(block, data);
    }

    return "";
  });

  rendered = rendered.replace(/{{(\w+)}}/g, (_, key) => formatValue(data[key]));

  return rendered;
}
