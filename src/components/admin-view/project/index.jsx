'use client'
import { useRef, useState } from 'react';
import { Input, TextArea, Select, FileInput } from "../form-controls/index.jsx";
import { motion } from "framer-motion";
import Image from "next/image";
import { uploadImage } from '@/utils/cloudinary';
import { FaCloudUploadAlt, FaTrash, FaSpinner, FaEdit, FaMagic } from 'react-icons/fa';
import { handleDelete, handleEdit, updateData } from "@/services";
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const controls = [
    {
        name: 'projectUrl',
        placeholder: 'https://github.com/username/project or live URL',
        type: 'url',
        label: 'Project URL (for auto-analysis)',
    },
    {
        name: 'name',
        placeholder: 'Project name',
        type: 'text',
        label: 'Project Name*',
        required: true
    },
    {
        name: 'shortDescription',
        placeholder: 'Brief overview of the project',
        type: 'textarea',
        label: 'Short Description*',
        required: true
    },
    {
        name: 'description',
        placeholder: 'Detailed project description',
        type: 'textarea',
        label: 'Full Description*',
        required: true
    },
    {
        name: 'website',
        placeholder: 'https://example.com',
        type: 'url',
        label: 'Website URL'
    },
    {
        name: 'github',
        placeholder: 'https://github.com/username/project',
        type: 'url',
        label: 'GitHub URL'
    },
    {
        name: 'technologies',
        placeholder: 'React, Next.js, TailwindCSS, MongoDB',
        type: 'text',
        label: 'Technologies*',
        required: true
    },
    {
        name: 'category',
        type: 'select',
        label: 'Category*',
        required: true,
        options: ['Web App', 'Mobile App', 'Desktop App', 'Library', 'Other']
    },
    {
        name: 'status',
        type: 'select',
        label: 'Status*',
        required: true,
        options: ['Completed', 'In Progress', 'Planned']
    }
];

