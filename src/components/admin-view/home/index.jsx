'use client'

import { useState, useEffect } from 'react'
import { Input, TextArea, Select, FileInput } from "../form-controls/index.jsx"

const controls = [
    {
        name: 'heading',
        placeholder: 'Enter heading text',
        type: 'text',
        label: 'Heading',
        value: "Hi, I'm John Doe A Full Stack Developer"
    },
    {
        name: 'summary',
        placeholder: 'Write a brief summary about yourself',
        type: 'textarea',
        label: 'Summary',
        value: "I'm a passionate full-stack developer with expertise in modern web technologies. I love creating efficient, scalable, and user-friendly applications."
    }
]

export default function AdminHomeView({ formData, setFormData, handleSaveData }) {
    // Initialize form data with default values
    useEffect(() => {
        if (!formData || Object.keys(formData).length === 0) {
            const initialData = controls.reduce((acc, control) => {
                acc[control.name] = control.value || '';
                return acc;
            }, {});
            
            setFormData(initialData);
        }
    }, []);

    return (
        <div className="w-full">
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="space-y-6">
                    <FormControls 
                        controls={controls}
                        formData={formData || {}}
                        setFormData={setFormData}
                    />
                </div>

                <div className="mt-6 flex justify-end">
                    <button 
                        onClick={() => handleSaveData('home')}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    )
}