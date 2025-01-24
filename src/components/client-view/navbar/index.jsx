'use client'

import { Link as ScrollLink } from "react-scroll"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import MobileNav from "./MobileNav"

const navVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
}

const menuItemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      type: "spring",
      stiffness: 100
    }
  })
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      setScrolled(offset > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.navbar-menu')) {
        setIsOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isOpen])

  const menuItems = [
    { name: 'Home', link: 'home', path: '/', offset: -100 },
    { name: 'About', link: 'about', path: '/about', offset: -100 },
    { name: 'Services', link: 'services', path: '/services', offset: -100 },
    { name: 'Experience', link: 'experience', path: '/experience', offset: -100 },
    { name: 'Projects', link: 'project', path: '/projects', offset: -100 },
    { name: 'Blog', link: 'blog', path: '/blog', offset: -100 },
    { name: 'Contact', link: 'contact', path: '/contact', offset: -100 }
  ]

  const socialLinks = [
    {
      name: 'GitHub',
      link: 'https://github.com/yourusername',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      link: 'https://linkedin.com/in/yourusername',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      )
    }
  ]

  const handleNavigation = (item) => {
    setIsOpen(false)
    router.push(item.path)
  }

  return (
    <>
      <motion.nav 
        variants={navVariants}
        initial="hidden"
        animate="visible"
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled ? 'glass shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-6 py-4">
          <Link 
            href="/"
            className="flex items-center cursor-pointer group"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <span className="gradient-text text-2xl font-bold animate-gradient bg-300% text-glow">
                Cherinet
              </span>
              <div className="absolute -inset-1 gradient-primary rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            </motion.div>
          </Link>

          <div className="flex md:order-2 space-x-4 items-center">
            {socialLinks.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative group"
              >
                <Link
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 text-gray-700 hover:text-primary-color transition-colors duration-300 p-2 rounded-full hover:bg-primary-color hover:bg-opacity-10 dark:text-gray-300"
                  aria-label={item.name}
                >
                  {item.icon}
                </Link>
                <div className="absolute -inset-1 gradient-primary rounded-full blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
              </motion.div>
            ))}
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                setIsOpen(!isOpen)
              }}
              className="navbar-menu md:hidden relative group inline-flex items-center p-2 w-10 h-10 justify-center text-gray-500 rounded-lg hover:bg-primary-color hover:bg-opacity-10"
              aria-label="Toggle menu"
            >
              <span className="sr-only">Open main menu</span>
              <div className="absolute -inset-1 gradient-primary rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
              <svg className="w-5 h-5 relative z-10" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
              </svg>
            </motion.button>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full md:hidden md:w-auto md:order-1 navbar-menu"
              >
                <ul className="flex flex-col p-4 mt-4 font-medium rounded-xl glass-card">
                  {menuItems.map((item, i) => (
                    <motion.li 
                      key={item.link}
                      custom={i}
                      variants={menuItemVariants}
                      initial="hidden"
                      animate="visible"
                      className="relative group"
                    >
                      {pathname === '/' && item.path === '/' ? (
                        <ScrollLink
                          to={item.link}
                          spy={true}
                          smooth={true}
                          offset={item.offset}
                          duration={500}
                          activeClass="text-primary-color font-bold"
                          onSetActive={() => setActiveSection(item.link)}
                          className={`block py-2 pl-3 pr-4 rounded-lg relative z-10 transition-all duration-300 ${
                            activeSection === item.link 
                              ? 'text-primary-color font-bold' 
                              : 'text-text-primary hover:text-primary-color'
                          } hover:bg-primary-color hover:bg-opacity-10`}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </ScrollLink>
                      ) : (
                        <button
                          onClick={() => handleNavigation(item)}
                          className={`block w-full text-left py-2 pl-3 pr-4 rounded-lg relative z-10 transition-all duration-300 ${
                            pathname === item.path 
                              ? 'text-primary-color font-bold' 
                              : 'text-text-primary hover:text-primary-color'
                          } hover:bg-primary-color hover:bg-opacity-10`}
                        >
                          {item.name}
                        </button>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="hidden md:block md:w-auto md:order-1">
            <ul className="flex flex-row space-x-8">
              {menuItems.map((item, i) => (
                <motion.li 
                  key={item.link}
                  custom={i}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                  className="relative group"
                >
                  {pathname === '/' && item.path === '/' ? (
                    <ScrollLink
                      to={item.link}
                      spy={true}
                      smooth={true}
                      offset={item.offset}
                      duration={500}
                      activeClass="text-primary-color font-bold"
                      onSetActive={() => setActiveSection(item.link)}
                      className={`block py-2 relative group ${
                        activeSection === item.link 
                          ? 'text-primary-color font-bold' 
                          : 'text-text-primary hover:text-primary-color'
                      }`}
                    >
                      <span className="relative z-10">{item.name}</span>
                      <span className="absolute bottom-0 left-0 w-full h-0.5 gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                      <div className="absolute -inset-2 gradient-primary rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-500 -z-10"></div>
                    </ScrollLink>
                  ) : (
                    <button
                      onClick={() => handleNavigation(item)}
                      className={`block py-2 relative group ${
                        pathname === item.path 
                          ? 'text-primary-color font-bold' 
                          : 'text-text-primary hover:text-primary-color'
                      }`}
                    >
                      <span className="relative z-10">{item.name}</span>
                      <span className="absolute bottom-0 left-0 w-full h-0.5 gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                      <div className="absolute -inset-2 gradient-primary rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-500 -z-10"></div>
                    </button>
                  )}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.nav>
      
      <MobileNav />
    </>
  )
} 