'use client'

import { useState, useEffect } from 'react'
import { Input, TextArea, Select, FileInput } from "../form-controls/index.jsx"
import { FaPlus, FaTrash, FaMobileAlt, FaLaptop, FaStar } from 'react-icons/fa'
import { DeviceFrames } from '@/components/common/device-frames'
import Image from 'next/image'
import { motion } from 'framer-motion'

const controls = [
    {
        name: 'headline',
        placeholder: 'A short, impactful headline about yourself (e.g., "Passionate Full-Stack Developer | UI/UX Enthusiast")',
        type: 'text',
        label: 'Professional Headline',
        value: ""
    },
    {
        name: 'shortBio',
        placeholder: 'Write a compelling one-liner about yourself (100-150 characters)',
        type: 'textarea',
        label: 'Short Bio',
        value: "Passionate software developer with a knack for creating intuitive user experiences, specializing in building responsive web applications."
    },
    {
        name: 'aboutme',
        placeholder: 'Write a detailed description about yourself (200-1000 characters)',
        type: 'textarea',
        label: 'About Me',
        value: "I am a passionate full-stack developer with expertise in modern web technologies. I love creating efficient, scalable, and user-friendly applications."
    },
    {
        name: 'vision',
        placeholder: 'Share your professional vision and what you aim to achieve',
        type: 'textarea',
        label: 'Professional Vision',
        value: ""
    },
    {
        name: 'principles',
        type: 'array',
        label: 'Guiding Principles',
        placeholder: 'Add your core principles and values',
        value: []
    },
    {
        name: 'journey',
        type: 'array',
        label: 'Professional Journey',
        placeholder: 'Add significant milestones in your career',
        value: []
    },
    {
        name: 'expertise',
        type: 'array',
        label: 'Areas of Expertise',
        placeholder: 'Add your key areas of expertise',
        value: []
    },
    {
        name: 'noofprojects',
        placeholder: 'Number of Projects',
        type: 'number',
        label: 'Projects Completed',
        value: "25"
    },
    {
        name: 'yearofexerience',
        placeholder: 'Years of Experience',
        type: 'number',
        label: 'Years of Experience',
        value: "5"
    },
    {
        name: 'noofclients',
        placeholder: 'Number of Clients',
        type: 'number',
        label: 'Satisfied Clients',
        value: "20"
    },
    {
        name: 'skills',
        placeholder: 'Enter skills (comma-separated)',
        type: 'text',
        label: 'Technical Skills',
        value: "React.js, Next.js, Node.js, MongoDB, Express.js, JavaScript, TypeScript, HTML5, CSS3, Tailwind CSS, Git, AWS, Docker, REST API, GraphQL"
    },
    {
        name: 'uniqueSellingPoints',
        type: 'array',
        label: 'Unique Selling Points',
        placeholder: 'Add what makes you unique',
        value: []
    }
]

const languageProficiencyLevels = ["Basic", "Intermediate", "Advanced", "Native"]

