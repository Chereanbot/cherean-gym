'use client';

import { useState } from 'react';
import { 
  PaperAirplaneIcon, 
  PaperClipIcon, 
  CodeBracketIcon,
  BeakerIcon,
  CommandLineIcon,
  CpuChipIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

const AI_AGENTS = {
  developer: {
    name: 'ChereanBot',
    role: 'Full Stack Developer',
    expertise: ['React', 'Node.js', 'Python', 'Database Design'],
    description: 'Expert in web development and system architecture',
    avatar: '👨‍💻',
    systemPrompt: `I am ChereanBot, an AI developer assistant created by Cherinet. I specialize in:
- Full-stack development with React, Node.js, and Python
- Database design and optimization
- System architecture and best practices
- Code review and debugging
I provide practical, production-ready solutions with detailed explanations.`
  },
  architect: {
    name: 'ArchBot',
    role: 'System Architect',
    expertise: ['System Design', 'Cloud Architecture', 'Scalability', 'Security'],
    description: 'Specialist in system design and architecture',
    avatar: '🏗️',
    systemPrompt: `I am ArchBot, an AI architecture assistant created by Cherinet. I excel at:
- System design and architecture
- Cloud infrastructure planning
- Scalability and performance optimization
- Security best practices
I help design robust, scalable systems with a focus on best practices.`
  },
  debugger: {
    name: 'DebugBot',
    role: 'Debug Expert',
    expertise: ['Debugging', 'Testing', 'Performance', 'Error Handling'],
    description: 'Expert in debugging and problem-solving',
    avatar: '🔍',
    systemPrompt: `I am DebugBot, an AI debugging assistant created by Cherinet. I specialize in:
- Advanced debugging techniques
- Performance optimization
- Error tracking and resolution
- Testing strategies
I help identify and fix issues with detailed explanations.`
  },
  devops: {
    name: 'DevOpsBot',
    role: 'DevOps Engineer',
    expertise: ['CI/CD', 'Docker', 'Kubernetes', 'Automation'],
    description: 'Specialist in DevOps and automation',
    avatar: '⚙️',
    systemPrompt: `I am DevOpsBot, an AI DevOps assistant created by Cherinet. I excel at:
- CI/CD pipeline setup
- Container orchestration
- Infrastructure automation
- Deployment strategies
I help streamline development and deployment processes.`
  }
};

export default function AgentPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [activeModel, setActiveModel] = useState('gemini');
  const [activeAgent, setActiveAgent] = useState('developer');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      content: message.trim(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      // Send message to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          chatId: chatId,
          userId: 'test-user-1',
          model: activeModel,
          agent: AI_AGENTS[activeAgent], // Send agent context
          systemPrompt: AI_AGENTS[activeAgent].systemPrompt // Send system prompt
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402 && activeModel === 'deepseek') {
          setActiveModel('gemini');
          throw new Error('Switching to Gemini due to Deepseek API issues');
        }
        throw new Error(data.error || 'Failed to get AI response');
      }
      
      if (data.chat?._id && !chatId) {
        setChatId(data.chat._id);
      }

      const aiMessage = {
        id: messages.length + 2,
        content: data.messages[1].content,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: data.model || activeModel,
        agent: activeAgent
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage = {
        id: messages.length + 2,
        content: error.message === 'Switching to Gemini due to Deepseek API issues'
          ? "I'm switching to Gemini for better reliability. Please send your message again."
          : "I apologize, but I'm having trouble responding right now. Please try again.",
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const currentAgent = AI_AGENTS[activeAgent];

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)]">
      {/* Chat Header */}
      <div className="bg-white rounded-t-xl shadow-sm p-4 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{currentAgent.avatar}</span>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">{currentAgent.name}</h1>
              <p className="text-sm text-gray-500">
                {currentAgent.role} • Using {activeModel === 'gemini' ? 'Gemini' : 'Deepseek'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={activeAgent}
              onChange={(e) => setActiveAgent(e.target.value)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              {Object.entries(AI_AGENTS).map(([key, agent]) => (
                <option key={key} value={key}>
                  {agent.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => setActiveModel(prev => prev === 'gemini' ? 'deepseek' : 'gemini')}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              Switch to {activeModel === 'gemini' ? 'Deepseek' : 'Gemini'}
            </button>
          </div>
        </div>
        
        {/* Agent Info */}
        <div className="mt-3 flex flex-wrap gap-2">
          {currentAgent.expertise.map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <span className="text-6xl mb-4">{currentAgent.avatar}</span>
            <p className="text-lg font-medium">Hello! I'm {currentAgent.name}</p>
            <p className="text-sm text-center max-w-md mt-2">
              {currentAgent.description}. How can I assist you today?
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 w-full max-w-lg">
              {currentAgent.expertise.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-200"
                >
                  <span className="text-blue-600">
                    {skill === 'React' && <CodeBracketIcon className="w-5 h-5" />}
                    {skill === 'System Design' && <CpuChipIcon className="w-5 h-5" />}
                    {skill === 'Debugging' && <WrenchScrewdriverIcon className="w-5 h-5" />}
                    {skill === 'CI/CD' && <CommandLineIcon className="w-5 h-5" />}
                    {!['React', 'System Design', 'Debugging', 'CI/CD'].includes(skill) && (
                      <BeakerIcon className="w-5 h-5" />
                    )}
                  </span>
                  <span className="text-sm font-medium text-gray-600">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="flex-shrink-0 mr-3">
                  <span className="text-2xl">{currentAgent.avatar}</span>
                </div>
              )}
              <div
                className={`max-w-3xl rounded-2xl px-4 py-3 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : msg.isError
                    ? 'bg-red-50 border border-red-200'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {msg.content.includes('```') ? (
                  <div className="space-y-2">
                    <p className="text-sm mb-2">{msg.content.split('```')[0]}</p>
                    <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                      <pre className="text-gray-100">
                        {msg.content.split('```')[1]?.replace(/^(jsx|javascript|js|ts|typescript)\n/, '')}
                      </pre>
                    </div>
                    {msg.content.split('```')[2] && (
                      <p className="text-sm mt-2">{msg.content.split('```')[2]}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                )}
                <span
                  className={`text-xs mt-1 block ${
                    msg.sender === 'user' 
                      ? 'text-blue-100' 
                      : msg.isError 
                      ? 'text-red-400'
                      : 'text-gray-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex-shrink-0 mr-3">
              <span className="text-2xl">{currentAgent.avatar}</span>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Attach file"
          >
            <PaperClipIcon className="w-6 h-6" />
          </button>
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Insert code block"
            onClick={() => setMessage(prev => prev + '\n```\n\n```')}
          >
            <CodeBracketIcon className="w-6 h-6" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Ask ${currentAgent.name} anything about ${currentAgent.expertise.join(', ')}...`}
            className="flex-1 py-2 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`p-2 rounded-lg transition-colors ${
              isLoading || !message.trim()
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            disabled={isLoading || !message.trim()}
          >
            <PaperAirplaneIcon className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
} 