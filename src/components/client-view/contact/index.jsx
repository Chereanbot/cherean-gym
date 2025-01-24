'use client'
import { useEffect, useState, useRef } from "react";
import AnimationWrapper from "../animation-wrapper";
import { addData } from "@/services";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { FaEnvelope, FaUser, FaPaperPlane, FaMapMarkerAlt, FaPhone, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { toast } from 'react-hot-toast';
import ReviewForm from '../review/ReviewForm';

const controls = [
    {
        name: "name",
        placeholder: "Enter your name",
        type: "text",
        label: "Name",
        icon: <FaUser className="text-green-main" />
    },
    {
        name: "email",
        placeholder: "Enter your Email",
        type: "email",
        label: "Email",
        icon: <FaEnvelope className="text-green-main" />
    },
    {
        name: "message",
        placeholder: "Enter your message",
        type: "text",
        label: "Message",
        icon: <FaPaperPlane className="text-green-main" />
    }
];

const LocationDescription = ({ location }) => {
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [coordinates, setCoordinates] = useState(null);

    useEffect(() => {
        async function fetchLocationDetails() {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)},Ethiopia&format=json&addressdetails=1`);
                const data = await response.json();
                if (data && data[0]) {
                    const { address, lat, lon } = data[0];
                    setCoordinates({ lat, lon });
                    const details = {
                        area: address.suburb || address.neighbourhood || address.residential,
                        city: address.city || address.town || "Addis Ababa",
                        state: address.state || "Addis Ababa",
                        country: address.country || "Ethiopia"
                    };
                    
                    setDescription(details);
                } else {
                    setDescription({
                        area: "40mich",
                        city: "Addis Ababa",
                        state: "Addis Ababa",
                        country: "Ethiopia"
                    });
                }
            } catch (error) {
                console.error("Error fetching location details:", error);
                setDescription({
                    area: "40mich",
                    city: "Addis Ababa",
                    state: "Addis Ababa",
                    country: "Ethiopia"
                });
            } finally {
                setLoading(false);
            }
        }
        fetchLocationDetails();
    }, [location]);

    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-gray-500 mt-2 space-y-1"
            >
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-green-main/30 border-t-green-main rounded-full animate-spin"></div>
                    <span>Loading location details...</span>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 space-y-1.5"
        >
            <div className="flex flex-col space-y-1">
                <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-sm text-gray-600 flex items-center space-x-2"
                >
                    <span className="w-2 h-2 bg-green-main/50 rounded-full"></span>
                    <span className="font-medium">{description.area}</span>
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm text-gray-600 flex items-center space-x-2"
                >
                    <span className="w-2 h-2 bg-green-main/40 rounded-full"></span>
                    <span>{description.city}</span>
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm text-gray-600 flex items-center space-x-2"
                >
                    <span className="w-2 h-2 bg-green-main/30 rounded-full"></span>
                    <span>{description.state}</span>
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm text-gray-600 flex items-center space-x-2"
                >
                    <span className="w-2 h-2 bg-green-main/20 rounded-full"></span>
                    <span>{description.country}</span>
                </motion.div>
            </div>
            {coordinates && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-xs text-gray-500 mt-2"
                >
                    <a 
                        href={`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lon}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-green-main hover:text-green-600 transition-colors duration-300"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>View on map</span>
                    </a>
                </motion.div>
            )}
        </motion.div>
    );
};

const contactInfo = [
    {
        icon: <FaMapMarkerAlt className="w-6 h-6" />,
        title: "Address",
        content: "Dilla, Ethiopia",
        link: "https://maps.google.com/?q=Dilla,Ethiopia",
        showLocation: true
    },
    {
        icon: <FaPhone className="w-6 h-6" />,
        title: "Phone",
        content: "+251 947 006 369",
        link: "tel:+251947006369"
    },
    {
        icon: <FaEnvelope className="w-6 h-6" />,
        title: "Email",
        content: "cherinetafework@gmail.com",
        link: "mailto:cherinetafework@gmail.com"
    }
];

