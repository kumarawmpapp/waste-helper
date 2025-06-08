import React from 'react';
import { Play, Save, Settings, User, Bell } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Play size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">DevSandbox</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-400">
            <span>Project:</span>
            <span className="text-white font-medium">my-awesome-app</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors">
            <Play size={14} />
            <span className="text-sm font-medium">Run</span>
          </button>
          
          <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors">
            <Save size={14} />
            <span className="text-sm font-medium">Save</span>
          </button>

          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
              <Bell size={16} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
              <Settings size={16} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
              <User size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;