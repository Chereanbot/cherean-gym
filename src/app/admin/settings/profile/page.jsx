'use client';

import { useState, useEffect } from 'react';
import { FaUser, FaSave } from 'react-icons/fa';
import { Input, TextArea, FileInput } from '@/components/admin-view/form-controls';

export default function ProfileSettings() {
  const [profile, setProfile] = useState({
    fullName: '',
    role: '',
    bio: '',
    avatar: '',
    resume: '',
    skills: [],
    languages: []
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState({ name: '', proficiency: 'Beginner' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      if (data.profile) {
        setProfile(data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!profile.fullName) newErrors.fullName = 'Full name is required';
    if (!profile.role) newErrors.role = 'Role is required';
    if (!profile.bio) newErrors.bio = 'Bio is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = async (e, type) => {
    const file = e.target.value;
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
        setProfile(prev => ({ ...prev, [type]: data.url }));
      } else {
        setErrors(prev => ({ ...prev, [type]: 'Failed to upload file' }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, [type]: error.message }));
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addLanguage = () => {
    if (newLanguage.name.trim()) {
      setProfile(prev => ({
        ...prev,
        languages: [...prev.languages, { ...newLanguage }]
      }));
      setNewLanguage({ name: '', proficiency: 'Beginner' });
    }
  };

  const removeLanguage = (languageToRemove) => {
    setProfile(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang.name !== languageToRemove)
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-6">
        <FaUser className="text-2xl text-gray-600" />
        <h1 className="text-2xl font-bold text-gray-800">Profile Settings</h1>
      </div>

      {errors.submit && (
        <div className="p-4 mb-4 rounded bg-red-100 text-red-700">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
            error={errors.fullName}
            required
          />

          <Input
            label="Role"
            name="role"
            value={profile.role}
            onChange={handleChange}
            error={errors.role}
            required
          />

          <div className="col-span-2">
            <TextArea
              label="Bio"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              error={errors.bio}
              required
              rows={4}
              showCount
              maxLength={500}
            />
          </div>

          <div>
            <FileInput
              label="Avatar"
              name="avatar"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'avatar')}
              error={errors.avatar}
              currentFile={profile.avatar}
              preview
            />
          </div>

          <div>
            <FileInput
              label="Resume"
              name="resume"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileChange(e, 'resume')}
              error={errors.resume}
              currentFile={profile.resume}
              preview={false}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="text-green-600 hover:text-green-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill"
              className="flex-1"
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Languages</h3>
          <div className="grid gap-4">
            {profile.languages.map((language) => (
              <div
                key={language.name}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <div>
                  <span className="font-medium">{language.name}</span>
                  <span className="ml-2 text-sm text-gray-500">
                    ({language.proficiency})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeLanguage(language.name)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newLanguage.name}
              onChange={(e) => setNewLanguage(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Language name"
              className="flex-1"
            />
            <select
              value={newLanguage.proficiency}
              onChange={(e) => setNewLanguage(prev => ({ ...prev, proficiency: e.target.value }))}
              className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Native</option>
            </select>
            <button
              type="button"
              onClick={addLanguage}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add
            </button>
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