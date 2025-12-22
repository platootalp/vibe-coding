import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AppManagement from './pages/AppManagement';
import PromptManagement from './pages/PromptManagement';
import KnowledgeBaseManagement from './pages/KnowledgeBaseManagement';
import DebugPage from './pages/DebugPage';
import MonitoringPage from './pages/MonitoringPage';
import WorkflowPage from './pages/WorkflowPage';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<AppManagement />} />
          <Route path="/workflow" element={<WorkflowPage />} />
          <Route path="/prompt" element={<PromptManagement />} />
          <Route path="/knowledge-base" element={<KnowledgeBaseManagement />} />
          <Route path="/debug" element={<DebugPage />} />
          <Route path="/monitoring" element={<MonitoringPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
