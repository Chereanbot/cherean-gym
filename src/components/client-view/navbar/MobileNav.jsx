import React from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Link as ScrollLink } from 'react-scroll';
import { FaHome, FaUser, FaCode, FaBriefcase, FaProjectDiagram, FaBlog, FaEnvelope } from 'react-icons/fa';

const MobileNav = () => {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Home', icon: <FaHome className="w-5 h-5" />, link: 'home', path: '/' },
        { name: 'About', icon: <FaUser className="w-5 h-5" />, link: 'about', path: '/about' },
        { name: 'Services', icon: <FaCode className="w-5 h-5" />, link: 'services', path: '/services' },
        { name: 'Projects', icon: <FaProjectDiagram className="w-5 h-5" />, link: 'project', path: '/projects' },
        { name: 'Experience', icon: <FaBriefcase className="w-5 h-5" />, link: 'experience', path: '/experience' },
        { name: 'Blog', icon: <FaBlog className="w-5 h-5" />, link: 'blog', path: '/blog' },
        { name: 'Contact', icon: <FaEnvelope className="w-5 h-5" />, link: 'contact', path: '/contact' }
    ];

    return (
        <motion.nav 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 right-0 md:hidden z-50"
        >
            {/* Backdrop blur and gradient background */}
            <div className="absolute inset-0 bg-white/30 backdrop-blur-lg"></div>
            
            {/* Glass effect border */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            
            <div className="relative px-4 py-3">
                <div className="flex justify-around items-center">
                    {menuItems.map((item, index) => {
                        const isActive = pathname === item.path || 
                            (pathname === '/' && item.path === '/');

                        return pathname === '/' && item.path === '/' ? (
                            <ScrollLink
                                key={index}
                                to={item.link}
                                spy={true}
                                smooth={true}
                                offset={-100}
                                duration={500}
                                className="flex flex-col items-center relative group"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="relative"
                                >
                                    <div className={`p-2 rounded-xl transition-all duration-300 ${
                                        isActive 
                                            ? 'bg-green-main text-white shadow-lg shadow-green-main/50' 
                                            : 'text-gray-600 hover:text-green-main'
                                    }`}>
                                        {item.icon}
                                    </div>
                                    <span className={`text-xs mt-1 block text-center transition-colors duration-300 ${
                                        isActive ? 'text-green-main font-medium' : 'text-gray-500'
                                    }`}>
                                        {item.name}
                                    </span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute -inset-1 bg-green-main/10 rounded-xl -z-10"
                                        />
                                    )}
                                </motion.div>
                            </ScrollLink>
                        ) : (
                            <Link
                                key={index}
                                href={item.path}
                                className="flex flex-col items-center relative group"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="relative"
                                >
                                    <div className={`p-2 rounded-xl transition-all duration-300 ${
                                        isActive 
                                            ? 'bg-green-main text-white shadow-lg shadow-green-main/50' 
                                            : 'text-gray-600 hover:text-green-main'
                                    }`}>
                                        {item.icon}
                                    </div>
                                    <span className={`text-xs mt-1 block text-center transition-colors duration-300 ${
                                        isActive ? 'text-green-main font-medium' : 'text-gray-500'
                                    }`}>
                                        {item.name}
                                    </span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute -inset-1 bg-green-main/10 rounded-xl -z-10"
                                        />
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </motion.nav>
    );
};

export default MobileNav; 