export default function AdminAboutView({ formData, setFormData, handleSaveData }) {
    const [activeTab, setActiveTab] = useState('basic')
    const [iPhoneImage, setIPhoneImage] = useState(null)
    const [macBookImage, setMacBookImage] = useState(null)
    const [loading, setLoading] = useState(true)

    // Initialize form data with default values
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/about/get')
                const data = await response.json()
                if (data.success && data.data) {
                    setFormData(data.data)
                    // Set device images from formData if they exist
                    setIPhoneImage(data.data.deviceImages?.iPhone || null)
                    setMacBookImage(data.data.deviceImages?.macBook || null)
                }
            } catch (error) {
                console.error('Error fetching about data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleImageUpload = async (file, device) => {
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('device', device)

            const response = await fetch('/api/about/upload-device-image', {
                method: 'POST',
                body: formData
            })

            const data = await response.json()
            if (data.success) {
                setFormData(prev => ({
                    ...prev,
                    deviceImages: {
                        ...prev.deviceImages,
                        [device]: data.url
                    }
                }))
            }
        } catch (error) {
            console.error('Error uploading image:', error)
            alert('Error uploading image')
        }
    }

    const handleAddEducation = () => {
        setFormData(prev => ({
            ...prev,
            education: [...(prev.education || []), {
                degree: '',
                institution: '',
                year: '',
                description: ''
            }]
        }))
    }

    const handleAddCertification = () => {
        setFormData(prev => ({
            ...prev,
            certifications: [...(prev.certifications || []), {
                name: '',
                issuer: '',
                year: '',
                link: ''
            }]
        }))
    }

    const handleAddLanguage = () => {
        setFormData(prev => ({
            ...prev,
            languages: [...(prev.languages || []), {
                name: '',
                proficiency: 'Basic'
            }]
        }))
    }

    const handleAddAchievement = () => {
        setFormData(prev => ({
            ...prev,
            achievements: [...(prev.achievements || []), {
                title: '',
                year: '',
                description: ''
            }]
        }))
    }

    const handleRemoveItem = (section, index) => {
        setFormData(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }))
    }

    const handleUpdateField = (section, index, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: prev[section].map((item, i) => 
                i === index ? { ...item, [field]: value } : item
            )
        }))
    }

    const handleAddItem = (section, item) => {
        setFormData(prev => ({
            ...prev,
            [section]: [...(prev[section] || []), item]
        }))
    }

    const handleUpdateArrayItem = (section, index, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: prev[section].map((item, i) => 
                i === index ? { ...item, [field]: value } : item
            )
        }))
    }

    const handleSaveAboutData = async () => {
        try {
            console.log('Saving about data:', formData);
            const response = await fetch('/api/about/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log('Save response:', data);

            if (data.success) {
                alert('About information updated successfully');
                if (data.data) {
                    setFormData(data.data);
                }
            } else {
                console.error('Failed to save:', data.message);
                alert(data.message || 'Error updating about information');
            }
        } catch (error) {
            console.error('Error saving about data:', error);
            alert('Error updating about information');
        }
    }

    const tabs = {
        basic: (
            <div className="space-y-6">
                {/* Professional Summary Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Professional Summary</h3>
                    <Input
                        label="Professional Headline"
                        placeholder="A short, impactful headline about yourself"
                        value={formData.headline}
                        onChange={(value) => setFormData(prev => ({ ...prev, headline: value }))}
                        className="mb-4"
                    />
                    <TextArea
                        label="Short Bio"
                        placeholder="Write a compelling one-liner about yourself (100-150 characters)"
                        value={formData.shortBio}
                        onChange={(value) => setFormData(prev => ({ ...prev, shortBio: value }))}
                        className="mb-4"
                    />
                    <TextArea
                        label="About Me"
                        placeholder="Write a detailed description about yourself (200-1000 characters)"
                        value={formData.aboutme}
                        onChange={(value) => setFormData(prev => ({ ...prev, aboutme: value }))}
                        className="mb-4"
                    />
                    <TextArea
                        label="Professional Vision"
                        placeholder="Share your professional vision and what you aim to achieve"
                        value={formData.vision}
                        onChange={(value) => setFormData(prev => ({ ...prev, vision: value }))}
                    />
                </div>

                {/* Guiding Principles Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Guiding Principles</h3>
                        <button
                            onClick={() => handleAddItem('principles', { title: '', description: '' })}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            Add Principle
                        </button>
                    </div>
                    <div className="space-y-4">
                        {formData.principles?.map((principle, index) => (
                            <PrincipleItem
                                key={index}
                                principle={principle}
                                onRemove={() => handleRemoveItem('principles', index)}
                                onUpdate={(field, value) => handleUpdateArrayItem('principles', index, field, value)}
                            />
                        ))}
                    </div>
                </div>

                {/* Professional Journey Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Professional Journey</h3>
                        <button
                            onClick={() => handleAddItem('journey', { year: '', title: '', description: '' })}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            Add Milestone
                        </button>
                    </div>
                    <div className="space-y-4">
                        {formData.journey?.map((milestone, index) => (
                            <JourneyItem
                                key={index}
                                milestone={milestone}
                                onRemove={() => handleRemoveItem('journey', index)}
                                onUpdate={(field, value) => handleUpdateArrayItem('journey', index, field, value)}
                            />
                        ))}
                    </div>
                </div>

                {/* Areas of Expertise Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Areas of Expertise</h3>
                        <button
                            onClick={() => handleAddItem('expertise', { area: '', description: '', technologies: '' })}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            Add Expertise
                        </button>
                    </div>
                    <div className="space-y-4">
                        {formData.expertise?.map((exp, index) => (
                            <ExpertiseItem
                            key={index}
                                expertise={exp}
                                onRemove={() => handleRemoveItem('expertise', index)}
                                onUpdate={(field, value) => handleUpdateArrayItem('expertise', index, field, value)}
                            />
                        ))}
                    </div>
                </div>

                {/* Device Frames Section */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Device Frames</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* iPhone Image Upload */}
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">
                                iPhone Frame Image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e.target.files[0], 'iPhone')}
                                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-green-50 file:text-green-700
                                    hover:file:bg-green-100"
                            />
                        </div>
                        
                        {/* MacBook Image Upload */}
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">
                                MacBook Frame Image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e.target.files[0], 'macBook')}
                                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-green-50 file:text-green-700
                                    hover:file:bg-green-100"
                            />
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="mt-8 bg-gray-50 p-6 rounded-xl">
                        <h4 className="text-sm font-medium text-gray-700 mb-4">Preview</h4>
                        <DeviceFrames
                            iPhoneImage={iPhoneImage}
                            macBookImage={macBookImage}
                            className="max-w-full overflow-x-auto"
                        />
                    </div>
                </div>

                {/* Stats Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Professional Stats</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Input
                            label="Projects Completed"
                            placeholder="Number of Projects"
                            value={formData.noofprojects || ''}
                            onChange={(value) => setFormData(prev => ({ ...prev, noofprojects: value }))}
                        />
                        <Input
                            label="Years of Experience"
                            placeholder="Years of Experience"
                            value={formData.yearofexerience || ''}
                            onChange={(value) => setFormData(prev => ({ ...prev, yearofexerience: value }))}
                        />
                        <Input
                            label="Satisfied Clients"
                            placeholder="Number of Clients"
                            value={formData.noofclients || ''}
                            onChange={(value) => setFormData(prev => ({ ...prev, noofclients: value }))}
                        />
                        <div className="col-span-3">
                            <Input
                                label="Technical Skills"
                                placeholder="Enter skills (comma-separated)"
                                value={formData.skills || ''}
                                onChange={(value) => setFormData(prev => ({ ...prev, skills: value }))}
                            />
                        </div>
                    </div>
                </div>

                {/* Unique Selling Points Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Unique Selling Points</h3>
                            <p className="text-sm text-gray-600 mt-1">What makes you stand out from others?</p>
                        </div>
                        <button
                            onClick={() => handleAddItem('uniqueSellingPoints', { 
                                title: '', 
                                description: '', 
                                icon: 'star'
                            })}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                        >
                            <FaPlus className="w-4 h-4" />
                            Add USP
                        </button>
                    </div>
                    <div className="space-y-4">
                        {formData.uniqueSellingPoints?.map((usp, index) => (
                            <USPItem
                                key={index}
                                usp={usp}
                                onRemove={() => handleRemoveItem('uniqueSellingPoints', index)}
                                onUpdate={(field, value) => handleUpdateArrayItem('uniqueSellingPoints', index, field, value)}
                            />
                        ))}
                        {(!formData.uniqueSellingPoints || formData.uniqueSellingPoints.length === 0) && (
                            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                <div className="text-gray-500">
                                    <FaStar className="w-8 h-8 mx-auto mb-2" />
                                    <p className="text-sm">Add your unique selling points to stand out</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        ),
        education: (
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Education</h3>
                    <button
                        onClick={handleAddEducation}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Add Education
                    </button>
                </div>
                {formData.education?.map((edu, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-md relative">
                        <button
                            onClick={() => handleRemoveItem('education', index)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                            <FaTrash />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Degree"
                                value={edu.degree}
                                onChange={(value) => handleUpdateField('education', index, 'degree', value)}
                            />
                            <Input
                                label="Institution"
                                value={edu.institution}
                                onChange={(value) => handleUpdateField('education', index, 'institution', value)}
                            />
                            <Input
                                label="Year"
                                value={edu.year}
                                onChange={(value) => handleUpdateField('education', index, 'year', value)}
                            />
                            <TextArea
                                label="Description"
                                value={edu.description}
                                onChange={(value) => handleUpdateField('education', index, 'description', value)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        ),
        certifications: (
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Certifications</h3>
                    <button
                        onClick={handleAddCertification}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Add Certification
                    </button>
                </div>
                {formData.certifications?.map((cert, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-md relative">
                        <button
                            onClick={() => handleRemoveItem('certifications', index)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                            <FaTrash />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Name"
                                value={cert.name}
                                onChange={(value) => handleUpdateField('certifications', index, 'name', value)}
                            />
                            <Input
                                label="Issuer"
                                value={cert.issuer}
                                onChange={(value) => handleUpdateField('certifications', index, 'issuer', value)}
                            />
                            <Input
                                label="Year"
                                value={cert.year}
                                onChange={(value) => handleUpdateField('certifications', index, 'year', value)}
                            />
                            <Input
                                label="Link"
                                value={cert.link}
                                onChange={(value) => handleUpdateField('certifications', index, 'link', value)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        ),
        languages: (
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Languages</h3>
                    <button
                        onClick={handleAddLanguage}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Add Language
                    </button>
                </div>
                {formData.languages?.map((lang, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-md relative">
                        <button
                            onClick={() => handleRemoveItem('languages', index)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                            <FaTrash />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Language"
                                value={lang.name}
                                onChange={(value) => handleUpdateField('languages', index, 'name', value)}
                            />
                            <Select
                                label="Proficiency"
                                value={lang.proficiency}
                                options={['Basic', 'Intermediate', 'Advanced', 'Native']}
                                onChange={(value) => handleUpdateField('languages', index, 'proficiency', value)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        ),
        achievements: (
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Achievements</h3>
                    <button
                        onClick={handleAddAchievement}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Add Achievement
                    </button>
                </div>
                {formData.achievements?.map((achievement, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-md relative">
                        <button
                            onClick={() => handleRemoveItem('achievements', index)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                            <FaTrash />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Title"
                                value={achievement.title}
                                onChange={(value) => handleUpdateField('achievements', index, 'title', value)}
                            />
                            <Input
                                label="Year"
                                value={achievement.year}
                                onChange={(value) => handleUpdateField('achievements', index, 'year', value)}
                            />
                            <TextArea
                                label="Description"
                                value={achievement.description}
                                onChange={(value) => handleUpdateField('achievements', index, 'description', value)}
                                className="col-span-2"
                            />
                        </div>
                    </div>
                ))}
            </div>
        ),
        social: (
            <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-4">Social Links</h3>
                <div className="grid grid-cols-1 gap-4">
                    <Input
                        label="GitHub Profile URL"
                        value={formData.socialLinks?.github || ''}
                        onChange={(value) => setFormData(prev => ({
                            ...prev,
                            socialLinks: { ...prev.socialLinks, github: value }
                        }))}
                    />
                    <Input
                        label="LinkedIn Profile URL"
                        value={formData.socialLinks?.linkedin || ''}
                        onChange={(value) => setFormData(prev => ({
                            ...prev,
                            socialLinks: { ...prev.socialLinks, linkedin: value }
                        }))}
                    />
                    <Input
                        label="Twitter Profile URL"
                        value={formData.socialLinks?.twitter || ''}
                        onChange={(value) => setFormData(prev => ({
                            ...prev,
                            socialLinks: { ...prev.socialLinks, twitter: value }
                        }))}
                    />
                    <Input
                        label="Portfolio Website URL"
                        value={formData.socialLinks?.portfolio || ''}
                        onChange={(value) => setFormData(prev => ({
                            ...prev,
                            socialLinks: { ...prev.socialLinks, portfolio: value }
                        }))}
                    />
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-main"></div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">About Information</h2>
                <button
                    onClick={handleSaveAboutData}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                    Save Changes
                </button>
            </div>

            <div className="mb-6">
                <div className="flex space-x-4 border-b">
                    {Object.keys(tabs).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 ${activeTab === tab
                                ? 'border-b-2 border-green-600 text-green-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
                </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
                {tabs[activeTab]}
    </div>
 </div>
    )
}

const PrincipleItem = ({ principle, onRemove, onUpdate }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 relative group">
        <button
            onClick={onRemove}
            className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
            <FaTrash />
        </button>
        <Input
            label="Title"
            value={principle.title}
            onChange={(value) => onUpdate('title', value)}
            placeholder="e.g., User-Centric Design"
        />
        <TextArea
            label="Description"
            value={principle.description}
            onChange={(value) => onUpdate('description', value)}
            placeholder="Explain this principle and why it matters to you"
        />
    </div>
);

const JourneyItem = ({ milestone, onRemove, onUpdate }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 relative group">
        <button
            onClick={onRemove}
            className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
            <FaTrash />
        </button>
        <Input
            label="Year"
            value={milestone.year}
            onChange={(value) => onUpdate('year', value)}
            placeholder="e.g., 2020"
        />
        <Input
            label="Title"
            value={milestone.title}
            onChange={(value) => onUpdate('title', value)}
            placeholder="e.g., Started as Lead Developer"
        />
        <TextArea
            label="Description"
            value={milestone.description}
            onChange={(value) => onUpdate('description', value)}
            placeholder="Describe this milestone and its impact on your career"
        />
    </div>
);

const ExpertiseItem = ({ expertise, onRemove, onUpdate }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 relative group">
        <button
            onClick={onRemove}
            className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
            <FaTrash />
        </button>
        <Input
            label="Area"
            value={expertise.area}
            onChange={(value) => onUpdate('area', value)}
            placeholder="e.g., Frontend Development"
        />
        <TextArea
            label="Description"
            value={expertise.description}
            onChange={(value) => onUpdate('description', value)}
            placeholder="Describe your expertise in this area"
        />
        <Input
            label="Technologies"
            value={expertise.technologies}
            onChange={(value) => onUpdate('technologies', value)}
            placeholder="e.g., React, Vue, Angular"
        />
    </div>
);

const USPItem = ({ usp, onRemove, onUpdate }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 relative group hover:shadow-md transition-shadow">
        <button
            onClick={onRemove}
            className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
            <FaTrash />
        </button>
        <div className="space-y-4">
            <Input
                label="Title"
                value={usp.title}
                onChange={(value) => onUpdate('title', value)}
                placeholder="e.g., Full-Stack Expertise"
            />
            <TextArea
                label="Description"
                value={usp.description}
                onChange={(value) => onUpdate('description', value)}
                placeholder="Describe what makes this unique and valuable"
            />
            <Select
                label="Icon"
                value={usp.icon}
                options={[
                    'star', 'code', 'lightbulb', 'rocket', 'chart', 
                    'shield', 'target', 'puzzle', 'tools', 'brain'
                ]}
                onChange={(value) => onUpdate('icon', value)}
            />
        </div>
    </div>
);