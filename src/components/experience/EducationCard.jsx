import React from 'react';
import { motion } from 'framer-motion';
import { TimelineItem, TimelineSeparator, TimelineConnector, TimelineDot, TimelineContent } from '@mui/lab';

const EducationCard = ({ item, index }) => {
    return (
        <TimelineItem>
            <TimelineSeparator>
                <TimelineDot className="bg-green-main" />
                <TimelineConnector className="bg-green-main" />
            </TimelineSeparator>
            <TimelineContent>
                <motion.div 
                    className="relative border-2 p-6 rounded-lg border-green-main mt-3 ml-4 hover:shadow-xl transition-all duration-300 bg-white"
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2, type: "spring", stiffness: 300 }}
                >
                    <motion.div 
                        className="absolute -top-3 -right-3 bg-green-main text-white px-4 py-1 rounded-full text-sm"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.3 }}
                    >
                        {item.year}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.4 }}
                    >
                        <h3 className="font-bold text-2xl text-gray-800">{item.degree}</h3>
                        <div className="flex items-center gap-2 mt-2">
                            <svg className="w-5 h-5 text-green-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span className="font-medium text-gray-700">{item.college}</span>
                        </div>
                    </motion.div>

                    {item.achievements && (
                        <motion.div 
                            className="mt-4 space-y-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.5 }}
                        >
                            <h4 className="font-semibold text-gray-700">Key Achievements:</h4>
                            <ul className="list-disc list-inside text-gray-600 ml-4 space-y-1">
                                {item.achievements.split(',').map((achievement, idx) => (
                                    <motion.li 
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.5 + idx * 0.1 }}
                                    >
                                        {achievement.trim()}
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    )}
                </motion.div>
            </TimelineContent>
        </TimelineItem>
    );
};

export default React.memo(EducationCard); 