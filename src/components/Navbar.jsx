import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 2.8, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md bg-background/60 border-b border-white/5"
    >
      <div className="text-xl font-bold text-white tracking-tighter interactive cursor-pointer" onClick={() => window.scrollTo(0,0)}>
        AK<span className="text-primary">.</span>
      </div>
      
      <nav className="hidden md:flex items-center gap-8">
        <a href="#about" className="text-sm font-medium font-mono text-gray-300 hover:text-primary transition-colors interactive">
          <span className="text-primary mr-1">01.</span>About
        </a>
        <a href="#projects" className="text-sm font-medium font-mono text-gray-300 hover:text-primary transition-colors interactive">
          <span className="text-primary mr-1">02.</span>Projects
        </a>
        <a href="#contact" className="text-sm font-medium font-mono text-gray-300 hover:text-primary transition-colors interactive">
          <span className="text-primary mr-1">03.</span>Contact
        </a>
        <a 
          href="#" 
          download
          className="px-5 py-2 text-sm font-medium font-mono text-primary border border-primary/50 rounded hover:bg-primary/10 transition-all shadow-[0_0_10px_rgba(59,130,246,0.1)] hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] interactive"
        >
          Resume
        </a>
      </nav>
      
      <div className="md:hidden flex items-center">
        <a 
          href="#" 
          download
          className="px-4 py-2 text-xs font-medium font-mono text-primary border border-primary/50 rounded hover:bg-primary/10 transition-colors interactive"
        >
          Resume
        </a>
      </div>
    </motion.header>
  );
}
