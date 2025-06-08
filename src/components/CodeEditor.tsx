import React from 'react';
import { Code, Copy, Download, FileText } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange }) => {
  const lineNumbers = code.split('\n').length;
  
  return (
    <div className="h-full bg-gray-900 flex flex-col">
      {/* Editor Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Code size={16} className="text-gray-400" />
          <span className="text-sm text-gray-300">main.tsx</span>
          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded">
            <Copy size={14} />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded">
            <Download size={14} />
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex">
        {/* Line Numbers */}
        <div className="bg-gray-850 border-r border-gray-700 px-3 py-4 text-right">
          {Array.from({ length: lineNumbers }, (_, i) => (
            <div key={i + 1} className="text-gray-500 text-sm leading-6 font-mono">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code Area */}
        <div className="flex-1 relative">
          <textarea
            value={code}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full bg-gray-900 text-white font-mono text-sm leading-6 p-4 resize-none border-none outline-none"
            spellCheck={false}
            style={{ tabSize: 2 }}
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 py-2 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center space-x-4">
          <span>TypeScript React</span>
          <span>UTF-8</span>
          <span>LF</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Ln {code.split('\n').length}, Col 1</span>
          <span>Spaces: 2</span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;