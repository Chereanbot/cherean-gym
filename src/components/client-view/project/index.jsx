'use client'

import { useRef, useState, useEffect } from "react";
import AnimationWrapper from "../animation-wrapper";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaGithub, FaGlobe, FaPlay, FaTimes, FaChevronLeft, FaChevronRight, FaSearch, FaFilter, FaSortAmountDown, FaBook, FaVideo, FaPen, FaCode, FaLinkedin } from 'react-icons/fa';

const getImageUrl = (url) => {
    if (!url) {
        console.log('No URL provided');
        return null;
    }
    
    // If url is an object (from MongoDB), convert it to string
    if (typeof url === 'object') {
        // If it's a screenshot object with url property
        if (url.url) {
            url = url.url;
        } else {
            // If it's the character object we're seeing in the error
            // Join all numeric properties to form the URL string
            const chars = Object.entries(url)
                .filter(([key]) => !isNaN(key))
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([_, value]) => value)
                .join('');
            url = chars;
        }
    }
    
    // Now url should be a string
    if (typeof url !== 'string') {
        console.log('Invalid URL after processing:', url);
        return null;
    }
    
    // If it's already a complete URL (including Cloudinary URLs)
    if (url.startsWith('http')) {
        console.log('Complete URL:', url);
        return url;
    }
    
    // If it's a Cloudinary public ID or partial path
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (cloudName) {
        const cloudinaryUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${url}`;
        console.log('Constructed Cloudinary URL:', cloudinaryUrl);
        return cloudinaryUrl;
    }
    
    // Fallback to local URL if not a Cloudinary image
    const localUrl = `${process.env.NEXT_PUBLIC_API_URL || ''}${url}`;
    console.log('Fallback local URL:', localUrl);
    return localUrl;
};

function ProjectModal({ project, onClose }) {
    const modalRef = useRef(null);
    const [activeScreenshot, setActiveScreenshot] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [currentSection, setCurrentSection] = useState('overview');
    const [touchStart, setTouchStart] = useState(null);
    const [isZoomed, setIsZoomed] = useState(false);

    const sections = [
        { id: 'overview', label: 'Overview' },
        { id: 'features', label: 'Features', show: project.features?.length > 0 },
        { id: 'technical', label: 'Technical Details', show: project.techStack || project.technicalHighlights?.length > 0 },
        { id: 'challenges', label: 'Challenges', show: project.challengesFaced?.length > 0 },
        { id: 'performance', label: 'Performance', show: project.performance?.lighthouse },
        { id: 'team', label: 'Team & Timeline', show: project.collaborators?.length > 0 || project.timeline?.length > 0 },
        { id: 'testimonials', label: 'Testimonials', show: project.testimonials?.length > 0 },
        { id: 'resources', label: 'Resources', show: project.resources?.length > 0 }
    ].filter(section => section.show !== false);

    const nextScreenshot = () => {
        if (project.screenshots?.length > 0) {
            setActiveScreenshot((prev) => (prev + 1) % project.screenshots.length);
        }
    };

    const prevScreenshot = () => {
        if (project.screenshots?.length > 0) {
            setActiveScreenshot((prev) => (prev - 1 + project.screenshots.length) % project.screenshots.length);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') nextScreenshot();
            if (e.key === 'ArrowLeft') prevScreenshot();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [project.screenshots]);

    // Add touch support for mobile users
    const handleTouchStart = (e) => {
        setTouchStart(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
        if (!touchStart) return;
        
        const touchEnd = e.touches[0].clientX;
        const diff = touchStart - touchEnd;

        if (Math.abs(diff) > 50) { // minimum swipe distance
            if (diff > 0) {
                nextScreenshot();
            } else {
                prevScreenshot();
            }
            setTouchStart(null);
        }
    };

    const handleTouchEnd = () => {
        setTouchStart(null);
    };

    // Preload next and previous images
    useEffect(() => {
        if (project.screenshots?.length > 1) {
            const nextIndex = (activeScreenshot + 1) % project.screenshots.length;
            const prevIndex = (activeScreenshot - 1 + project.screenshots.length) % project.screenshots.length;
            
            [nextIndex, prevIndex].forEach(index => {
                const imgUrl = getImageUrl(project.screenshots[index]);
                if (imgUrl) {
                    const preloadLink = document.createElement('link');
                    preloadLink.rel = 'preload';
                    preloadLink.as = 'image';
                    preloadLink.href = imgUrl;
                    document.head.appendChild(preloadLink);
                    
                    return () => {
                        document.head.removeChild(preloadLink);
                    };
                }
            });
        }
    }, [activeScreenshot, project.screenshots]);

    // Announce screenshot changes to screen readers
    useEffect(() => {
        const announcement = `Viewing image ${activeScreenshot + 1} of ${project.screenshots?.length}`;
        const ariaLive = document.createElement('div');
        ariaLive.setAttribute('aria-live', 'polite');
        ariaLive.setAttribute('class', 'sr-only');
        ariaLive.textContent = announcement;
        document.body.appendChild(ariaLive);
        
        return () => document.body.removeChild(ariaLive);
    }, [activeScreenshot, project.screenshots]);

    const renderSection = () => {
        switch (currentSection) {
            case 'overview':
                return (
                    <section className="mb-8">
                        <h3 className="text-2xl font-bold text-white mb-4">About the Project</h3>
                        <p className="text-gray-300 whitespace-pre-line leading-relaxed text-lg mb-6">{project.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {project.targetAudience && (
                                <div className="bg-white/10 p-4 rounded-xl">
                                    <h4 className="font-bold text-white mb-2">Target Audience</h4>
                                    <p className="text-gray-300">{project.targetAudience}</p>
                                </div>
                            )}
                            {project.businessImpact && (
                                <div className="bg-white/10 p-4 rounded-xl">
                                    <h4 className="font-bold text-white mb-2">Business Impact</h4>
                                    <p className="text-gray-300">{project.businessImpact}</p>
                                </div>
                            )}
                        </div>

                        {project.deploymentDetails && (
                            <div className="bg-white/10 p-4 rounded-xl mb-6">
                                <h4 className="font-bold text-white mb-2">Deployment Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {project.deploymentDetails.hosting && (
                                        <div>
                                            <span className="text-gray-400">Hosting:</span>
                                            <p className="text-gray-300">{project.deploymentDetails.hosting}</p>
                                        </div>
                                    )}
                                    {project.deploymentDetails.infrastructure && (
                                        <div>
                                            <span className="text-gray-400">Infrastructure:</span>
                                            <p className="text-gray-300">{project.deploymentDetails.infrastructure}</p>
                                        </div>
                                    )}
                                    {project.deploymentDetails.cicd && (
                                        <div>
                                            <span className="text-gray-400">CI/CD:</span>
                                            <p className="text-gray-300">{project.deploymentDetails.cicd}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {project.metrics && (
                            <div className="bg-white/10 p-4 rounded-xl">
                                <h4 className="font-bold text-white mb-2">Project Metrics</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {project.metrics.performance && (
                                        <div>
                                            <span className="text-gray-400">Performance:</span>
                                            <p className="text-gray-300">{project.metrics.performance}</p>
                                        </div>
                                    )}
                                    {project.metrics.scalability && (
                                        <div>
                                            <span className="text-gray-400">Scalability:</span>
                                            <p className="text-gray-300">{project.metrics.scalability}</p>
                                        </div>
                                    )}
                                    {project.metrics.userBase && (
                                        <div>
                                            <span className="text-gray-400">User Base:</span>
                                            <p className="text-gray-300">{project.metrics.userBase}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </section>
                );

            case 'technical':
                return (
                    <section className="mb-8">
                        <h3 className="text-2xl font-bold text-white mb-6">Technical Details</h3>
                        
                        {project.techStack && (
                            <div className="mb-8">
                                <h4 className="text-xl font-bold text-white mb-4">Tech Stack</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Object.entries(project.techStack).map(([category, technologies]) => 
                                        technologies?.length > 0 && (
                                            <div key={category} className="bg-white/10 p-4 rounded-xl">
                                                <h5 className="font-bold text-white capitalize mb-2">{category}</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {technologies.map((tech, index) => (
                                                        <span key={index} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                        {project.technicalHighlights?.length > 0 && (
                            <div className="mb-8">
                                <h4 className="text-xl font-bold text-white mb-4">Technical Highlights</h4>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {project.technicalHighlights.map((highlight, index) => (
                                        <motion.li
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            className="flex items-start gap-4 bg-white/10 p-4 rounded-xl"
                                        >
                                            <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 text-white rounded-lg flex items-center justify-center font-bold">
                                                {index + 1}
                                            </span>
                                            <span className="text-gray-200">{highlight}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {project.futureEnhancements?.length > 0 && (
                            <div>
                                <h4 className="text-xl font-bold text-white mb-4">Future Enhancements</h4>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {project.futureEnhancements.map((enhancement, index) => (
                                        <motion.li
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            className="flex items-start gap-4 bg-white/10 p-4 rounded-xl"
                                        >
                                            <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 text-white rounded-lg flex items-center justify-center font-bold">
                                                {index + 1}
                                            </span>
                                            <span className="text-gray-200">{enhancement}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </section>
                );

            case 'performance':
                return (
                    <section className="mb-8">
                        <h3 className="text-2xl font-bold text-white mb-6">Performance Metrics</h3>
                        
                        {project.performance?.lighthouse && (
                            <div className="mb-8">
                                <h4 className="text-xl font-bold text-white mb-4">Lighthouse Scores</h4>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {Object.entries(project.performance.lighthouse).map(([metric, score]) => (
                                        <div key={metric} className="bg-white/10 p-4 rounded-xl text-center">
                                            <div className="w-16 h-16 mx-auto mb-2 rounded-full border-4 border-gray-700 flex items-center justify-center">
                                                <span className="text-2xl font-bold" style={{
                                                    color: score >= 90 ? '#22c55e' : score >= 50 ? '#eab308' : '#ef4444'
                                                }}>{score}</span>
                                            </div>
                                            <h5 className="font-bold text-white capitalize">{metric}</h5>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {project.performance?.loadTime && (
                                <div className="bg-white/10 p-4 rounded-xl">
                                    <h5 className="font-bold text-white mb-2">Load Time</h5>
                                    <p className="text-gray-300">{project.performance.loadTime}</p>
                                </div>
                            )}
                            {project.performance?.apiLatency && (
                                <div className="bg-white/10 p-4 rounded-xl">
                                    <h5 className="font-bold text-white mb-2">API Latency</h5>
                                    <p className="text-gray-300">{project.performance.apiLatency}</p>
                                </div>
                            )}
                            {project.performance?.uptime && (
                                <div className="bg-white/10 p-4 rounded-xl">
                                    <h5 className="font-bold text-white mb-2">Uptime</h5>
                                    <p className="text-gray-300">{project.performance.uptime}</p>
                                </div>
                            )}
                        </div>
                    </section>
                );

            case 'team':
                return (
                    <section className="mb-8">
                        <h3 className="text-2xl font-bold text-white mb-6">Team & Timeline</h3>
                        
                        {project.collaborators?.length > 0 && (
                            <div className="mb-8">
                                <h4 className="text-xl font-bold text-white mb-4">Team Members</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {project.collaborators.map((member, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            className="bg-white/10 p-4 rounded-xl"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h5 className="font-bold text-white">{member.name}</h5>
                                                    <p className="text-gray-400">{member.role}</p>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex gap-3">
                                                {member.github && (
                                                    <a href={member.github} target="_blank" rel="noopener noreferrer" 
                                                       className="text-gray-400 hover:text-white transition-colors">
                                                        <FaGithub size={20} />
                                                    </a>
                                                )}
                                                {member.linkedin && (
                                                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                                                       className="text-gray-400 hover:text-white transition-colors">
                                                        <FaLinkedin size={20} />
                                                    </a>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {project.timeline?.length > 0 && (
                            <div>
                                <h4 className="text-xl font-bold text-white mb-4">Project Timeline</h4>
                                <div className="relative">
                                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-700"></div>
                                    <div className="space-y-8">
                                        {project.timeline.map((event, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                                className="relative pl-10"
                                            >
                                                <div className="absolute left-0 w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                                                    <div className="w-3 h-3 bg-white rounded-full"></div>
                                                </div>
                                                <div className="bg-white/10 p-4 rounded-xl">
                                                    <time className="text-sm text-gray-400">
                                                        {new Date(event.date).toLocaleDateString()}
                                                    </time>
                                                    <h5 className="font-bold text-white mt-1">{event.milestone}</h5>
                                                    <p className="text-gray-300 mt-2">{event.description}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                );

            case 'resources':
                return (
                    <section className="mb-8">
                        <h3 className="text-2xl font-bold text-white mb-6">Project Resources</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {project.resources.map((resource, index) => (
                                <motion.a
                                    key={index}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="bg-white/10 p-6 rounded-xl hover:bg-white/20 transition-colors group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-red-500 rounded-xl flex items-center justify-center text-white">
                                            {resource.type === 'Documentation' && <FaBook size={24} />}
                                            {resource.type === 'Tutorial' && <FaVideo size={24} />}
                                            {resource.type === 'Blog Post' && <FaPen size={24} />}
                                            {resource.type === 'Video' && <FaPlay size={24} />}
                                            {resource.type === 'Code Sample' && <FaCode size={24} />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">
                                                {resource.title}
                                            </h4>
                                            <p className="text-gray-400 text-sm mt-1">{resource.type}</p>
                                            <p className="text-gray-300 mt-2">{resource.description}</p>
                                        </div>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </section>
                );

            case 'features':
                return (
                    <section className="mb-8">
                        <h3 className="text-2xl font-bold text-white mb-6">Key Features</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {project.features.map((feature, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="flex items-start gap-4 bg-white/10 p-4 rounded-xl hover:bg-white/20 transition-colors"
                                >
                                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 text-white rounded-lg flex items-center justify-center font-bold">
                                        {index + 1}
                                    </span>
                                    <span className="text-gray-200">{feature}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </section>
                );
            case 'challenges':
                return (
                    <section className="mb-8">
                        <h3 className="text-2xl font-bold text-white mb-6">Challenges & Solutions</h3>
                        <div className="space-y-6">
                            {project.challengesFaced?.map((challenge, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="bg-white/10 rounded-xl p-6 hover:bg-white/20 transition-colors"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-400 to-pink-500 text-white rounded-xl flex items-center justify-center">
                                            <span className="font-bold">{index + 1}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white mb-2">Challenge</h4>
                                            <p className="text-gray-300 mb-4">{challenge}</p>
                                            {project.solutions?.[index] && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="mt-4 pl-4 border-l-2 border-green-400"
                                                >
                                                    <h4 className="font-bold text-white mb-2">Solution</h4>
                                                    <p className="text-gray-300">{project.solutions[index]}</p>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                );
            case 'testimonials':
                return (
                    <section className="mb-8">
                        <h3 className="text-2xl font-bold text-white mb-6">Client Testimonials</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            {project.testimonials.map((testimonial, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="bg-white/10 rounded-xl p-6 hover:bg-white/20 transition-colors"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold">
                                            {testimonial.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-gray-300 italic mb-4">{testimonial.comment}</p>
                                            <div>
                                                <p className="font-bold text-white">{testimonial.name}</p>
                                                <p className="text-gray-400">{testimonial.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                );
            default:
                return null;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
        >
            <motion.div
                ref={modalRef}
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl focus:outline-none"
                tabIndex="-1"
            >
                <div className="p-8">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 id="project-modal-title" className="text-4xl font-black bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
                                {project.name}
                            </h2>
                            <p className="text-gray-300 text-lg">{project.shortDescription}</p>
                            <div className="flex items-center gap-3 mt-4">
                                <span className={`px-4 py-1.5 text-sm font-bold rounded-full ${
                                    project.status === 'Completed' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                                    project.status === 'In Progress' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                                    'bg-gradient-to-r from-blue-400 to-blue-600'
                                }`}>
                                    {project.status}
                                </span>
                                <span className="text-gray-400">{project.category}</span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors focus:ring-2 focus:ring-green-400 focus:outline-none"
                            aria-label="Close project details"
                        >
                            <FaTimes className="w-6 h-6 text-gray-400" />
                        </button>
                    </div>

                    {/* Screenshots Carousel with touch support */}
                    {project.screenshots && project.screenshots.length > 0 && (
                        <div className="mb-8">
                            <div 
                                className="relative h-[500px] mb-4 rounded-xl overflow-hidden group"
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                            >
                                {project.screenshots[activeScreenshot] && getImageUrl(project.screenshots[activeScreenshot]) ? (
                                    <Image
                                        src={getImageUrl(project.screenshots[activeScreenshot])}
                                        alt={`${project.name} screenshot ${activeScreenshot + 1}`}
                                        fill
                                        className={`object-contain transition-transform duration-300 ${isZoomed ? 'scale-150' : ''}`}
                                        onLoadingComplete={() => setIsLoading(false)}
                                        onClick={() => setIsZoomed(!isZoomed)}
                                        role="img"
                                        aria-label={`Project screenshot ${activeScreenshot + 1} of ${project.screenshots.length}. Click to ${isZoomed ? 'zoom out' : 'zoom in'}.`}
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-green-400 to-emerald-500">
                                        <span className="text-6xl font-bold text-white">
                                            {project.name.charAt(0)}
                                        </span>
                                    </div>
                                )}
                                {isLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-400 border-t-transparent"></div>
                                    </div>
                                )}
                                {project.screenshots.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevScreenshot}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                                            aria-label="Previous screenshot"
                                        >
                                            <FaChevronLeft className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={nextScreenshot}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                                            aria-label="Next screenshot"
                                        >
                                            <FaChevronRight className="w-6 h-6" />
                                        </button>
                                    </>
                                )}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium">
                                    {activeScreenshot + 1} / {project.screenshots.length}
                                </div>
                            </div>
                            {project.screenshots.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                    {project.screenshots.map((screenshot, index) => {
                                        const imgUrl = getImageUrl(screenshot);
                                        return imgUrl ? (
                                            <button
                                                key={index}
                                                onClick={() => setActiveScreenshot(index)}
                                                className={`relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 transition-all ${
                                                    activeScreenshot === index 
                                                        ? 'ring-2 ring-green-400 scale-95' 
                                                        : 'hover:ring-2 hover:ring-gray-300'
                                                }`}
                                            >
                                                <Image
                                                    src={imgUrl}
                                                    alt={`Thumbnail ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </button>
                                        ) : null;
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Navigation Tabs */}
                    <div className="mb-8 border-b border-white/10">
                        <div className="flex gap-6 -mb-px">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setCurrentSection(section.id)}
                                    className={`pb-4 px-4 font-bold transition-colors relative ${
                                        currentSection === section.id
                                            ? 'text-green-400 border-b-2 border-green-400'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    {section.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                            {renderSection()}
                        </div>

                        <div>
                            <div className="bg-white/5 rounded-xl p-6 sticky top-6">
                                <h3 className="text-xl font-bold text-white mb-4">Project Details</h3>
                                <dl className="space-y-4">
                                    <div>
                                        <dt className="text-gray-400 mb-2">Technologies Used</dt>
                                        <dd className="flex flex-wrap gap-2">
                                            {project.technologies.split(',').map((tech, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 text-sm font-medium bg-gradient-to-r from-green-400/10 to-blue-500/10 border border-green-400/20 text-green-400 rounded-lg"
                                                >
                                                    {tech.trim()}
                                                </span>
                                            ))}
                                        </dd>
                                    </div>
                                    {project.duration && (
                                        <div>
                                            <dt className="text-gray-400 mb-1">Project Duration</dt>
                                            <dd className="font-medium text-white">{project.duration}</dd>
                                        </div>
                                    )}
                                    {project.role && (
                                        <div>
                                            <dt className="text-gray-400 mb-1">My Role</dt>
                                            <dd className="font-medium text-white">{project.role}</dd>
                                        </div>
                                    )}
                                    {project.teamSize && (
                                        <div>
                                            <dt className="text-gray-400 mb-1">Team Size</dt>
                                            <dd className="font-medium text-white">{project.teamSize} members</dd>
                                        </div>
                                    )}
                                </dl>

                                <div className="mt-6 space-y-3">
                                    {project.website && (
                                        <a
                                            href={project.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl font-bold hover:from-green-500 hover:to-blue-600 transition-all hover:scale-[1.02]"
                                        >
                                            <FaGlobe className="w-5 h-5" />
                                            Visit Website
                                        </a>
                                    )}
                                    {project.github && (
                                        <a
                                            href={project.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all hover:scale-[1.02]"
                                        >
                                            <FaGithub className="w-5 h-5" />
                                            View Source Code
                                        </a>
                                    )}
                                    {project.demoVideo && (
                                        <a
                                            href={project.demoVideo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-xl font-bold hover:from-red-500 hover:to-pink-600 transition-all hover:scale-[1.02]"
                                        >
                                            <FaPlay className="w-5 h-5" />
                                            Watch Demo
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

// Add ProjectSkeleton component
function ProjectSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl overflow-hidden shadow-xl h-full flex flex-col">
                {/* Image skeleton */}
                <div className="relative h-48 md:h-56 lg:h-64 bg-gradient-to-r from-emerald-100 to-emerald-200">
                    <div className="absolute inset-0 bg-shimmer"></div>
                </div>
                
                {/* Content skeleton */}
                <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                        {/* Title skeleton */}
                        <div className="h-6 w-32 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-lg"></div>
                        {/* Status badge skeleton */}
                        <div className="h-5 w-20 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-full"></div>
                    </div>
                    
                    {/* Description skeleton */}
                    <div className="space-y-2 mb-4 flex-1">
                        <div className="h-4 w-full bg-gradient-to-r from-emerald-100 to-emerald-200 rounded"></div>
                        <div className="h-4 w-3/4 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded"></div>
                    </div>
                    
                    {/* Technologies skeleton */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-6 w-16 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-full"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Add shimmer animation styles at the top of the file after imports
const shimmerAnimation = `
@keyframes shimmer {
    0% {
        background-position: -1000px 0;
    }
    100% {
        background-position: 1000px 0;
    }
}

.bg-shimmer {
    animation: shimmer 2s infinite linear;
    background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%);
    background-size: 1000px 100%;
}
`;

// Add style tag to head
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = shimmerAnimation;
    document.head.appendChild(style);
}

export default function ClientProjectView({data}) {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll();
    const router = useRouter();
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('newest');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading state
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1000);
    }, [filter, searchQuery, sortBy]);

    const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
    const opacityProgress = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

    const sortProjects = (projects) => {
        if (!projects) return [];
        return [...projects].sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'name':
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });
    };

    const filteredProjects = sortProjects(data?.filter(project => {
        const matchesFilter = filter === 'all' || project.status === filter;
        const matchesSearch = searchQuery === '' || 
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.technologies.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    }));

    const categories = [...new Set(data?.map(project => project.category) || [])];

    return (
        <>
            <AnimationWrapper>
                <div ref={containerRef} className="min-h-screen py-12 bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="container mx-auto px-4">
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-spring-green to-emerald-400 mb-4">
                                My Projects
                            </h2>
                            <p className="text-emerald-600 max-w-2xl mx-auto text-lg font-medium">
                                Explore my portfolio of projects, showcasing my skills in web development,
                                problem-solving, and creating user-friendly applications.
                            </p>
                        </motion.div>

                        {/* Enhanced Search and Filter Section */}
                        <div className="mb-12">
                            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                                <div className="relative w-full md:w-96">
                                    <input
                                        type="text"
                                        placeholder="Search projects..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full px-4 py-3 pl-10 bg-white/80 backdrop-blur-sm rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-green-400/20 shadow-sm text-emerald-800 placeholder-emerald-400"
                                    />
                                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                                </div>
                                <div className="flex gap-3">
                                    <div className="relative">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="appearance-none px-6 py-3 pr-10 bg-white/80 backdrop-blur-sm rounded-xl text-emerald-600 border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-green-400/20 shadow-sm cursor-pointer"
                                        >
                                            <option value="newest">Newest First</option>
                                            <option value="oldest">Oldest First</option>
                                            <option value="name">Name</option>
                                        </select>
                                        <FaSortAmountDown className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none" />
                                </div>
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                        className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-xl text-emerald-600 hover:text-emerald-800 hover:bg-white transition-colors shadow-sm border border-emerald-200"
                                >
                                    <FaFilter />
                                        Filters {showFilters ? '▼' : '▲'}
                                </button>
                                </div>
                            </div>

                            <AnimatePresence>
                            {showFilters && (
                    <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="mt-6 overflow-hidden"
                                >
                                    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                                        <h3 className="font-bold text-emerald-700 mb-4">Status</h3>
                                        <div className="flex flex-wrap gap-3">
                                            <button
                                                onClick={() => setFilter('all')}
                                                className={`px-6 py-2 rounded-xl font-medium transition-all ${
                                                    filter === 'all'
                                                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md scale-105'
                                                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                                }`}
                                            >
                                                All Projects
                                            </button>
                                            <button
                                                onClick={() => setFilter('Completed')}
                                                className={`px-6 py-2 rounded-xl font-medium transition-all ${
                                                    filter === 'Completed'
                                                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md scale-105'
                                                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                                }`}
                                            >
                                                Completed
                                            </button>
                            <button 
                                                onClick={() => setFilter('In Progress')}
                                                className={`px-6 py-2 rounded-xl font-medium transition-all ${
                                                    filter === 'In Progress'
                                                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md scale-105'
                                                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                                }`}
                                            >
                                                In Progress
                            </button>
                                        </div>

                                        {categories.length > 0 && (
                                            <>
                                                <h3 className="font-bold text-emerald-700 mb-4 mt-6">Categories</h3>
                                                <div className="flex flex-wrap gap-3">
                                                    {categories.map((category) => (
                                                        <button
                                                            key={category}
                                                            onClick={() => setFilter(category)}
                                                            className={`px-6 py-2 rounded-xl font-medium transition-all ${
                                                                filter === category
                                                                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md scale-105'
                                                                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                                            }`}
                                                        >
                                                            {category}
                                                        </button>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                    </motion.div>
                            )}
                            </AnimatePresence>
                </div>

                        {/* Projects Grid with Loading State */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {isLoading ? (
                                // Show skeletons while loading in a grid
                                <>
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <ProjectSkeleton key={index} />
                                    ))}
                                </>
                            ) : filteredProjects?.length > 0 ? (
                                filteredProjects.map((project, index) => (
                                    <motion.div
                                    key={project._id}
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    transition={{ 
                                            duration: 0.5,
                                            delay: index * 0.1,
                                        type: "spring",
                                        stiffness: 100
                                    }}
                                        whileHover={{ y: -10 }}
                                        className="group h-full"
                                >
                                    <div
                                            className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 h-full flex flex-col"
                                        onMouseEnter={() => setHoveredIndex(index)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                        onClick={() => setSelectedProject(project)}
                                    >
                                            <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden">
                                            {project.screenshots && project.screenshots[0] && getImageUrl(project.screenshots[0]) ? (
                                                    <Image
                                                    src={getImageUrl(project.screenshots[0])}
                                                    alt={project.name}
                                                        fill
                                                        className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                ) : (
                                                <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                                                        <span className="text-6xl font-bold text-white">
                                                        {project.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-800/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                                <motion.button 
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                        className="px-6 py-2.5 bg-white text-emerald-600 rounded-full font-bold text-sm transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-500 hover:shadow-lg"
                                                >
                                                        View Details
                                                </motion.button>
                                            </div>
                                        </div>
                                            <div className="p-6 flex-1 flex flex-col">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3 className="text-xl font-bold text-emerald-800 line-clamp-1">
                                                    {project.name}
                                                </h3>
                                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                                    project.status === 'Completed' ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' :
                                                    project.status === 'In Progress' ? 'bg-gradient-to-r from-yellow-400 to-emerald-500 text-white' :
                                                    'bg-gradient-to-r from-emerald-400 to-emerald-600 text-white'
                                                    }`}>
                                                    {project.status}
                                                    </span>
                                                </div>
                                                <p className="text-emerald-600 text-sm mb-4 line-clamp-2 flex-1">
                                                    {project.shortDescription}
                                                </p>
                                                <div className="flex flex-wrap gap-2 mt-auto">
                                                    {project.technologies.split(',').slice(0, 3).map((tech, index) => (
                                                    <span
                                                        key={index}
                                                            className="px-2.5 py-1 text-xs font-medium bg-gradient-to-r from-green-50 to-emerald-50 text-emerald-700 rounded-full border border-emerald-200"
                                                        >
                                                            {tech.trim()}
                                                    </span>
                                                ))}
                                                    {project.technologies.split(',').length > 3 && (
                                                        <span className="px-2.5 py-1 text-xs font-medium text-emerald-600">
                                                            +{project.technologies.split(',').length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-12"
                                >
                                    <div className="text-6xl mb-4">🔍</div>
                                    <h3 className="text-2xl font-bold text-emerald-800 mb-2">No Projects Found</h3>
                                    <p className="text-emerald-600">Try adjusting your search or filters</p>
                                </motion.div>
                            )}
                        </div>
                            </div>
                        </div>
                    </AnimationWrapper>

            <AnimatePresence>
                {selectedProject && (
                    <ProjectModal
                        project={selectedProject}
                        onClose={() => setSelectedProject(null)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}