'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function AboutBioAdmin() {
  const [formData, setFormData] = useState({
    headline: '',
    introduction: '',
    story: '',
    aboutme: '',
    noofclients: '',
    noofprojects: '',
    yearofexerience: '',
    milestones: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/about');
        const data = await response.json();
        if (data.success) {
          setFormData(data.data || {});
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
        toast.error('Failed to load about data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStoryChange = (content) => {
    setFormData(prev => ({
      ...prev,
      story: content
    }));
  };

  const handleMilestoneChange = (index, field, value) => {
    setFormData(prev => {
      const newMilestones = [...(prev.milestones || [])];
      if (!newMilestones[index]) {
        newMilestones[index] = {};
      }
      newMilestones[index][field] = value;
      return {
        ...prev,
        milestones: newMilestones
      };
    });
  };

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [...(prev.milestones || []), { title: '', description: '' }]
    }));
  };

  const removeMilestone = (index) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        toast.success('About information updated successfully');
      } else {
        toast.error(data.message || 'Failed to update about information');
      }
    } catch (error) {
      console.error('Error updating about data:', error);
      toast.error('Failed to update about information');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Edit Bio & Story</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Headline
            </label>
            <input
              type="text"
              name="headline"
              value={formData.headline || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., Full-Stack Developer & Tech Enthusiast"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Introduction
            </label>
            <textarea
              name="introduction"
              value={formData.introduction || ''}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Brief introduction about yourself"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              About Me
            </label>
            <textarea
              name="aboutme"
              value={formData.aboutme || ''}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Detailed description about yourself"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Clients
              </label>
              <input
                type="number"
                name="noofclients"
                value={formData.noofclients || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Projects
              </label>
              <input
                type="number"
                name="noofprojects"
                value={formData.noofprojects || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                name="yearofexerience"
                value={formData.yearofexerience || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              My Story
            </label>
            <div className="prose max-w-none">
              <ReactQuill
                value={formData.story || ''}
                onChange={handleStoryChange}
                className="h-64 mb-12"
                theme="snow"
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link', 'blockquote'],
                    [{ 'color': [] }, { 'background': [] }],
                    ['clean']
                  ]
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Key Milestones
              </label>
              <button
                type="button"
                onClick={addMilestone}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Add Milestone
              </button>
            </div>
            <div className="space-y-4">
              {formData.milestones?.map((milestone, index) => (
                <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 rounded-lg">
                  <div className="flex-grow space-y-4">
                    <input
                      type="text"
                      value={milestone.title || ''}
                      onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Milestone Title"
                    />
                    <textarea
                      value={milestone.description || ''}
                      onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Milestone Description"
                      rows={2}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMilestone(index)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
} 