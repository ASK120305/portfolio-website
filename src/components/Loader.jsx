import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Loader({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500); // 2.5s loading duration
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 2.2, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      onAnimationComplete={() => {
        // Additional cleanup if needed
      }}
    >
      <div className="relative flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-bold tracking-tighter text-glow"
        >
          Aryan Kale
        </motion.h1>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
          className="h-[2px] bg-primary mt-4 rounded-full neon-border"
        />
      </div>
    </motion.div>
  );
}
