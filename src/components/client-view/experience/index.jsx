'use client'

import { useEffect, useState } from 'react'
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from "@mui/lab";
import AnimationWrapper from "../animation-wrapper";
import { motion } from "framer-motion";
import { getData } from "@/services"

function EmptyState({ title }) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600">No entries available yet.</p>
        </div>
    );
}

export default function ClientExperienceAndEducationView() {
    const [experienceData, setExperienceData] = useState([])
    const [educationData, setEducationData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const [experienceRes, educationRes] = await Promise.all([
                    getData('experience'),
                    getData('education')
                ])

                console.log('Experience data:', experienceRes)
                console.log('Education data:', educationRes)

                if (experienceRes.success) {
                    setExperienceData(experienceRes.data)
                }
                if (educationRes.success) {
                    setEducationData(educationRes.data)
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-main"></div>
            </div>
        )
    }

    return (
        <div className="max-w-screen-xl mt-24 mb-6 sm:mt-14 sm:mb-14 px-6 sm:px-8 lg:px-16 mx-auto" id="experience">
            <div className="grid grid-flow-row sm:grid-flow-col grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Experience Section */}
                <div className="flex flex-col gap-5">
                    <AnimationWrapper className={"py-6 sm:py-16"}>
                        <div className="flex flex-col justify-center items-center">
                            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                                <span className="text-[#000]">My </span>
                                <span className="text-green-main">Experience</span>
                            </h1>
                        </div>
                    </AnimationWrapper>

                    <AnimationWrapper>
                        <div className="flex w-full">
                            <motion.div 
                                className="container"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                {experienceData && experienceData.length > 0 ? (
                                    <Timeline position="right">
                                        {experienceData.map((experienceItem, index) => (
                                            <TimelineItem key={index}>
                                                <TimelineSeparator>
                                                    <TimelineDot className="bg-green-main" />
                                                    <TimelineConnector className="bg-green-main" />
                                                </TimelineSeparator>
                                                <TimelineContent>
                                                    <motion.div 
                                                        className="border-2 p-6 rounded-lg border-green-main mt-3 ml-4 hover:shadow-lg transition-shadow duration-300"
                                                        whileHover={{ scale: 1.02 }}
                                                        transition={{ type: "spring", stiffness: 300 }}
                                                    >
                                                        <p className="text-gray-600 text-sm">{experienceItem.duration}</p>
                                                        <h3 className="font-bold text-xl mt-2 text-gray-800">
                                                            {experienceItem.position}
                                                        </h3>
                                                        <p className="font-medium text-gray-700 mt-1">
                                                            {experienceItem.company}, {experienceItem.location}
                                                        </p>
                                                        <p className="mt-4 text-gray-600 whitespace-pre-line">
                                                            {experienceItem.jobprofile}
                                                        </p>
                                                    </motion.div>
                                                </TimelineContent>
                                            </TimelineItem>
                                        ))}
                                    </Timeline>
                                ) : (
                                    <EmptyState title="Experience" />
                                )}
                            </motion.div>
                        </div>
                    </AnimationWrapper>
                </div>

                {/* Education Section */}
                <div className="flex flex-col gap-5">
                    <AnimationWrapper className={"py-6 sm:py-16"}>
                        <div className="flex flex-col justify-center items-center">
                            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                                <span className="text-[#000]">My </span>
                                <span className="text-green-main">Education</span>
                            </h1>
                        </div>
                    </AnimationWrapper>

                    <AnimationWrapper>
                        <div className="flex w-full">
                            <motion.div 
                                className="container"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                {educationData && educationData.length > 0 ? (
                                    <Timeline position="right">
                                        {educationData.map((educationItem, index) => (
                                            <TimelineItem key={index}>
                                                <TimelineSeparator>
                                                    <TimelineDot className="bg-green-main" />
                                                    <TimelineConnector className="bg-green-main" />
                                                </TimelineSeparator>
                                                <TimelineContent>
                                                    <motion.div 
                                                        className="border-2 p-6 rounded-lg border-green-main mt-3 ml-4 hover:shadow-lg transition-shadow duration-300"
                                                        whileHover={{ scale: 1.02 }}
                                                        transition={{ type: "spring", stiffness: 300 }}
                                                    >
                                                        <p className="text-gray-600 text-sm">Year: {educationItem.year}</p>
                                                        <h3 className="font-bold text-xl mt-2 text-gray-800">
                                                            {educationItem.degree}
                                                        </h3>
                                                        <p className="font-medium text-gray-700 mt-1">
                                                            {educationItem.college}
                                                        </p>
                                                    </motion.div>
                                                </TimelineContent>
                                            </TimelineItem>
                                        ))}
                                    </Timeline>
                                ) : (
                                    <EmptyState title="Education" />
                                )}
                            </motion.div>
                        </div>
                    </AnimationWrapper>
                </div>
            </div>
        </div>
    );
}