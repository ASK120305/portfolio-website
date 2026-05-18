import { motion } from 'framer-motion';
import { ArrowDown, Mail } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <section className="min-h-screen flex flex-col justify-center px-6 md:px-20 relative pt-20 z-10" id="hero">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl"
      >
        <motion.p variants={itemVariants} className="text-primary font-mono mb-4 text-lg">
          Hi, my name is
        </motion.p>
        <motion.h1 
          variants={itemVariants}
          className="text-5xl md:text-8xl font-bold tracking-tight mb-4 text-white hover:text-glow transition-all duration-300"
        >
          Aryan Kale.
        </motion.h1>
        <motion.h2 
          variants={itemVariants}
          className="text-4xl md:text-7xl font-bold text-gray-400 mb-8"
        >
          Architecting logic. Crafting magic.
        </motion.h2>
        
        <motion.p 
          variants={itemVariants}
          className="text-gray-400 text-lg md:text-xl max-w-xl mb-12"
        >
          I thrive on solving real-world problems and building things from scratch. 
          Exploring new technologies and creating practical, engaging projects is what I do best.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 sm:items-center">
          <a href="#projects" className="px-8 py-4 bg-primary/10 text-primary w-fit border border-primary/50 hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] rounded-[4px] font-medium transition-all duration-300 interactive backdrop-blur-sm shadow-lg shadow-primary/10 text-center">
            View Projects
          </a>
          <div className="flex gap-4">
            <a href="https://github.com/ASK120305" target="_blank" rel="noreferrer" className="p-3 text-gray-400 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] rounded-full transition-all interactive bg-white/5 border border-white/10">
              <FaGithub size={24} />
            </a>
            <a href="https://www.linkedin.com/in/aryan-kale-030108326/" target="_blank" rel="noreferrer" className="p-3 text-gray-400 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] rounded-full transition-all interactive bg-white/5 border border-white/10">
              <FaLinkedin size={24} />
            </a>
            <a href="mailto:arkale2005@gmail.com" className="p-3 text-gray-400 hover:text-primary hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] rounded-full transition-all interactive bg-white/5 border border-white/10">
              <Mail size={24} />
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-breathe"
      >
        <div style={{ writingMode: 'vertical-rl' }} className="text-xs text-gray-500 uppercase tracking-widest mb-2">Scroll</div>
        <ArrowDown className="text-gray-500" size={20} />
      </motion.div>
    </section>
  );
}
