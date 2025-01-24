'use client';

import { useState, useEffect } from 'react';
import { FaKey, FaLock, FaEye, FaEyeSlash, FaSync } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function AdminSettings() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({});

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'admin-email': credentials.email,
          'admin-password': credentials.password,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        fetchSettings();
        toast.success('Authentication successful');
      } else {
        throw new Error(data.error || 'Authentication failed');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings', {
        headers: {
          'admin-email': credentials.email,
          'admin-password': credentials.password,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch settings');

      const data = await response.json();
      setSettings(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const togglePasswordVisibility = (key) => {
    setShowPasswords(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const formatKey = (key, showPassword) => {
    if (!key) return '---';
    return showPassword ? key : `${key.slice(0, 8)}...${key.slice(-4)}`;
  };

  const renderSettingSection = (title, data, path = '') => {
    if (!data || typeof data !== 'object') return null;

    return (
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-200">
            {Object.entries(data).map(([key, value]) => {
              const fullPath = path ? `${path}.${key}` : key;
              
              if (typeof value === 'object' && value !== null) {
                return renderSettingSection(
                  key.charAt(0).toUpperCase() + key.slice(1),
                  value,
                  fullPath
                );
              }

              const isSecret = key.toLowerCase().includes('key') || 
                             key.toLowerCase().includes('secret') ||
                             key.toLowerCase().includes('password') ||
                             key.toLowerCase().includes('token');

              return (
                <div key={fullPath} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {key.split(/(?=[A-Z])/).join(' ').toUpperCase()}
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <code className="text-sm bg-gray-50 px-2 py-1 rounded">
                          {isSecret 
                            ? formatKey(value, showPasswords[fullPath])
                            : value || '---'
                          }
                        </code>
                        {isSecret && (
                          <button
                            onClick={() => togglePasswordVisibility(fullPath)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {showPasswords[fullPath] ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <FaLock className="text-4xl text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Authentication
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Admin Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={credentials.email}
                    onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Admin Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    loading
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                >
                  {loading ? 'Authenticating...' : 'Sign in'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <FaKey className="text-2xl text-gray-600" />
            <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
          </div>
          <button
            onClick={fetchSettings}
            className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <FaSync className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {settings ? (
          Object.entries(settings).map(([section, data]) => (
            renderSettingSection(
              section.charAt(0).toUpperCase() + section.slice(1),
              data,
              section
            )
          ))
        ) : (
          <div className="text-center py-12">
            <FaSync className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Loading settings...</h3>
          </div>
        )}
      </div>
    </div>
  );
} 