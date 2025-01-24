'use client'

import { useEffect, useState } from 'react'
import { handleDelete, handleEdit, updateData } from "@/services"
import { Input, TextArea, Select, FileInput } from "../form-controls/index.jsx"
import { FaTrash, FaEdit } from 'react-icons/fa'
import { Dialog } from '@headlessui/react'

const controls = [
    {
        name: 'degree',
        placeholder: 'Enter degree name',
        type: 'text',
        label: 'Degree Name'
    },
    {
        name: 'year',
        placeholder: 'Enter graduation year',
        type: 'text',
        label: 'Year'
    },
    {
        name: 'college',
        placeholder: 'Enter college/university name',
        type: 'text',
        label: 'College Name'
    }
]

export default function AdminEducationView({ formData, setFormData, handleSaveData, data }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState(null)

    // Initialize form data with empty values
    useEffect(() => {
        if (!formData || Object.keys(formData).length === 0) {
            const initialData = controls.reduce((acc, control) => {
                acc[control.name] = '';
                return acc;
            }, {});
            
            setFormData(initialData);
        }
    }, []);

    const handleDeleteClick = (item) => {
        setItemToDelete(item)
        setIsDeleteModalOpen(true)
    }

    const handleDeleteConfirm = async () => {
        try {
            const response = await handleDelete('education', itemToDelete._id);
            if (response.success) {
                setIsDeleteModalOpen(false)
                setItemToDelete(null)
                // Refresh the page or update the data list
                window.location.reload();
            } else {
                console.error("Failed to delete education:", response.message);
                alert("Failed to delete education. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting education:", error);
            alert("Error deleting education. Please try again.");
        }
    };

    const handleEditClick = async (item) => {
        try {
            const response = await handleEdit('education', item._id);
            if (response.success) {
                setFormData(response.data);
                setIsEditing(true);
                setEditingId(item._id);
            } else {
                console.error("Failed to fetch education details:", response.message);
                alert("Failed to fetch education details. Please try again.");
            }
        } catch (error) {
            console.error("Error fetching education details:", error);
            alert("Error fetching education details. Please try again.");
        }
    };

    const handleUpdate = async () => {
        try {
            const response = await updateData('education', editingId, formData);
            if (response.success) {
                setIsEditing(false);
                setEditingId(null);
                setFormData(controls.reduce((acc, control) => {
                    acc[control.name] = '';
                    return acc;
                }, {}));
                window.location.reload();
            } else {
                console.error("Failed to update education:", response.message);
                alert("Failed to update education. Please try again.");
            }
        } catch (error) {
            console.error("Error updating education:", error);
            alert("Error updating education. Please try again.");
        }
    };

    return (
        <div className="w-full">
            <div className="bg-white shadow-md rounded-lg p-6">
                {data && data.length > 0 && (
                    <div className="mb-10 space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Current Education Entries</h2>
                        {data.map((item, index) => (
                            <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 hover:border-green-500 transition duration-300">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-semibold text-gray-800">{item.degree}</h3>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEditClick(item)}
                                                    className="text-blue-500 hover:text-blue-700 transition-colors p-2"
                                                    title="Edit education"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(item)}
                                                    className="text-red-500 hover:text-red-700 transition-colors p-2"
                                                    title="Delete education"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 mt-2">{item.college}</p>
                                        <p className="text-gray-500 text-sm mt-1">{item.year}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        {isEditing ? 'Edit Education' : 'Add New Education'}
                    </h2>
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
                </div>

                <div className="mt-6 flex justify-end">
                    {isEditing ? (
                        <div className="flex gap-4">
                            <button 
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditingId(null);
                                    setFormData(controls.reduce((acc, control) => {
                                        acc[control.name] = '';
                                        return acc;
                                    }, {}));
                                }}
                                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleUpdate}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                            >
                                Update Education
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => handleSaveData('education')}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                        >
                            Add Education
                        </button>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Dialog
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                className="fixed inset-0 z-10 overflow-y-auto"
            >
                <div className="flex items-center justify-center min-h-screen">
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

                    <div className="relative bg-white rounded-lg max-w-md mx-auto p-6">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                            Confirm Delete
                        </Dialog.Title>

                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                Are you sure you want to delete this education entry? This action cannot be undone.
                            </p>
                        </div>

                        <div className="mt-4 flex justify-end space-x-4">
                            <button
                                type="button"
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                onClick={() => setIsDeleteModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                                onClick={handleDeleteConfirm}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}