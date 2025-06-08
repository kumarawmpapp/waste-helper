import React from 'react';
import { Container, Play, Square, Trash2, Plus, Circle } from 'lucide-react';

interface ContainerProps {
  id: string;
  name: string;
  image: string;
  status: 'running' | 'stopped' | 'building';
  port?: number;
}

interface ContainerManagerProps {
  containers: ContainerProps[];
  onContainerUpdate: (containers: ContainerProps[]) => void;
}

const ContainerManager: React.FC<ContainerManagerProps> = ({ containers, onContainerUpdate }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-400';
      case 'stopped': return 'text-gray-400';
      case 'building': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Circle className="w-2 h-2 fill-current" />;
      case 'stopped': return <Square className="w-2 h-2" />;
      case 'building': return <Circle className="w-2 h-2 fill-current animate-pulse" />;
      default: return <Circle className="w-2 h-2" />;
    }
  };

  const toggleContainer = (id: string) => {
    const updatedContainers = containers.map(container => {
      if (container.id === id) {
        return {
          ...container,
          status: container.status === 'running' ? 'stopped' : 'running' as const
        };
      }
      return container;
    });
    onContainerUpdate(updatedContainers);
  };

  const removeContainer = (id: string) => {
    const updatedContainers = containers.filter(container => container.id !== id);
    onContainerUpdate(updatedContainers);
  };

  return (
    <div className="h-full bg-gray-900 text-white overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Container size={20} className="text-blue-400" />
            <h2 className="text-xl font-bold">Docker Containers</h2>
          </div>
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
            <Plus size={16} />
            <span>New Container</span>
          </button>
        </div>

        {/* Containers List */}
        <div className="space-y-4">
          {containers.map((container) => (
            <div key={container.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center space-x-2 ${getStatusColor(container.status)}`}>
                    {getStatusIcon(container.status)}
                    <span className="font-medium capitalize">{container.status}</span>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white">{container.name}</h3>
                    <p className="text-sm text-gray-400">{container.image}</p>
                  </div>
                  
                  {container.port && (
                    <div className="text-sm text-gray-400">
                      Port: <span className="text-blue-400">{container.port}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleContainer(container.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      container.status === 'running'
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {container.status === 'running' ? <Square size={16} /> : <Play size={16} />}
                  </button>
                  
                  <button
                    onClick={() => removeContainer(container.id)}
                    className="p-2 bg-gray-700 hover:bg-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {containers.length === 0 && (
          <div className="text-center py-12">
            <Container size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No containers</h3>
            <p className="text-gray-400">Create your first container to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContainerManager;