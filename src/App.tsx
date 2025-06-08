import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Square, 
  Terminal, 
  Container, 
  TestTube, 
  FolderOpen, 
  Settings,
  Plus,
  Trash2,
  CirclePlay,
  CircleStop,
  Monitor,
  Code,
  FileText,
  RefreshCw,
  Truck
} from 'lucide-react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CodeEditor from './components/CodeEditor';
import Terminal from './components/Terminal';
import ContainerManager from './components/ContainerManager';
import TestRunner from './components/TestRunner';
import StatusBar from './components/StatusBar';
import SkipList from './components/SkipList';

type TabType = 'editor' | 'terminal' | 'containers' | 'tests' | 'skips';

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

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('skips');
  const [containers, setContainers] = useState<Container[]>([
    { id: '1', name: 'web-app', image: 'node:18', status: 'running', port: 3000 },
    { id: '2', name: 'database', image: 'postgres:15', status: 'running', port: 5432 },
    { id: '3', name: 'redis-cache', image: 'redis:7', status: 'stopped' }
  ]);
  const [testResults, setTestResults] = useState<TestResult[]>([
    { name: 'Skip API Integration', status: 'passed', duration: 150 },
    { name: 'Skip List Component', status: 'passed', duration: 320 },
    { name: 'Price Calculation', status: 'passed', duration: 89 },
    { name: 'Search Functionality', status: 'running' }
  ]);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '$ npm install',
    'Installing dependencies...',
    '✓ Dependencies installed successfully',
    '$ npm test',
    'Running test suite...',
    '✓ Skip API tests passed',
    '✓ Component tests passed',
    '$'
  ]);

  const [code, setCode] = useState(`// Skip Hire API Integration
import React, { useState, useEffect } from 'react';

interface Skip {
  id: string;
  size: string;
  hire_period_days: number;
  price_before_vat: number;
  vat: number;
}

function SkipList() {
  const [skips, setSkips] = useState<Skip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkips();
  }, []);

  const fetchSkips = async () => {
    try {
      const response = await fetch(
        'https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft'
      );
      const data = await response.json();
      setSkips(data);
    } catch (error) {
      console.error('Failed to fetch skips:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (priceBeforeVat: number, vat: number) => {
    return (priceBeforeVat + vat).toFixed(2);
  };

  return (
    <div className="skip-list">
      {loading ? (
        <div>Loading skips...</div>
      ) : (
        skips.map((skip) => (
          <div key={skip.id} className="skip-card">
            <h3>{skip.size} Skip</h3>
            <p>Hire Period: {skip.hire_period_days} days</p>
            <p>Price: £{formatPrice(skip.price_before_vat, skip.vat)}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default SkipList;`);

  const tabs = [
    { id: 'skips' as TabType, label: 'Skip Hire', icon: Truck },
    { id: 'editor' as TabType, label: 'Code Editor', icon: Code },
    { id: 'terminal' as TabType, label: 'Terminal', icon: Terminal },
    { id: 'containers' as TabType, label: 'Containers', icon: Container },
    { id: 'tests' as TabType, label: 'Tests', icon: TestTube }
  ];

  const runTests = () => {
    setTestResults(prev => prev.map(test => ({ ...test, status: 'running' as const })));
    
    // Simulate test execution
    setTimeout(() => {
      setTestResults([
        { name: 'Skip API Integration', status: 'passed', duration: 145 },
        { name: 'Skip List Component', status: 'passed', duration: 298 },
        { name: 'Price Calculation', status: 'passed', duration: 234 },
        { name: 'Search Functionality', status: 'passed', duration: 112 }
      ]);
    }, 2000);
  };

  const executeCommand = (command: string) => {
    setTerminalOutput(prev => [...prev, `$ ${command}`, 'Executing...']);
    
    // Simulate command execution
    setTimeout(() => {
      if (command.includes('test')) {
        setTerminalOutput(prev => [...prev, 'Running test suite...', '✓ All tests passed', '$']);
      } else if (command.includes('docker')) {
        setTerminalOutput(prev => [...prev, 'Docker command executed', '✓ Containers updated', '$']);
      } else {
        setTerminalOutput(prev => [...prev, `✓ Command executed successfully`, '$']);
      }
    }, 1000);
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col overflow-hidden">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Tab Navigation */}
          <div className="bg-gray-800 border-b border-gray-700 px-6">
            <div className="flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700/50'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'skips' && <SkipList />}
            
            {activeTab === 'editor' && (
              <CodeEditor code={code} onChange={setCode} />
            )}
            
            {activeTab === 'terminal' && (
              <Terminal 
                output={terminalOutput} 
                onCommand={executeCommand}
              />
            )}
            
            {activeTab === 'containers' && (
              <ContainerManager 
                containers={containers}
                onContainerUpdate={setContainers}
              />
            )}
            
            {activeTab === 'tests' && (
              <TestRunner 
                results={testResults}
                onRunTests={runTests}
              />
            )}
          </div>
        </div>
      </div>

      <StatusBar 
        containers={containers}
        testResults={testResults}
      />
    </div>
  );
}

export default App;