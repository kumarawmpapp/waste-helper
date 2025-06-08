import React from 'react';
import { TestTube, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'running';
  duration?: number;
  error?: string;
}

interface TestRunnerProps {
  results: TestResult[];
  onRunTests: () => void;
}

const TestRunner: React.FC<TestRunnerProps> = ({ results, onRunTests }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="text-green-400\" size={20} />;
      case 'failed':
        return <XCircle className="text-red-400" size={20} />;
      case 'running':
        return <Clock className="text-yellow-400 animate-pulse" size={20} />;
      default:
        return <Clock className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'border-green-400 bg-green-400/10';
      case 'failed': return 'border-red-400 bg-red-400/10';
      case 'running': return 'border-yellow-400 bg-yellow-400/10';
      default: return 'border-gray-600 bg-gray-800';
    }
  };

  const passedCount = results.filter(r => r.status === 'passed').length;
  const failedCount = results.filter(r => r.status === 'failed').length;
  const runningCount = results.filter(r => r.status === 'running').length;

  return (
    <div className="h-full bg-gray-900 text-white overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <TestTube size={20} className="text-green-400" />
            <h2 className="text-xl font-bold">Test Runner</h2>
          </div>
          <button 
            onClick={onRunTests}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw size={16} />
            <span>Run All Tests</span>
          </button>
        </div>

        {/* Test Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">{results.length}</div>
            <div className="text-sm text-gray-400">Total Tests</div>
          </div>
          <div className="bg-gray-800 border border-green-400/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">{passedCount}</div>
            <div className="text-sm text-gray-400">Passed</div>
          </div>
          <div className="bg-gray-800 border border-red-400/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-400">{failedCount}</div>
            <div className="text-sm text-gray-400">Failed</div>
          </div>
          <div className="bg-gray-800 border border-yellow-400/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-400">{runningCount}</div>
            <div className="text-sm text-gray-400">Running</div>
          </div>
        </div>

        {/* Test Results */}
        <div className="space-y-3">
          {results.map((test, index) => (
            <div key={index} className={`border rounded-lg p-4 ${getStatusColor(test.status)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(test.status)}
                  <div>
                    <h3 className="font-semibold text-white">{test.name}</h3>
                    {test.error && (
                      <p className="text-sm text-red-400 mt-1">{test.error}</p>
                    )}
                  </div>
                </div>
                
                {test.duration && (
                  <div className="text-sm text-gray-400">
                    {test.duration}ms
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {results.length === 0 && (
          <div className="text-center py-12">
            <TestTube size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No tests found</h3>
            <p className="text-gray-400">Add some test files to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestRunner;