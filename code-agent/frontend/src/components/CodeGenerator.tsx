import React, { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { generationApi } from '@/services/api';
import { useCodeStore, useGenerationStore } from '@/store';
import { LANGUAGE_OPTIONS } from '@/lib/utils';
import { Sparkles, Loader2, Copy, Check } from 'lucide-react';

export const CodeGenerator: React.FC = () => {
  const { language, setLanguage } = useCodeStore();
  const { result, loading, error, setResult, setLoading, setError } = useGenerationStore();
  const [prompt, setPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const generationResult = await generationApi.generate(prompt, language);
      setResult(generationResult);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result?.code) {
      await navigator.clipboard.writeText(result.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          Code Generator
        </h2>
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

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe what you want to generate
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Create a function that sorts an array of integers using quicksort algorithm"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            rows={4}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Code
            </>
          )}
        </button>
      </div>

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
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Generated Code</h3>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>
          <CodeEditor
            value={result.code}
            onChange={() => {}}
            language={result.language}
            height="400px"
          />
          {result.explanation && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold mb-2">Explanation</h4>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {result.explanation}
              </p>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Confidence:</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all"
                style={{ width: `${result.confidence * 100}%` }}
              />
            </div>
            <span className="font-medium">{(result.confidence * 100).toFixed(0)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
