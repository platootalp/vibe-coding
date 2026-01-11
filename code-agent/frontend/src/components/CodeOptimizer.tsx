import React, { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { optimizationApi } from '@/services/api';
import { useCodeStore, useOptimizationStore } from '@/store';
import { LANGUAGE_OPTIONS } from '@/lib/utils';
import { Zap, Loader2, ArrowRight } from 'lucide-react';

export const CodeOptimizer: React.FC = () => {
  const { code, language, setCode, setLanguage } = useCodeStore();
  const { result, loading, error, setResult, setLoading, setError } = useOptimizationStore();
  const [optimizationType, setOptimizationType] = useState('performance');

  const handleOptimize = async () => {
    if (!code.trim()) {
      setError('Please enter some code to optimize');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const optimizationResult = await optimizationApi.optimize(
        code,
        language,
        optimizationType
      );
      setResult(optimizationResult);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Optimization failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Zap className="w-6 h-6" />
          Code Optimizer
        </h2>
        <div className="flex items-center gap-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={optimizationType}
            onChange={(e) => setOptimizationType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="performance">Performance</option>
            <option value="readability">Readability</option>
            <option value="security">Security</option>
            <option value="maintainability">Maintainability</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Original Code</h3>
            <button
              onClick={handleOptimize}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Optimize
                </>
              )}
            </button>
          </div>
          <CodeEditor
            value={code}
            onChange={(value) => setCode(value || '')}
            language={language}
            height="500px"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Optimized Code</h3>
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          )}
          {result && !loading && (
            <div className="space-y-4">
              <CodeEditor
                value={result.optimized_code}
                onChange={() => {}}
                language={language}
                height="400px"
              />
              {result.changes.length > 0 && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold mb-2">Changes Made</h4>
                  <ul className="space-y-1">
                    {result.changes.map((change: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 mt-0.5 text-primary-600 flex-shrink-0" />
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.improvements.length > 0 && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold mb-2">Improvements</h4>
                  <ul className="space-y-1">
                    {result.improvements.map((improvement: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.explanation && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold mb-2">Explanation</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {result.explanation}
                  </p>
                </div>
              )}
            </div>
          )}
          {!result && !loading && !error && (
            <div className="p-8 bg-gray-50 border border-gray-200 rounded-lg text-center text-gray-500">
              Enter code and click "Optimize" to see results
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
