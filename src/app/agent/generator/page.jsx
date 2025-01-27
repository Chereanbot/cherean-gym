'use client';

import { useState } from 'react';
import { CpuChipIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import AgentPageBase from '@/components/AgentPageBase';

const templates = [
  {
    name: 'React Component',
    description: 'Generate a React component with TypeScript and Tailwind CSS',
    icon: CodeBracketIcon,
  },
  {
    name: 'API Endpoint',
    description: 'Create a Next.js API route with error handling and validation',
    icon: CpuChipIcon,
  },
  // Add more templates as needed
];

export default function GeneratorPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [output, setOutput] = useState('');

  const generateCode = async () => {
    // Implement code generation logic
    setOutput('// Generated code will appear here');
  };

  const actions = (
    <button
      onClick={generateCode}
      className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors"
    >
      Generate Code
    </button>
  );

  return (
    <AgentPageBase
      title="Code Generator"
      subtitle="Generate code snippets and boilerplate"
      icon={CpuChipIcon}
      actions={actions}
    >
      <div className="p-6 space-y-6">
        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <button
              key={template.name}
              onClick={() => setSelectedTemplate(template)}
              className={`p-4 rounded-lg border transition-all ${
                selectedTemplate?.name === template.name
                  ? 'border-yellow-500 bg-yellow-500/10'
                  : 'border-gray-800 hover:border-yellow-500/50 hover:bg-yellow-500/5'
              }`}
            >
              <template.icon className="w-8 h-8 text-yellow-500 mb-3" />
              <h3 className="text-lg font-medium text-yellow-500">
                {template.name}
              </h3>
              <p className="mt-1 text-sm text-yellow-500/70">
                {template.description}
              </p>
            </button>
          ))}
        </div>

        {/* Configuration */}
        {selectedTemplate && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-yellow-500">
              Configure {selectedTemplate.name}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-yellow-500/70 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg text-yellow-500 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                  placeholder="Enter name..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-500/70 mb-1">
                  Type
                </label>
                <select className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg text-yellow-500 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500">
                  <option value="typescript">TypeScript</option>
                  <option value="javascript">JavaScript</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Output */}
        {output && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-yellow-500">
              Generated Code
            </h3>
            <pre className="p-4 bg-black border border-gray-800 rounded-lg overflow-x-auto">
              <code className="text-yellow-500/90">{output}</code>
            </pre>
          </div>
        )}
      </div>
    </AgentPageBase>
  );
} 