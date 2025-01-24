import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TimelineItem, TimelineSeparator, TimelineConnector, TimelineDot, TimelineContent } from '@mui/lab';

const SkillBadge = React.memo(({ skill }) => (
    <motion.span
        whileHover={{ scale: 1.1 }}
        className="inline-block px-3 py-1 m-1 text-sm font-medium text-green-main bg-green-50 rounded-full border border-green-main"
    >
        {skill}
    </motion.span>
));

const ExperienceCard = ({ item, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <TimelineItem>
            <TimelineSeparator>
                <TimelineDot className="bg-green-main" />
                <TimelineConnector className="bg-green-main" />
            </TimelineSeparator>
            <TimelineContent>
                <motion.div 
                    className="relative border-2 p-6 rounded-lg border-green-main mt-3 ml-4 hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => setIsExpanded(!isExpanded)}
                    layout
                >
                    <motion.div 
                        className="absolute -top-3 -right-3 bg-green-main text-white px-4 py-1 rounded-full text-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        {item.duration}
                    </motion.div>
                    
                    <motion.h3 
                        className="font-bold text-2xl mt-2 text-gray-800"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                    >
                        {item.position}
                    </motion.h3>
                    
                    <motion.div 
                        className="flex items-center gap-2 font-medium text-gray-700 mt-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.3 }}
                    >
                        <svg className="w-5 h-5 text-green-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>{item.company}</span>
                        <span className="text-gray-400">|</span>
                        <svg className="w-5 h-5 text-green-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{item.location}</span>
                    </motion.div>

                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4"
                            >
                                <p className="text-gray-600 whitespace-pre-line mb-4">{item.jobprofile}</p>
                                <div className="mt-4">
                                    {item.skills && item.skills.split(',').map((skill, idx) => (
                                        <SkillBadge key={idx} skill={skill.trim()} />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        className="mt-4 text-green-main hover:text-green-600 focus:outline-none"
                        whileHover={{ scale: 1.05 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                    >
                        {isExpanded ? 'Show Less' : 'Show More'}
                    </motion.button>
                </motion.div>
            </TimelineContent>
        </TimelineItem>
    );
};

export default React.memo(ExperienceCard); 