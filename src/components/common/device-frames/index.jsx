'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

// Frame color themes
const themes = {
  pro: {
    frame: 'bg-[#1F1F1F]',
    gradient: 'from-gray-800 to-gray-900',
    accent: 'ring-gray-700',
    text: 'text-gray-600',
    surface: 'bg-gray-900',
    button: 'bg-gray-800',
    highlight: 'bg-[#0A0A0A]',
    shadow: 'shadow-black/30',
  },
  regular: {
    frame: 'bg-[#f5f5f7]',
    gradient: 'from-gray-100 to-gray-200',
    accent: 'ring-gray-200',
    text: 'text-gray-400',
    surface: 'bg-gray-50',
    button: 'bg-gray-300',
    highlight: 'bg-white',
    shadow: 'shadow-gray-200/50',
  },
  gold: {
    frame: 'bg-[#F4D03F]',
    gradient: 'from-yellow-400 to-yellow-600',
    accent: 'ring-yellow-500',
    text: 'text-yellow-700',
    surface: 'bg-yellow-50',
    button: 'bg-yellow-400',
    highlight: 'bg-yellow-300',
    shadow: 'shadow-yellow-200/50',
  },
  space: {
    frame: 'bg-[#2C3E50]',
    gradient: 'from-gray-700 to-gray-900',
    accent: 'ring-blue-900',
    text: 'text-blue-400',
    surface: 'bg-gray-800',
    button: 'bg-gray-700',
    highlight: 'bg-[#34495E]',
    shadow: 'shadow-blue-900/30',
  }
};

export function IPhoneFrame({ imageUrl, alt = 'Photo in iPhone frame', className = '', variant = 'pro', theme = 'pro' }) {
  const isProModel = variant === 'pro';
  const colors = themes[theme];

  return (
    <div className={`relative ${className}`}>
      {/* Background Glow */}
      <div className={`absolute inset-0 ${colors.shadow} blur-2xl rounded-full opacity-30`}></div>
      
      {/* Lightning Cable */}
      <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[2px] h-20 
        bg-gradient-to-b ${colors.gradient} opacity-70
        before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:transform before:-translate-x-1/2
        before:w-4 before:h-1 before:${colors.button} before:rounded-t-sm`}></div>

      {/* iPhone Frame */}
      <div className={`relative w-[280px] h-[560px] ${colors.frame} rounded-[45px] p-3 
        shadow-[0_0_15px_rgba(0,0,0,0.1),0_0_3px_rgba(0,0,0,0.05)] backdrop-blur-sm
        ring-1 ${colors.accent}
        before:content-[''] before:absolute before:inset-0 
        before:bg-gradient-to-tr before:${colors.gradient} before:opacity-50 before:rounded-[45px]
        after:content-[''] after:absolute after:inset-[1px] after:${colors.highlight} after:rounded-[44px]
        transform perspective-1000 hover:rotate-[0.5deg] hover:scale-[1.02] 
        transition-all duration-500 ease-out`}>
        
        {/* Dynamic Island (Pro models) */}
        {isProModel && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-b-[20px] z-20
            before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-gray-800/20 before:to-transparent before:rounded-b-[20px]">
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-[85px] h-[25px] bg-[#0A0A0A] rounded-[20px] overflow-hidden
              before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-black/40 before:to-transparent">
              {/* TrueDepth Camera */}
              <div className="absolute top-[8px] right-[15px] w-[8px] h-[8px] bg-[#1A1A1A] rounded-full">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[4px] h-[4px] bg-[#0A0A0A] rounded-full"></div>
              </div>
              {/* Face ID Components */}
              <div className="absolute top-[10px] left-[15px] w-[6px] h-[6px] bg-[#1A1A1A] rounded-full"></div>
              <div className="absolute top-[10px] left-[25px] w-[6px] h-[6px] bg-[#1A1A1A] rounded-full"></div>
            </div>
          </div>
        )}

        {/* Regular Notch (non-Pro models) */}
        {!isProModel && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120px] h-[25px] bg-black rounded-b-[20px] z-20">
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-[80px] h-[6px] bg-[#1A1A1A] rounded-full"></div>
            <div className="absolute top-2 right-6 w-[6px] h-[6px] bg-[#1A1A1A] rounded-full">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[3px] h-[3px] bg-[#0A0A0A] rounded-full"></div>
            </div>
          </div>
        )}
        
        {/* Power Button */}
        <div className={`absolute right-[-2px] top-[90px] w-[3px] h-[60px] ${isProModel ? 'bg-gray-800' : 'bg-gray-300'} rounded-l-sm
          before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-t ${isProModel ? 'before:from-gray-700' : 'before:from-gray-200'} before:to-transparent`}></div>
        
        {/* Volume Buttons */}
        <div className={`absolute left-[-2px] top-[90px] w-[3px] h-[30px] ${isProModel ? 'bg-gray-800' : 'bg-gray-300'} rounded-r-sm
          before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-t ${isProModel ? 'before:from-gray-700' : 'before:from-gray-200'} before:to-transparent`}></div>
        <div className={`absolute left-[-2px] top-[130px] w-[3px] h-[30px] ${isProModel ? 'bg-gray-800' : 'bg-gray-300'} rounded-r-sm
          before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-t ${isProModel ? 'before:from-gray-700' : 'before:from-gray-200'} before:to-transparent`}></div>

        {/* Camera Module (Pro models) */}
        {isProModel && (
          <div className="absolute top-12 right-4 w-[45px] h-[45px] bg-[#0A0A0A] rounded-[12px] z-20
            before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-tr before:from-gray-800/30 before:to-transparent before:rounded-[12px]">
            {/* Main Camera */}
            <div className="absolute top-2 left-2 w-[18px] h-[18px] bg-[#1A1A1A] rounded-full
              before:content-[''] before:absolute before:inset-[2px] before:bg-[#0A0A0A] before:rounded-full
              after:content-[''] after:absolute after:inset-[4px] after:bg-[#1F1F1F] after:rounded-full"></div>
            {/* Ultra Wide */}
            <div className="absolute bottom-2 right-2 w-[18px] h-[18px] bg-[#1A1A1A] rounded-full
              before:content-[''] before:absolute before:inset-[2px] before:bg-[#0A0A0A] before:rounded-full
              after:content-[''] after:absolute after:inset-[4px] after:bg-[#1F1F1F] after:rounded-full"></div>
            {/* LiDAR Scanner */}
            <div className="absolute bottom-2 left-2 w-[8px] h-[8px] bg-[#1A1A1A] rounded-full"></div>
          </div>
        )}
        
        {/* Screen */}
        <div className={`relative w-full h-full ${isProModel ? 'bg-black' : 'bg-white'} rounded-[35px] overflow-hidden shadow-inner
          before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-tr before:from-black/20 before:to-transparent before:z-10`}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={alt}
              fill
              className="object-cover"
              sizes="(max-width: 280px) 100vw, 280px"
            />
          ) : (
            <div className={`w-full h-full ${isProModel ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
              <span className={`${isProModel ? 'text-gray-600' : 'text-gray-400'}`}>No image</span>
            </div>
          )}
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-[8px] left-1/2 transform -translate-x-1/2 w-[120px] h-[4px] bg-gray-600/30 rounded-full z-20"></div>
      </div>
    </div>
  );
}

