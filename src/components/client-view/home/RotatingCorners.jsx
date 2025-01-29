import { motion } from 'framer-motion';

const RotatingCorners = ({
  size = 'w-16 h-16',
  duration = 20,
  borderColor = 'border-primary-color',
  borderWidth = 'border-2',
  className = '',
  glowColor = 'rgba(13, 183, 96, 0.5)',
}) => {
  const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

  const getPosition = (position) => {
    switch (position) {
      case 'top-left':
        return 'top-0 left-0 origin-top-left';
      case 'top-right':
        return 'top-0 right-0 origin-top-right';
      case 'bottom-left':
        return 'bottom-0 left-0 origin-bottom-left';
      case 'bottom-right':
        return 'bottom-0 right-0 origin-bottom-right';
      default:
        return '';
    }
  };

  const getRotationDelay = (position) => {
    switch (position) {
      case 'top-left':
        return 0;
      case 'top-right':
        return 0.2;
      case 'bottom-left':
        return 0.4;
      case 'bottom-right':
        return 0.6;
      default:
        return 0;
    }
  };

  return (
    <>
      {corners.map((corner) => (
        <motion.div
          key={corner}
          className={`absolute ${size} ${getPosition(corner)} ${className}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            rotate: [0, 360],
          }}
          transition={{
            opacity: { duration: 0.5, delay: getRotationDelay(corner) },
            scale: { duration: 0.5, delay: getRotationDelay(corner) },
            rotate: {
              duration,
              repeat: Infinity,
              ease: "linear",
              delay: getRotationDelay(corner)
            }
          }}
        >
          {/* Outer glow */}
          <div 
            className="absolute inset-0 rounded-lg blur-md"
            style={{ 
              background: glowColor,
              animation: 'pulse 2s infinite',
              opacity: 0.5
            }} 
          />
          
          {/* Border with gradient */}
          <div 
            className={`relative w-full h-full ${borderWidth} rounded-lg overflow-hidden`}
            style={{
              background: `linear-gradient(45deg, ${glowColor}, transparent)`,
              borderImage: `linear-gradient(45deg, ${glowColor}, transparent) 1`,
              animation: 'borderRotate 4s linear infinite'
            }}
          />

          {/* Inner content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ 
                background: glowColor,
                boxShadow: `0 0 10px ${glowColor}`,
                animation: 'pulse 2s infinite'
              }} 
            />
          </div>
        </motion.div>
      ))}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes borderRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default RotatingCorners; 