const socialLinks = [
    {
        icon: <FaGithub className="w-6 h-6" />,
        url: "https://github.com/chereanbot",
        label: "GitHub",
        color: "hover:bg-[#333333]"
    },
    {
        icon: <FaLinkedin className="w-6 h-6" />,
        url: "https://linkedin.com/in/cherinetbot",
        label: "LinkedIn",
        color: "hover:bg-[#0077B5]"
    },
    {
        icon: <FaTwitter className="w-6 h-6" />,
        url: "https://twitter.com/cherinet",
        label: "Twitter",
        color: "hover:bg-[#1DA1F2]"
    }
];

const initialFormData = {
    name: "",
    email: "",
    message: ""
};

// Add toast notifications
const Toast = ({ message, type = 'success', onClose }) => (
    <motion.div
        initial={{ opacity: 0, y: -20, x: '-50%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 ${
            type === 'success' ? 'bg-green-50/90' : 'bg-red-50/90'
        } backdrop-blur-md shadow-xl rounded-2xl px-6 py-4 flex items-center space-x-3 min-w-[320px] border border-white/20`}
    >
        <div className={`p-2 rounded-xl ${
            type === 'success' ? 'bg-green-main/10' : 'bg-red-100'
        }`}>
            {type === 'success' ? (
                <motion.svg 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-5 h-5 text-green-main" 
                    fill="none" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path d="M5 13l4 4L19 7"></path>
                </motion.svg>
            ) : (
                <motion.svg 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-5 h-5 text-red-500" 
                    fill="none" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path d="M6 18L18 6M6 6l12 12"></path>
                </motion.svg>
            )}
        </div>
        <p className={`text-sm font-medium ${
            type === 'success' ? 'text-green-800' : 'text-red-800'
        }`}>
            {message}
        </p>
        <motion.button 
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="ml-auto p-1.5 hover:bg-gray-100 rounded-xl transition-colors duration-200"
        >
            <svg className="w-4 h-4 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </motion.button>
    </motion.div>
);

// Add Map Component
const MapSection = ({ coordinates }) => {
    const mapRef = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [L, setL] = useState(null);

    useEffect(() => {
        // Load Leaflet CSS
        if (!document.querySelector('#leaflet-css')) {
            const link = document.createElement('link');
            link.id = 'leaflet-css';
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
            link.crossOrigin = '';
            document.head.appendChild(link);
        }

        // Dynamic import of Leaflet
        import('leaflet').then((L) => {
            setL(L.default);
            setMapLoaded(true);
        });
    }, []);

    useEffect(() => {
        if (mapLoaded && L && coordinates && mapRef.current) {
            // Initialize the map with better controls
            const map = L.map(mapRef.current, {
                center: [6.4115, 38.3147],
                zoom: 16,
                zoomControl: false,
                scrollWheelZoom: true,
                dragging: true,
                doubleClickZoom: true,
                boxZoom: true
            });

            // Add OpenStreetMap tiles with better styling
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19,
                minZoom: 5
            }).addTo(map);

            // Add scale control
            L.control.scale({
                metric: true,
                imperial: false,
                position: 'bottomleft'
            }).addTo(map);

            // Add zoom control with better positioning
            L.control.zoom({
                position: 'bottomright',
                zoomInText: '+',
                zoomOutText: '-',
                zoomInTitle: 'Zoom in',
                zoomOutTitle: 'Zoom out'
            }).addTo(map);

            // Add circle around the marker for better visibility
            L.circle([6.4115, 38.3147], {
                color: '#22c55e',
                fillColor: '#22c55e',
                fillOpacity: 0.1,
                radius: 300,
                weight: 1
            }).addTo(map);

            // Add a larger circle for area context
            L.circle([6.4115, 38.3147], {
                color: '#22c55e',
                fillColor: '#22c55e',
                fillOpacity: 0.05,
                radius: 800,
                weight: 1
            }).addTo(map);

            // Enhanced custom icon with bigger size and better animation
            const customIcon = L.divIcon({
                className: 'custom-div-icon',
                html: `
                    <div style="
                        background-color: #22c55e;
                        width: 36px;
                        height: 36px;
                        border-radius: 50%;
                        border: 4px solid white;
                        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                        position: relative;
                        animation: pulse 2s infinite;
                    ">
                        <div style="
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            width: 12px;
                            height: 12px;
                            background-color: white;
                            border-radius: 50%;
                        "></div>
                    </div>
                `,
                iconSize: [36, 36],
                iconAnchor: [18, 18]
            });

            // Add marker with enhanced popup
            const marker = L.marker(
                [6.4115, 38.3147],
                { 
                    icon: customIcon,
                    title: "Dilla, Ethiopia",
                    riseOnHover: true
                }
            ).addTo(map);

            // Enhanced popup with more details and better styling
            marker.bindPopup(`
                <div class="p-5 min-w-[280px]">
                    <div class="flex items-center space-x-2 mb-3">
                        <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <h3 class="font-bold text-gray-800 text-xl">Dilla University Area</h3>
                    </div>
                    <div class="space-y-3 border-t border-gray-100 pt-3">
                        <div class="flex flex-col space-y-2">
                            <span class="text-green-700 text-sm font-semibold flex items-center">
                                <svg class="w-4 h-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                Location Details
                            </span>
                            <div class="grid grid-cols-2 gap-2">
                                <div class="bg-gradient-to-br from-green-50 to-green-100/50 p-2.5 rounded-xl border border-green-100 hover:shadow-md transition-all duration-300">
                                    <span class="text-green-700 text-xs font-semibold block mb-1">Latitude</span>
                                    <span class="text-green-800 font-bold">6.4115°N</span>
                                </div>
                                <div class="bg-gradient-to-br from-green-50 to-green-100/50 p-2.5 rounded-xl border border-green-100 hover:shadow-md transition-all duration-300">
                                    <span class="text-green-700 text-xs font-semibold block mb-1">Longitude</span>
                                    <span class="text-green-800 font-bold">38.3147°E</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col space-y-2">
                            <span class="text-blue-700 text-sm font-semibold flex items-center">
                                <svg class="w-4 h-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                Area Information
                            </span>
                            <div class="bg-gradient-to-br from-blue-50 to-blue-100/50 p-3 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-300">
                                <span class="text-blue-900 font-bold block">Dilla, Southern Nations, Ethiopia</span>
                                <div class="flex items-center mt-2 bg-blue-50/50 p-1.5 rounded-lg">
                                    <svg class="w-4 h-4 text-blue-700 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <p class="text-sm text-blue-700 font-semibold">University & Educational Hub</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 grid grid-cols-2 gap-2">
                        <a 
                            href="https://www.google.com/maps?q=6.4115,38.3147" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            class="flex items-center justify-center bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-700 font-medium py-2 px-3 rounded-xl transition-all duration-300 text-sm border border-green-200 hover:shadow-md"
                        >
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Google Maps
                        </a>
                        <button 
                            onclick="window.open('https://www.openstreetmap.org/?mlat=6.4115&mlon=38.3147&zoom=16')"
                            class="flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 font-medium py-2 px-3 rounded-xl transition-all duration-300 text-sm border border-blue-200 hover:shadow-md"
                        >
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            Street View
                        </button>
                    </div>
                </div>
            `, {
                closeButton: false,
                className: 'custom-popup',
                maxWidth: 320,
                minWidth: 280,
                autoPan: true,
                autoPanPadding: [50, 50]
            }).openPopup();

            // Cleanup
            return () => {
                map.remove();
            };
        }
    }, [mapLoaded, L, coordinates]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-[600px] sm:h-[700px] md:h-[600px] lg:h-[700px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
        >
            {!mapLoaded && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 border-2 border-green-main/30 border-t-green-main rounded-full animate-spin"></div>
                        <span className="text-gray-600">Loading map...</span>
                    </div>
                </div>
            )}
            <div ref={mapRef} className="w-full h-full"></div>
            
            {/* Add custom styles for the map */}
            <style jsx global>{`
                .leaflet-container {
                    border-radius: 1rem;
                    width: 100%;
                    height: 100%;
                }
                .leaflet-popup-content-wrapper {
                    border-radius: 1rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    padding: 0;
                }
                .leaflet-popup-content {
                    margin: 0;
                }
                .leaflet-popup-tip-container {
                    display: none;
                }
                .custom-popup .leaflet-popup-content-wrapper {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(8px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                .leaflet-control-zoom {
                    border: none !important;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
                }
                .leaflet-control-zoom a {
                    background-color: rgba(255, 255, 255, 0.9) !important;
                    border: 1px solid rgba(255, 255, 255, 0.2) !important;
                    backdrop-filter: blur(8px) !important;
                    color: #22c55e !important;
                    transition: all 0.3s ease !important;
                }
                .leaflet-control-zoom a:hover {
                    background-color: #22c55e !important;
                    color: white !important;
                }
                .leaflet-control-scale {
                    border: none !important;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
                    background-color: rgba(255, 255, 255, 0.9) !important;
                    backdrop-filter: blur(8px) !important;
                    padding: 2px 5px !important;
                    border-radius: 4px !important;
                    color: #4b5563 !important;
                }
            `}</style>
        </motion.div>
    );
};

export default function ClientContactView() {
    const [formData, setFormData] = useState(initialFormData);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);

    async function handleSendMessage() {
        setIsSubmitting(true);
        try {
            const res = await addData("contact", formData);
            if (res && res.success) {
                setFormData(initialFormData);
                setShowSuccessMessage(true);
            } else {
                setShowErrorMessage(true);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setShowErrorMessage(true);
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        if (showSuccessMessage) {
            const timer = setTimeout(() => {
                setShowSuccessMessage(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showSuccessMessage]);

    useEffect(() => {
        if (showErrorMessage) {
            const timer = setTimeout(() => {
                setShowErrorMessage(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showErrorMessage]);

    const isValidForm = () => {
        return (
            formData &&
            formData.name !== "" &&
            formData.email !== "" &&
            formData.message !== ""
        );
    };

    return (
        <div className="max-w-screen-xl mt-24 mb-6 sm:mt-14 sm:mb-14 px-6 sm:px-8 lg:px-16 mx-auto relative" id="contact">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/60 via-white/40 to-green-50/60 rounded-3xl -z-10 backdrop-blur-3xl"></div>
            <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-gradient-to-br from-green-200/30 to-green-300/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-tr from-green-100/30 to-green-200/20 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/4 right-1/3 w-48 h-48 bg-gradient-to-bl from-green-100/20 to-green-200/10 rounded-full blur-2xl -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

            {/* Notification Toasts */}
            <AnimatePresence>
                {showSuccessMessage && (
                    <Toast 
                        message="Message sent successfully! I'll get back to you soon." 
                        type="success"
                        onClose={() => setShowSuccessMessage(false)}
                    />
                )}
                {showErrorMessage && (
                    <Toast 
                        message="Oops! Something went wrong. Please try again." 
                        type="error"
                        onClose={() => setShowErrorMessage(false)}
                    />
                )}
            </AnimatePresence>

            <AnimationWrapper className={"py-6"}>
                <div className="flex flex-col justify-center items-center row-start-2 sm:row-start-1">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <h1 className="leading-[70px] mb-4 text-3xl lg:text-4xl xl:text-5xl font-bold">
                            {"Let's Connect".split(" ").map((item, index) => (
                                <span key={index} className={`${index === 1 ? "text-green-main" : "text-[#000]"}`}>
                                    {item}{" "}
                                </span>
                            ))}
                        </h1>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
                            Feel free to reach out for collaboration opportunities, project inquiries, 
                            or just to say hello. I'm always excited to connect with new people!
                        </p>
                    </motion.div>
                </div>
            </AnimationWrapper>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-10">
                {/* Contact Info Card */}
                <div className="space-y-8">
                    <motion.div 
                        className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden border border-white/20"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Enhanced Background Pattern */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-main/30 via-green-main/20 to-transparent rounded-full -mr-20 -mt-20 blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-green-main/30 via-green-main/20 to-transparent rounded-full -ml-20 -mb-20 blur-2xl"></div>

                        <h2 className="text-2xl font-bold mb-6 text-gray-800 relative">Get in Touch</h2>
                        <div className="space-y-6 relative">
                            {contactInfo.map((info, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.2 }}
                                    className="group"
                                >
                                    <motion.a
                                        href={info.link}
                                        target={info.link.startsWith('http') ? "_blank" : "_self"}
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-4 text-gray-600 hover:bg-white/50 p-4 rounded-xl transition-all duration-300 hover:shadow-lg group cursor-pointer backdrop-blur-sm border border-white/10 hover:border-white/20"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="p-3 bg-gradient-to-br from-green-main/20 to-green-main/10 rounded-xl text-green-main group-hover:bg-green-main group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md">
                                            {info.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 group-hover:text-green-main transition-colors duration-300">{info.title}</h3>
                                            <p className="text-gray-600">{info.content}</p>
                                            {info.showLocation && <LocationDescription location={info.content} />}
                                        </div>
                                        <motion.div 
                                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            <svg className="w-5 h-5 text-green-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </motion.div>
                                    </motion.a>
                                </motion.div>
                            ))}
                        </div>

                        {/* Social Links with enhanced styling */}
                        <div className="mt-10 pt-8 border-t border-white/20 relative">
                            <h3 className="text-lg font-semibold mb-6 text-gray-800">Connect with Me</h3>
                            <div className="flex space-x-4">
                                {socialLinks.map((social, index) => (
                                    <motion.a
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`p-4 bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-sm rounded-xl text-gray-600 ${social.color} hover:text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border border-white/20 hover:border-white/40 shadow-sm`}
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {social.icon}
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Contact Form Card */}
                <motion.div 
                    className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden border border-white/20"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Enhanced Background Pattern */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-green-main/30 via-green-main/20 to-transparent rounded-full -mr-20 -mt-20 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-green-main/30 via-green-main/20 to-transparent rounded-full -ml-20 -mb-20 blur-2xl"></div>

                    <h2 className="text-2xl font-bold mb-6 text-gray-800 relative">Send Message</h2>
                    <div className="space-y-6 relative">
                        {controls.map((controlItem, index) => (
                            <motion.div
                                key={controlItem.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative"
                            >
                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                    {controlItem.label}
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        {controlItem.icon}
                                    </div>
                                    {controlItem.name === "message" ? (
                                        <textarea
                                            id={controlItem.name}
                                            name={controlItem.name}
                                            value={formData[controlItem.name]}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    [controlItem.name]: e.target.value,
                                                })
                                            }
                                            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200/80 rounded-xl focus:ring-2 focus:ring-green-main/20 focus:border-green-main bg-white/70 backdrop-blur-sm text-gray-900 text-sm placeholder-gray-400 transition-all duration-300 group-hover:border-green-main/50 shadow-sm hover:shadow-md"
                                            placeholder={controlItem.placeholder}
                                            rows={4}
                                        />
                                    ) : (
                                        <input
                                            type={controlItem.type}
                                            id={controlItem.name}
                                            name={controlItem.name}
                                            value={formData[controlItem.name]}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    [controlItem.name]: e.target.value,
                                                })
                                            }
                                            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200/80 rounded-xl focus:ring-2 focus:ring-green-main/20 focus:border-green-main bg-white/70 backdrop-blur-sm text-gray-900 text-sm placeholder-gray-400 transition-all duration-300 group-hover:border-green-main/50 shadow-sm hover:shadow-md"
                                            placeholder={controlItem.placeholder}
                                        />
                                    )}
                                </div>
                            </motion.div>
                        ))}

                        <motion.button
                            disabled={!isValidForm() || isSubmitting}
                            onClick={handleSendMessage}
                            className="w-full bg-gradient-to-r from-green-600 to-green-main text-white py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 relative overflow-hidden group border border-white/20"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-green-main to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center space-x-2">
                                {isSubmitting ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <FaPaperPlane className="w-5 h-5 transform group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform duration-300" />
                                        <span>Send Message</span>
                                    </>
                                )}
                            </div>
                        </motion.button>
                    </div>
                </motion.div>
            </div>

            {/* Map Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-12"
            >
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden border border-white/20">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-main/30 via-green-main/20 to-transparent rounded-full -mr-20 -mt-20 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-green-main/30 via-green-main/20 to-transparent rounded-full -ml-20 -mb-20 blur-2xl"></div>

                    <h2 className="text-2xl font-bold mb-6 text-gray-800 relative">Location Map</h2>
                    <MapSection coordinates={{ lat: "6.4115", lon: "38.3147" }} />
                </div>
            </motion.div>

            {/* Review Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-12"
            >
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden border border-white/20">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 relative">Share Your Experience</h2>
                    {showReviewForm ? (
                        <ReviewForm onSuccess={() => setShowReviewForm(false)} />
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-600 mb-6">
                                Have you worked with me? I'd love to hear about your experience!
                            </p>
                            <button
                                onClick={() => setShowReviewForm(true)}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                            >
                                Write a Review
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}