export default function AdminProjectView({formData, setFormData, handleSaveData, data}) {
    const [activeTab, setActiveTab] = useState('form');
    const [features, setFeatures] = useState(['']);
    const [screenshots, setScreenshots] = useState(['']);
    const [challenges, setChallenges] = useState(['']);
    const [solutions, setSolutions] = useState(['']);
    const [testimonials, setTestimonials] = useState([{ name: '', role: '', comment: '' }]);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [screenshotGuide, setScreenshotGuide] = useState([]);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...features];
        newFeatures[index] = value;
        setFeatures(newFeatures);
        setFormData({ ...formData, features: newFeatures.filter(f => f) });
    };

    const handleScreenshotUpload = async (index, file) => {
        if (!file) return;

        try {
            setUploading(true);
            const result = await uploadImage(file);
            
            if (result.success) {
                const newScreenshots = [...screenshots];
                newScreenshots[index] = {
                    url: result.url,
                    title: file.name,
                    description: '',
                    section: 'main',
                    order: index
                };
                setScreenshots(newScreenshots);
                setFormData({ ...formData, screenshots: newScreenshots.filter(s => s && s.url) });
            } else {
                alert('Failed to upload image: ' + result.error);
            }
        } catch (error) {
            console.error('Error uploading screenshot:', error);
            alert('Error uploading image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleChallengeChange = (index, value) => {
        const newChallenges = [...challenges];
        newChallenges[index] = value;
        setChallenges(newChallenges);
        setFormData({ ...formData, challengesFaced: newChallenges.filter(c => c) });
    };

    const handleSolutionChange = (index, value) => {
        const newSolutions = [...solutions];
        newSolutions[index] = value;
        setSolutions(newSolutions);
        setFormData({ ...formData, solutions: newSolutions.filter(s => s) });
    };

    const handleTestimonialChange = (index, field, value) => {
        const newTestimonials = [...testimonials];
        newTestimonials[index] = { ...newTestimonials[index], [field]: value };
        setTestimonials(newTestimonials);
        setFormData({ ...formData, testimonials: newTestimonials.filter(t => t.name || t.role || t.comment) });
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await handleDelete('project', itemToDelete._id);
            if (response.success) {
                setIsDeleteModalOpen(false);
                setItemToDelete(null);
                window.location.reload();
            } else {
                console.error("Failed to delete project:", response.message);
                alert("Failed to delete project. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting project:", error);
            alert("Error deleting project. Please try again.");
        }
    };

    const handleEditClick = async (item) => {
        try {
            const response = await handleEdit('project', item._id);
            if (response.success) {
                const projectData = response.data;
                setFormData(projectData);
                setFeatures(projectData.features || ['']);
                setScreenshots(projectData.screenshots || ['']);
                setChallenges(projectData.challengesFaced || ['']);
                setSolutions(projectData.solutions || ['']);
                setTestimonials(projectData.testimonials || [{ name: '', role: '', comment: '' }]);
                setIsEditing(true);
                setEditingId(item._id);
                setActiveTab('form');
            } else {
                console.error("Failed to fetch project details:", response.message);
                alert("Failed to fetch project details. Please try again.");
            }
        } catch (error) {
            console.error("Error fetching project details:", error);
            alert("Error fetching project details. Please try again.");
        }
    };

    const handleUpdate = async () => {
        try {
            const response = await updateData('project', editingId, formData);
            if (response.success) {
                setIsEditing(false);
                setEditingId(null);
                setFormData({});
                setFeatures(['']);
                setScreenshots(['']);
                setChallenges(['']);
                setSolutions(['']);
                setTestimonials([{ name: '', role: '', comment: '' }]);
                window.location.reload();
            } else {
                console.error("Failed to update project:", response.message);
                alert("Failed to update project. Please try again.");
            }
        } catch (error) {
            console.error("Error updating project:", error);
            alert("Error updating project. Please try again.");
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setEditingId(null);
        setFormData({});
        setFeatures(['']);
        setScreenshots(['']);
        setChallenges(['']);
        setSolutions(['']);
        setTestimonials([{ name: '', role: '', comment: '' }]);
    };

    const handleAnalyzeUrl = async () => {
        if (!formData.projectUrl) {
            alert('Please enter a project URL');
            return;
        }

        setAnalyzing(true);
        try {
            const response = await fetch('/api/project/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: formData.projectUrl }),
            });

            const result = await response.json();
            if (result.success) {
                const { projectDetails, screenshotGuide } = result.data;
                setFormData(prev => ({
                    ...prev,
                    ...projectDetails,
                }));
                setFeatures(projectDetails.features || ['']);
                setChallenges(projectDetails.challengesFaced || ['']);
                setSolutions(projectDetails.solutions || ['']);
                setScreenshotGuide(screenshotGuide);
            } else {
                alert('Failed to analyze project: ' + result.message);
            }
        } catch (error) {
            console.error('Error analyzing project:', error);
            alert('Error analyzing project. Please try again.');
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="w-full">
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b">
                    <button
                        className={`flex-1 py-4 px-6 text-center font-semibold ${
                            activeTab === 'form' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'
                        }`}
                        onClick={() => setActiveTab('form')}
                    >
                        {isEditing ? 'Edit Project' : 'Add New Project'}
                    </button>
                    <button
                        className={`flex-1 py-4 px-6 text-center font-semibold ${
                            activeTab === 'list' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'
                        }`}
                        onClick={() => setActiveTab('list')}
                    >
                        View Projects
                    </button>
                </div>

                <div className="p-6">
                    {activeTab === 'form' ? (
                        <div className="space-y-6">
                            {/* URL Analysis Section */}
                            <div className="flex gap-4 items-end mb-8">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Project URL
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.projectUrl || ''}
                                        onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                                        placeholder="Enter project URL for auto-analysis"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
                                    />
                                </div>
                                <button
                                    onClick={handleAnalyzeUrl}
                                    disabled={analyzing}
                                    className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 ${
                                        analyzing
                                            ? 'bg-gray-100 text-gray-400'
                                            : 'bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:from-green-500 hover:to-emerald-600'
                                    }`}
                                >
                                    {analyzing ? (
                                        <>
                                            <FaSpinner className="animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <FaMagic />
                                            Auto-Analyze
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Screenshot Guide */}
                            {screenshotGuide.length > 0 && (
                                <div className="mb-8 p-4 bg-green-50 rounded-xl">
                                    <h3 className="text-lg font-semibold text-green-800 mb-4">
                                        📸 Recommended Screenshots
                                    </h3>
                                    <div className="space-y-4">
                                        {screenshotGuide.map((guide, index) => (
                                            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                                                <h4 className="font-medium text-green-700">
                                                    Screenshot {index + 1}: {guide.description}
                                                </h4>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {guide.importance}
                                                </p>
                                                <p className="text-sm text-green-600 mt-2">
                                                    💡 {guide.captureGuide}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Form Controls */}
                            <div className="space-y-4">
                                {controls.map((control, index) => {
                                    let Component;
                                    switch (control.type) {
                                        case 'text':
                                        case 'number':
                                        case 'url':
                                            Component = Input;
                                            break;
                                        case 'textarea':
                                            Component = TextArea;
                                            break;
                                        case 'select':
                                            Component = Select;
                                            break;
                                        case 'file':
                                            Component = FileInput;
                                            break;
                                        default:
                                            console.warn(`Unknown control type: ${control.type}`);
                                            return null;
                                    }

                                    if (!Component) return null;

                                    return (
                                        <Component
                                            key={index}
                                            {...control}
                                            value={formData[control.name] || ''}
                                            onChange={(value) => setFormData({ ...formData, [control.name]: value })}
                                        />
                                    );
                                })}
                            </div>

                            {/* Screenshots */}
                            <section>
                                <h3 className="text-xl font-semibold mb-4">Screenshots</h3>
                                <div className="space-y-4">
                                    {screenshots.map((screenshot, index) => (
                                        <div key={index} className="flex gap-4">
                                            <div className="flex-1 space-y-2">
                                                {screenshot && (typeof screenshot === 'object' ? screenshot.url : screenshot) ? (
                                                    <div className="relative">
                                                        <div className="relative w-40 h-40 rounded-lg overflow-hidden">
                                                            <Image
                                                                src={typeof screenshot === 'object' ? screenshot.url : screenshot}
                                                                alt={`Screenshot ${index + 1}`}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                const newScreenshots = [...screenshots];
                                                                newScreenshots[index] = '';
                                                                setScreenshots(newScreenshots);
                                                                setFormData({ ...formData, screenshots: newScreenshots.filter(s => s) });
                                                            }}
                                                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                        >
                                                            <FaTrash size={12} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            ref={fileInputRef}
                                                            onChange={(e) => handleScreenshotUpload(index, e.target.files[0])}
                                                        />
                                                        <button
                                                            onClick={() => fileInputRef.current?.click()}
                                                            disabled={uploading}
                                                            className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-green-600 transition-colors"
                                                        >
                                                            {uploading ? (
                                                                <>
                                                                    <FaSpinner className="animate-spin text-green-600" size={24} />
                                                                    <span className="text-sm text-gray-500">Uploading...</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FaCloudUploadAlt className="text-gray-400" size={24} />
                                                                    <span className="text-sm text-gray-500">Click to upload</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            {index === screenshots.length - 1 && (
                                                <button
                                                    onClick={() => setScreenshots([...screenshots, ''])}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                                >
                                                    Add More
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <div className="mt-6 flex justify-end">
                                {isEditing ? (
                                    <div className="flex gap-4">
                                        <button 
                                            onClick={resetForm}
                                            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={handleUpdate}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                                        >
                                            Update Project
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => handleSaveData('project')}
                                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                                    >
                                        Add Project
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {data && data.length > 0 ? (
                                data.map((item, index) => (
                                    <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 hover:border-green-500 transition duration-300">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-grow">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEditClick(item)}
                                                            className="text-blue-500 hover:text-blue-700 transition-colors p-2"
                                                            title="Edit project"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(item)}
                                                            className="text-red-500 hover:text-red-700 transition-colors p-2"
                                                            title="Delete project"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 mt-2">{item.shortDescription}</p>
                                                <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                                                    <span>{item.category}</span>
                                                    <span>•</span>
                                                    <span>{item.status}</span>
                                                </div>
                                                <div className="mt-4">
                                                    <p className="text-sm font-medium text-gray-600">Technologies:</p>
                                                    <p className="text-gray-700">{item.technologies}</p>
                                                </div>
                                                {item.screenshots && item.screenshots.length > 0 && (
                                                    <div className="mt-4 flex gap-4 overflow-x-auto">
                                                        {item.screenshots.map((screenshot, idx) => {
                                                            const imageUrl = typeof screenshot === 'object' ? screenshot.url : screenshot;
                                                            return imageUrl ? (
                                                                <div key={idx} className="relative w-40 h-40 flex-shrink-0">
                                                                    <Image
                                                                        src={imageUrl}
                                                                        alt={`Project screenshot ${idx + 1}`}
                                                                        fill
                                                                        className="object-cover rounded-lg"
                                                                    />
                                                                </div>
                                                            ) : null;
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500">No projects added yet.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <Transition appear show={isDeleteModalOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-50" onClose={() => setIsDeleteModalOpen(false)}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-sm" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4 text-center">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-b from-white to-gray-50 p-6 text-left align-middle shadow-xl transition-all border-t-4 border-gradient-to-r from-red-500 via-red-600 to-red-700">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0">
                                                <FaTrash className="w-5 h-5 text-white" />
                                            </div>
                                            <Dialog.Title as="h3" className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
                                                Delete Project
                                            </Dialog.Title>
                                        </div>

                                        <div className="mt-4">
                                            <p className="text-sm text-gray-600 mb-2">
                                                You are about to delete the project:
                                            </p>
                                            <p className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900 mb-4">
                                                "{itemToDelete?.name}"
                                            </p>
                                            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200 mb-4 shadow-inner">
                                                <p className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
                                                    <strong>Warning:</strong> This action cannot be undone. This will permanently delete:
                                                </p>
                                                <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
                                                    <li className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-red-900">Project details and description</li>
                                                    <li className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-red-900">All associated screenshots</li>
                                                    <li className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-red-900">Technical documentation</li>
                                                    <li className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-red-900">Project analytics and metrics</li>
                                                </ul>
                                            </div>
                                            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                                                <p className="text-sm text-gray-700">
                                                    Please type <span className="font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">delete</span> to confirm.
                                                </p>
                                                <input
                                                    type="text"
                                                    className="mt-2 w-full px-3 py-2 bg-white/80 backdrop-blur-sm border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-inner"
                                                    placeholder="Type delete to confirm"
                                                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                                                    value={deleteConfirmation}
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-6 flex gap-3">
                                            <button
                                                type="button"
                                                className={`flex-1 justify-center rounded-md px-4 py-2.5 text-sm font-semibold text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all duration-200 ${
                                                    deleteConfirmation.toLowerCase() === 'delete'
                                                        ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-500 hover:via-red-400 hover:to-red-500 focus-visible:ring-red-500 shadow-lg hover:shadow-red-500/30'
                                                        : 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
                                                }`}
                                                onClick={handleDeleteConfirm}
                                                disabled={deleteConfirmation.toLowerCase() !== 'delete'}
                                            >
                                                <span className="flex items-center justify-center gap-2">
                                                    <FaTrash className="w-4 h-4" />
                                                    Permanently Delete
                                                </span>
                                            </button>
                                            <button
                                                type="button"
                                                className="flex-1 rounded-md bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:from-gray-100 hover:to-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 transition-all duration-200"
                                                onClick={() => {
                                                    setIsDeleteModalOpen(false);
                                                    setDeleteConfirmation('');
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            )}
        </div>
    );
} 