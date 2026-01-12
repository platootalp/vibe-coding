import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { getLanguageMonaco } from '@/lib/utils';

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language: string;
  height?: string;
  readOnly?: boolean;
  theme?: 'light' | 'dark';
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  height = '500px',
  readOnly = false,
  theme = 'light',
}) => {
  const [editorTheme] = useState<'vs' | 'vs-dark'>(
    theme === 'dark' ? 'vs-dark' : 'vs'
  );

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <Editor
        height={height}
        language={getLanguageMonaco(language)}
        value={value}
        onChange={onChange}
        theme={editorTheme}
        options={{
          readOnly,
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          wordWrap: 'on',
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  );
};
