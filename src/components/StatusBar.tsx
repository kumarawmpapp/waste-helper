import React from 'react';
import { Circle, Wifi, Database, TestTube } from 'lucide-react';

interface Container {
  id: string;
  name: string;
  image: string;
  status: 'running' | 'stopped' | 'building';
  port?: number;
}

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'running';
  duration?: number;
  error?: string;
}

interface StatusBarProps {
  containers: Container[];
  testResults: TestResult[];
}

const StatusBar: React.FC<StatusBarProps> = ({ containers, testResults }) => {
  const runningContainers = containers.filter(c => c.status === 'running').length;
  const passedTests = testResults.filter(t => t.status === 'passed').length;
  const failedTests = testResults.filter(t => t.status === 'failed').length;

  return (
    <div className="bg-gray-800 border-t border-gray-700 px-6 py-2 flex items-center justify-between text-sm text-gray-400">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Circle className="w-2 h-2 fill-green-400 text-green-400" />
          <span>Connected</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Database size={14} />
          <span>{runningContainers}/{containers.length} containers</span>
        </div>

        <div className="flex items-center space-x-2">
          <TestTube size={14} />
          <span className="text-green-400">{passedTests} passed</span>
          {failedTests > 0 && (
            <span className="text-red-400">{failedTests} failed</span>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4 text-xs">
        <span>TypeScript</span>
        <span>Node.js 18.x</span>
        <span>Docker 24.x</span>
      </div>
    </div>
  );
};

export default StatusBar;