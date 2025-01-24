'use client';

import { useState, useEffect } from 'react';
import { FaKey, FaPlus, FaTrash, FaCopy, FaCheck, FaInfoCircle, FaEye, FaEyeSlash, FaExclamationTriangle } from 'react-icons/fa';
import { Input, Select } from '@/components/admin-view/form-controls';
import { toast } from 'react-hot-toast';
import { API_SERVICES } from './help';
import APIKeyHelpModal from './help-modal';

export default function APIKeysSettings() {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [newKey, setNewKey] = useState({ name: '', service: '', key: '' });
  const [copiedKey, setCopiedKey] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [showKeys, setShowKeys] = useState({});
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    fetchAPIKeys();
  }, []);

  const fetchAPIKeys = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      if (data.api?.keys) {
        setApiKeys(data.api.keys);
      }
    } catch (error) {
      setErrors({ fetch: 'Failed to fetch API keys' });
      toast.error('Failed to fetch API keys');
    }
  };

  const validateNewKey = () => {
    const newErrors = {};
    if (!newKey.name.trim()) newErrors.name = 'Key name is required';
    if (!newKey.service) newErrors.service = 'Service is required';
    if (!newKey.key?.trim()) newErrors.key = 'API key is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getServiceUrl = (service) => {
    const urls = {
      gemini: 'https://makersuite.google.com/app/apikey',
      cloudinary: 'https://console.cloudinary.com/console',
      sendgrid: 'https://app.sendgrid.com/settings/api_keys',
      recaptcha: 'https://www.google.com/recaptcha/admin',
      openai: 'https://platform.openai.com/api-keys',
      stripe: 'https://dashboard.stripe.com/apikeys',
      github: 'https://github.com/settings/developers',
      google: 'https://console.cloud.google.com/apis/credentials'
    };
    return urls[service] || '#';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateNewKey()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newKey)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setApiKeys(prev => [...prev, {
          ...newKey,
          createdAt: new Date().toISOString()
        }]);
        setNewKey({ name: '', service: '', key: '' });
        setSelectedService(null);
        toast.success('API key stored successfully');
      } else {
        throw new Error(data.error || 'Failed to store API key');
      }
    } catch (error) {
      console.error('API Key storage error:', error);
      setErrors(prev => ({ 
        ...prev, 
        submit: error.message
      }));
      toast.error(error.message || 'Failed to store API key');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (keyToDelete) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api: {
            keys: apiKeys.filter(key => key.key !== keyToDelete)
          }
        })
      });
      
      if (response.ok) {
        setApiKeys(prev => prev.filter(key => key.key !== keyToDelete));
        toast.success('API key deleted successfully');
      } else {
        throw new Error('Failed to delete API key');
      }
    } catch (error) {
      setErrors({ delete: error.message });
      toast.error(error.message);
    }
  };

  const copyToClipboard = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    toast.success('API key copied to clipboard');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleKeyVisibility = (keyId) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const formatKeyDisplay = (key) => {
    if (!key) return '';
    return showKeys[key] ? key : `${key.slice(0, 8)}...${key.slice(-4)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-6">
        <FaKey className="text-2xl text-gray-600" />
        <h1 className="text-2xl font-bold text-gray-800">API Keys Management</h1>
      </div>

      <div className="prose max-w-none mb-8">
        <p className="text-gray-600">
          Manage your API keys for various services. These keys are used to authenticate your application
          with external services. Keep your keys secure and never share them publicly.
        </p>
      </div>

      {errors.fetch && (
        <div className="p-4 mb-4 rounded bg-red-100 text-red-700">
          {errors.fetch}
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Add New API Key</h2>
        
        {errors.submit && (
          <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-center gap-2">
              <FaExclamationTriangle className="text-red-500" />
              <p className="text-red-700">{errors.submit}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Key Name"
              name="name"
              value={newKey.name}
              onChange={(e) => setNewKey(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Production Gemini API Key"
              error={errors.name}
              required
            />

            <div className="relative">
              <Select
                label="Service"
                name="service"
                value={newKey.service}
                onChange={(e) => {
                  const service = e.target.value;
                  setNewKey(prev => ({ ...prev, service }));
                  setSelectedService(API_SERVICES[service]);
                }}
                options={Object.entries(API_SERVICES).map(([value, service]) => ({
                  value,
                  label: service.name
                }))}
                placeholder="Select a service"
                error={errors.service}
                required
              />
              {newKey.service && (
                <button
                  type="button"
                  onClick={() => setShowHelp(true)}
                  className="absolute right-0 top-0 mt-8 mr-10 text-blue-600 hover:text-blue-800"
                  title="View API key format help"
                >
                  <FaInfoCircle />
                </button>
              )}
            </div>
          </div>

          {selectedService && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <FaInfoCircle className="text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-blue-900">{selectedService.name}</h3>
                    <p className="text-sm text-blue-700 mt-1">{selectedService.description}</p>
                    
                    <div className="mt-3">
                      <h4 className="font-medium text-blue-900">Use Cases:</h4>
                      <ul className="mt-1 list-disc list-inside text-sm text-blue-700">
                        {selectedService.useCases.map((useCase, index) => (
                          <li key={index}>{useCase}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-3">
                      <h4 className="font-medium text-blue-900">Setup Steps:</h4>
                      <ol className="mt-1 list-decimal list-inside text-sm text-blue-700">
                        {selectedService.setup.steps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    <div className="mt-4">
                      <a
                        href={getServiceUrl(newKey.service)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        Generate Key from {selectedService.name} <FaExclamationTriangle className="text-xs" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Input
                  label="API Key"
                  name="key"
                  value={newKey.key}
                  onChange={(e) => setNewKey(prev => ({ ...prev, key: e.target.value }))}
                  placeholder="Paste your API key here"
                  error={errors.key}
                  required
                  type="password"
                />
              </div>
            </>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <FaPlus />
              {loading ? 'Storing...' : 'Store API Key'}
            </button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Your API Keys</h2>
        <div className="space-y-4">
          {apiKeys.length === 0 ? (
            <p className="text-gray-500 italic">No API keys generated yet.</p>
          ) : (
            apiKeys.map((apiKey) => (
              <div
                key={apiKey.key}
                className="border rounded-lg p-4 bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{apiKey.name}</h3>
                    <p className="text-sm text-gray-500">
                      Service: {API_SERVICES[apiKey.service]?.name || apiKey.service}
                    </p>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(apiKey.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleKeyVisibility(apiKey.key)}
                      className="p-2 text-gray-500 hover:text-gray-700"
                      title={showKeys[apiKey.key] ? 'Hide key' : 'Show key'}
                    >
                      {showKeys[apiKey.key] ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    <button
                      onClick={() => copyToClipboard(apiKey.key)}
                      className="p-2 text-gray-500 hover:text-gray-700"
                      title="Copy to clipboard"
                    >
                      {copiedKey === apiKey.key ? <FaCheck className="text-green-500" /> : <FaCopy />}
                    </button>
                    <button
                      onClick={() => handleDelete(apiKey.key)}
                      className="p-2 text-red-500 hover:text-red-700"
                      title="Delete key"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {formatKeyDisplay(apiKey.key)}
                  </code>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <APIKeyHelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        service={newKey.service}
      />
    </div>
  );
} 