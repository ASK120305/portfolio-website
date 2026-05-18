import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    
    gsap.fromTo(el, 
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
        }
      }
    );
    
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section id="contact" className="min-h-screen py-24 px-6 md:px-20 relative z-10 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full text-center glass-card p-12 lg:p-20 border-white/5 bg-white/[0.02]" ref={containerRef}>
        <h2 className="text-primary font-mono mb-4 tracking-wider">04. What's Next?</h2>
        <h3 className="text-4xl md:text-6xl font-bold text-white mb-6">Get In Touch</h3>
        <p className="text-gray-400 text-lg leading-relaxed mb-12 max-w-lg mx-auto">
          Currently open to new opportunities! Whether you have a question, a project idea, or just want to say hi, I'll try my best to get back to you!
        </p>

        <a 
          href="mailto:arkale2005@gmail.com" 
          className="inline-block px-10 py-5 bg-primary/10 text-primary border border-primary/50 hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] rounded text-lg font-medium transition-all duration-300 interactive"
        >
          Say Hello
        </a>
      </div>

      <footer className="absolute bottom-6 left-0 w-full text-center px-4 flex flex-col items-center gap-4">
        <div className="flex items-center gap-6">
          <a href="mailto:arkale2005@gmail.com" className="text-gray-500 hover:text-white transition-colors interactive">
            <FaEnvelope size={20} />
          </a>
          <a href="https://github.com/ASK120305" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors interactive">
            <FaGithub size={20} />
          </a>
          <a href="https://www.linkedin.com/in/aryan-kale-030108326/" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors interactive">
            <FaLinkedin size={20} />
          </a>
        </div>
        <p className="text-gray-500 font-mono text-sm">
          Designed & Built by Aryan Kale
        </p>
      </footer>
    </section>
  );
}
