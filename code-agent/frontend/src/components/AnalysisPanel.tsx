import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Issue {
  type: string;
  severity: string;
  message: string;
  line: number;
  column: number;
  suggestion?: string;
}

interface AnalysisPanelProps {
  issues: Issue[];
  metrics?: {
    total_lines: number;
    code_lines: number;
    comment_lines: number;
    blank_lines: number;
    comment_ratio: number;
  };
  structure?: {
    functions: any[];
    classes: any[];
    imports: string[];
    complexity: number;
  };
  suggestions?: string[];
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  issues,
  metrics,
  structure,
  suggestions,
}) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getSeverityClass = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-green-200 bg-green-50';
    }
  };

  return (
    <div className="space-y-6">
      {issues.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Issues Found ({issues.length})
          </h3>
          <div className="space-y-2">
            {issues.map((issue, index) => (
              <div
                key={index}
                className={cn(
                  'p-3 rounded-lg border',
                  getSeverityClass(issue.severity)
                )}
              >
                <div className="flex items-start gap-2">
                  {getSeverityIcon(issue.severity)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{issue.type}</span>
                      <span className="text-xs text-gray-500">
                        Line {issue.line}:{issue.column}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{issue.message}</p>
                    {issue.suggestion && (
                      <p className="text-sm text-gray-600 mt-1 italic">
                        💡 {issue.suggestion}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {metrics && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Code Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {metrics.total_lines}
              </div>
              <div className="text-sm text-gray-600">Total Lines</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {metrics.code_lines}
              </div>
              <div className="text-sm text-gray-600">Code Lines</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {metrics.comment_lines}
              </div>
              <div className="text-sm text-gray-600">Comments</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {metrics.blank_lines}
              </div>
              <div className="text-sm text-gray-600">Blank Lines</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {metrics.comment_ratio}%
              </div>
              <div className="text-sm text-gray-600">Comment Ratio</div>
            </div>
          </div>
        </div>
      )}

      {structure && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Code Structure</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Functions ({structure.functions.length})</h4>
              <ul className="space-y-1 text-sm">
                {structure.functions.map((func: any, index: number) => (
                  <li key={index} className="text-gray-700">
                    <span className="font-mono">{func.name}</span>
                    <span className="text-gray-500 text-xs ml-2">
                      Line {func.line}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Classes ({structure.classes.length})</h4>
              <ul className="space-y-1 text-sm">
                {structure.classes.map((cls: any, index: number) => (
                  <li key={index} className="text-gray-700">
                    <span className="font-mono">{cls.name}</span>
                    <span className="text-gray-500 text-xs ml-2">
                      Line {cls.line}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Cyclomatic Complexity</span>
              <span className="text-2xl font-bold text-gray-900">
                {structure.complexity}
              </span>
            </div>
          </div>
        </div>
      )}

      {suggestions && suggestions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Suggestions</h3>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-gray-700">💡 {suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
