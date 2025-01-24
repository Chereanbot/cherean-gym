'use client'

import { useEffect, useState } from 'react'
import React from 'react'
import CommonLayout from "@/components/client-view/common-layout"
import { getData } from "@/services"
import AnimationWrapper from "@/components/client-view/animation-wrapper"
import { motion, AnimatePresence } from "framer-motion"
import TimelineWrapper from "@/components/experience/TimelineWrapper"
import ExperienceCard from "@/components/experience/ExperienceCard"
import EducationCard from "@/components/experience/EducationCard"
import ErrorBoundary from "@/components/common/ErrorBoundary"

function EmptyState({ title }) {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg shadow-lg"
        >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600">No entries available yet.</p>
        </motion.div>
    )
}

function Loading() {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <motion.div 
                animate={{ 
                    rotate: 360,
                    scale: [1, 1.2, 1]
                }}
                transition={{ 
                    rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1, repeat: Infinity }
                }}
                className="h-16 w-16 border-t-4 border-b-4 border-green-main rounded-full"
            />
        </div>
    )
}

function SkillBadge({ skill }) {
    return (
        <motion.span
            whileHover={{ scale: 1.1 }}
            className="inline-block px-3 py-1 m-1 text-sm font-medium text-green-main bg-green-50 rounded-full border border-green-main"
        >
            {skill}
        </motion.span>
    )
}

export default function Experience() {
    const [experienceData, setExperienceData] = useState([])
    const [educationData, setEducationData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeTab, setActiveTab] = useState('experience')

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setError(null);
                const [experienceRes, educationRes] = await Promise.all([
                    getData('experience'),
                    getData('education')
                ])

                if (experienceRes.success) {
                    setExperienceData(experienceRes.data)
                } else {
                    throw new Error('Failed to fetch experience data');
                }
                
                if (educationRes.success) {
                    setEducationData(educationRes.data)
                } else {
                    throw new Error('Failed to fetch education data');
                }
            } catch (error) {
                console.error('Error fetching data:', error)
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) return <Loading />
    if (error) return <EmptyState title={error} />

    return (
        <ErrorBoundary fallbackText="Failed to load experience section">
            <main className="min-h-screen bg-gray-50">
                <CommonLayout>
                    <div className="max-w-screen-xl mt-24 mb-6 sm:mt-14 sm:mb-14 px-6 sm:px-8 lg:px-16 mx-auto">
                        <AnimationWrapper className={"py-6 sm:py-16"}>
                            <div className="flex flex-col justify-center items-center mb-10">
                                <motion.h1 
                                    className="text-5xl lg:text-6xl font-bold text-center"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <span className="text-[#000]">My Journey</span>
                                </motion.h1>
                                <motion.div 
                                    className="h-1 w-20 bg-green-main mt-4"
                                    initial={{ width: 0 }}
                                    animate={{ width: 80 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                />
                            </div>

                            <div className="flex justify-center gap-4 mb-8">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`px-6 py-2 rounded-full ${
                                        activeTab === 'experience' 
                                            ? 'bg-green-main text-white' 
                                            : 'bg-gray-200 text-gray-700'
                                    }`}
                                    onClick={() => setActiveTab('experience')}
                                >
                                    Experience
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`px-6 py-2 rounded-full ${
                                        activeTab === 'education' 
                                            ? 'bg-green-main text-white' 
                                            : 'bg-gray-200 text-gray-700'
                                    }`}
                                    onClick={() => setActiveTab('education')}
                                >
                                    Education
                                </motion.button>
                            </div>

                            <AnimatePresence mode="wait">
                                {activeTab === 'experience' ? (
                                    <TimelineWrapper
                                        key="experience"
                                        items={experienceData}
                                        CardComponent={ExperienceCard}
                                        emptyStateTitle="No experience entries found"
                                        animationKey="experience"
                                    />
                                ) : (
                                    <TimelineWrapper
                                        key="education"
                                        items={educationData}
                                        CardComponent={EducationCard}
                                        emptyStateTitle="No education entries found"
                                        animationKey="education"
                                    />
                                )}
                            </AnimatePresence>
                        </AnimationWrapper>
                    </div>
                </CommonLayout>
            </main>
        </ErrorBoundary>
    )
} 