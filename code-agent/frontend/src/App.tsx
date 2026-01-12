import React from 'react';
import { CodeAnalyzer } from './components/CodeAnalyzer';
import { CodeGenerator } from './components/CodeGenerator';
import { CodeOptimizer } from './components/CodeOptimizer';
import { FileText, Sparkles, Zap, BarChart3 } from 'lucide-react';

type TabType = 'analyze' | 'generate' | 'optimize';

export default function App() {
  const [activeTab, setActiveTab] = React.useState<TabType>('analyze');

  const tabs = [
    { id: 'analyze' as TabType, label: 'Analyze', icon: BarChart3 },
    { id: 'generate' as TabType, label: 'Generate', icon: Sparkles },
    { id: 'optimize' as TabType, label: 'Optimize', icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <FileText className="w-8 h-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">Code Agent</h1>
            </div>
            <div className="text-sm text-gray-600">
              Intelligent Code Assistant
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {activeTab === 'analyze' && <CodeAnalyzer />}
          {activeTab === 'generate' && <CodeGenerator />}
          {activeTab === 'optimize' && <CodeOptimizer />}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Code Agent - Powered by AI | Built with FastAPI, React, and Monaco Editor
          </p>
        </div>
      </footer>
    </div>
  );
}
