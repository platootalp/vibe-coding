import React, { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { analysisApi } from '@/services/api';
import { AnalysisPanel } from './AnalysisPanel';
import { useCodeStore, useAnalysisStore } from '@/store';
import { LANGUAGE_OPTIONS } from '@/lib/utils';
import { Play, Loader2 } from 'lucide-react';

export const CodeAnalyzer: React.FC = () => {
  const { code, language, setCode, setLanguage } = useCodeStore();
  const { result, loading, error, setResult, setLoading, setError } = useAnalysisStore();

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError('Please enter some code to analyze');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analysisApi.analyze(code, language);
      setResult(analysisResult);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Code Analyzer</h2>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Code Input</h3>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Analyze
                </>
              )}
            </button>
          </div>
          <CodeEditor
            value={code}
            onChange={(value) => setCode(value || '')}
            language={language}
            height="600px"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Analysis Results</h3>
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
            <AnalysisPanel
              issues={result.issues}
              metrics={result.metrics}
              structure={result.structure}
              suggestions={result.suggestions}
            />
          )}
          {!result && !loading && !error && (
            <div className="p-8 bg-gray-50 border border-gray-200 rounded-lg text-center text-gray-500">
              Enter code and click "Analyze" to see results
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
