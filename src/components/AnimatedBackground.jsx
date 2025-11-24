import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  // Create multiple floating Solana logo elements
  const floatingElements = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: Math.random() * 60 + 40, // Random size between 40-100px
    initialX: Math.random() * 100, // Random initial X position (%)
    initialY: Math.random() * 100, // Random initial Y position (%)
    duration: Math.random() * 10 + 20, // Random duration between 20-30s
    delay: Math.random() * 5, // Random delay up to 5s
    opacity: Math.random() * 0.3 + 0.1, // Random opacity between 0.1-0.4
  }));

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Vibrant gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900">
        {/* Additional gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-tr from-solana-purple/30 via-solana-blue/20 to-solana-pink/30"></div>
        
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-solana-purple/30 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-solana-blue/30 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-solana-pink/20 rounded-full blur-3xl"
          animate={{
            x: [-100, 100, -100],
            y: [-100, 100, -100],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Floating Solana logos */}
      {floatingElements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute"
          style={{
            left: `${element.initialX}%`,
            top: `${element.initialY}%`,
            width: element.size,
            height: element.size,
          }}
          animate={{
            x: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
            y: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: element.delay,
          }}
        >
          <SolanaLogo opacity={element.opacity} />
        </motion.div>
      ))}
    </div>
  );
};

// Solana logo SVG component
const SolanaLogo = ({ opacity = 0.2 }) => (
  <svg
    viewBox="0 0 397.7 311.7"
    style={{ opacity }}
    className="w-full h-full"
  >
    <defs>
      <linearGradient id="solana-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#00FFA3', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#DC1FFF', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <g>
      <path
        fill="url(#solana-gradient)"
        d="M64.6,237.9c2.4-2.4,5.7-3.8,9.2-3.8h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5
        c-5.8,0-8.7-7-4.6-11.1L64.6,237.9z"
      />
      <path
        fill="url(#solana-gradient)"
        d="M64.6,3.8C67.1,1.4,70.4,0,73.8,0h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5
        c-5.8,0-8.7-7-4.6-11.1L64.6,3.8z"
      />
      <path
        fill="url(#solana-gradient)"
        d="M333.1,120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8,0-8.7,7-4.6,11.1l62.7,62.7c2.4,2.4,5.7,3.8,9.2,3.8h317.4
        c5.8,0,8.7-7,4.6-11.1L333.1,120.1z"
      />
    </g>
  </svg>
);

export default AnimatedBackground;
