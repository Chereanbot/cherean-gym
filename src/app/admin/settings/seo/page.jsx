'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaSave, FaUpload } from 'react-icons/fa';
import Image from 'next/image';

export default function SEOSettings() {
  const [seo, setSeo] = useState({
    metaTitle: '',
    metaDescription: '',
    keywords: [],
    googleAnalyticsId: '',
    favicon: '',
    ogImage: '',
    customHeadTags: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [newKeyword, setNewKeyword] = useState('');

  useEffect(() => {
    fetchSEO();
  }, []);

  const fetchSEO = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      if (data.seo) {
        setSeo(data.seo);
      }
    } catch (error) {
      console.error('Error fetching SEO settings:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seo })
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'SEO settings updated successfully!' });
      } else {
        throw new Error('Failed to update SEO settings');
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSeo(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      if (response.ok) {
        setSeo(prev => ({ ...prev, [type]: data.url }));
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
    }
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !seo.keywords.includes(newKeyword.trim())) {
      setSeo(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (keywordToRemove) => {
    setSeo(prev => ({
      ...prev,
      keywords: prev.keywords.filter(keyword => keyword !== keywordToRemove)
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-6">
        <FaSearch className="text-2xl text-gray-600" />
        <h1 className="text-2xl font-bold text-gray-800">SEO Settings</h1>
      </div>

      {message.text && (
        <div className={`p-4 mb-4 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Meta Title</label>
            <input
              type="text"
              name="metaTitle"
              value={seo.metaTitle}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Recommended length: 50-60 characters
            </p>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Meta Description</label>
            <textarea
              name="metaDescription"
              value={seo.metaDescription}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Recommended length: 150-160 characters
            </p>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Keywords</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {seo.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => removeKeyword(keyword)}
                    className="text-green-600 hover:text-green-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Add a keyword"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={addKeyword}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Google Analytics ID</label>
            <input
              type="text"
              name="googleAnalyticsId"
              value={seo.googleAnalyticsId}
              onChange={handleChange}
              placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Favicon</label>
            <div className="mt-1 flex items-center gap-4">
              {seo.favicon && (
                <Image
                  src={seo.favicon}
                  alt="Favicon"
                  width={32}
                  height={32}
                />
              )}
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                <FaUpload />
                Upload Favicon
                <input
                  type="file"
                  accept="image/x-icon,image/png"
                  onChange={(e) => handleFileUpload(e, 'favicon')}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">OG Image</label>
            <div className="mt-1 flex items-center gap-4">
              {seo.ogImage && (
                <Image
                  src={seo.ogImage}
                  alt="OG Image"
                  width={100}
                  height={52}
                  className="rounded"
                />
              )}
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                <FaUpload />
                Upload OG Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'ogImage')}
                  className="hidden"
                />
              </label>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Recommended size: 1200x630 pixels
            </p>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Custom Head Tags</label>
            <textarea
              name="customHeadTags"
              value={seo.customHeadTags}
              onChange={handleChange}
              rows={4}
              placeholder="<!-- Add your custom meta tags, scripts, or other head elements here -->"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 font-mono text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <FaSave />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
} 