export function MacBookFrame({ imageUrl, alt = 'Photo in MacBook frame', className = '', variant = 'pro', theme = 'pro' }) {
  const isProModel = variant === 'pro';
  const colors = themes[theme];

  return (
    <div className={`relative ${className}`}>
      {/* Background Glow */}
      <div className={`absolute inset-0 ${colors.shadow} blur-2xl rounded-full opacity-30`}></div>
      
      {/* MacBook Frame */}
      <div className="relative w-[800px] max-w-full transform perspective-1000">
        {/* Power Cable */}
        <div className={`absolute -left-8 bottom-0 w-[3px] h-24 
          bg-gradient-to-b ${colors.gradient} opacity-70
          before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:transform before:-translate-x-1/2
          before:w-6 before:h-2 before:${colors.button} before:rounded-t-sm`}></div>

        {/* Top Part (Screen) */}
        <div className={`relative ${colors.frame} rounded-t-xl pt-4 pb-4 px-4
          shadow-[0_0_15px_rgba(0,0,0,0.1),0_0_3px_rgba(0,0,0,0.05)] backdrop-blur-sm
          ring-1 ${colors.accent}
          before:content-[''] before:absolute before:inset-0 
          before:bg-gradient-to-tr before:${colors.gradient} before:opacity-50 before:rounded-t-xl
          group-hover:rotate-[0.5deg] group-hover:scale-[1.02] 
          transition-all duration-500 ease-out`}>
          
          {/* Notch */}
          <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-[160px] h-[20px] 
            ${isProModel ? 'bg-[#1F1F1F]' : 'bg-[#f5f5f7]'} rounded-b-lg z-10`}>
            {/* Camera */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-[8px] h-[8px] bg-[#1A1A1A] rounded-full">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[4px] h-[4px] bg-[#0A0A0A] rounded-full"></div>
              {/* Camera Light */}
              <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-[4px] h-[4px] bg-gray-700 rounded-full"></div>
            </div>
          </div>

          {/* Screen */}
          <div className={`relative ${isProModel ? 'bg-black' : 'bg-white'} rounded-lg overflow-hidden shadow-inner`} 
            style={{ aspectRatio: '16/10' }}>
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent z-10"></div>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={alt}
                fill
                className="object-cover"
                sizes="(max-width: 800px) 100vw, 800px"
              />
            ) : (
              <div className={`w-full h-full ${isProModel ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
                <span className={`${isProModel ? 'text-gray-600' : 'text-gray-400'}`}>No image</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Bottom Part (Base) with enhanced shadows and reflections */}
        <div className="relative">
          {/* Main Base */}
          <div className={`h-3 ${colors.frame} rounded-b-xl
            shadow-[0_2px_4px_rgba(0,0,0,0.1),0_-1px_2px_rgba(255,255,255,0.05)]
            before:content-[''] before:absolute before:inset-0 
            before:bg-gradient-to-tr before:${colors.gradient} before:opacity-50
            after:content-[''] after:absolute after:inset-x-0 after:top-0 after:h-[1px] 
            after:bg-gradient-to-r after:${colors.gradient} after:opacity-20`}>
            {/* Indent with reflection */}
            <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-[2px] 
              ${colors.button} rounded-t-sm
              before:content-[''] before:absolute before:inset-0 
              before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent`}></div>
          </div>
          
          {/* Enhanced Shadow */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-[95%] h-4 
            bg-black/20 blur-md rounded-full"></div>

          {/* Magic Keyboard with enhanced styling */}
          <div className={`absolute -bottom-24 left-1/2 transform -translate-x-1/2 w-[600px] h-16 
            ${colors.frame} rounded-lg 
            shadow-[0_4px_6px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.06)]
            ring-1 ${colors.accent}
            before:content-[''] before:absolute before:inset-0 
            before:bg-gradient-to-tr before:${colors.gradient} before:opacity-50 before:rounded-lg
            after:content-[''] after:absolute after:inset-x-0 after:top-0 after:h-[1px] 
            after:bg-gradient-to-r after:${colors.gradient} after:opacity-20`}>
            
            {/* Keys Grid with enhanced styling */}
            <div className="absolute inset-2 grid grid-cols-12 gap-1">
              {[...Array(48)].map((_, i) => (
                <div key={i} className={`${colors.highlight} rounded-sm h-3
                  shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.1)]
                  before:content-[''] before:absolute before:inset-0 
                  before:bg-gradient-to-tr before:${colors.gradient} before:opacity-10
                  hover:${colors.button} hover:scale-105
                  transition-all duration-200 ease-out`}></div>
              ))}
            </div>
          </div>

          {/* Magic Mouse with enhanced styling */}
          <div className={`absolute -bottom-20 -right-32 w-16 h-8 
            ${colors.frame} rounded-full 
            shadow-[0_4px_6px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.06)]
            ring-1 ${colors.accent}
            before:content-[''] before:absolute before:inset-0 
            before:bg-gradient-to-tr before:${colors.gradient} before:opacity-50 before:rounded-full
            after:content-[''] after:absolute after:inset-x-0 after:top-[2px] after:h-[1px] 
            after:bg-gradient-to-r after:${colors.gradient} after:opacity-20
            hover:scale-105 transition-all duration-200 ease-out`}>
            {/* Mouse Light */}
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 
              bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DeviceFrames({ 
  iPhoneImage, 
  macBookImage, 
  className = '', 
  variant = 'pro',
  theme = 'pro',
  animate = true 
}) {
  return (
    <div className={`relative flex flex-col md:flex-row items-center gap-8 p-12 ${className}
      before:content-[''] before:absolute before:inset-0 
      before:bg-gradient-to-br before:from-blue-500/5 before:via-purple-500/5 before:to-pink-500/5 
      before:blur-3xl before:opacity-30
      after:content-[''] after:absolute after:inset-0 
      after:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)] 
      after:opacity-40`}>
      <motion.div
        initial={animate ? { opacity: 0, x: -50 } : false}
        animate={animate ? { opacity: 1, x: 0 } : false}
        transition={{ duration: 0.5 }}
        className="group transform hover:scale-105 transition-transform duration-300"
      >
        <IPhoneFrame imageUrl={iPhoneImage} variant={variant} theme={theme} />
      </motion.div>
      
      <motion.div
        initial={animate ? { opacity: 0, x: 50 } : false}
        animate={animate ? { opacity: 1, x: 0 } : false}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="group transform hover:scale-105 transition-transform duration-300"
      >
        <MacBookFrame imageUrl={macBookImage} variant={variant} theme={theme} />
      </motion.div>
    </div>
  );
} 