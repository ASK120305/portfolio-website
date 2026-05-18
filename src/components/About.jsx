import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const containerRef = useRef(null);

  // Tilt effect values (Framer Motion)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e) => {
    // Disable tilt on mobile coarse pointers
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Entry animation (GSAP ScrollTrigger)
  useEffect(() => {
    const el = containerRef.current;
    
    const anim = gsap.fromTo(el, 
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
        }
      }
    );
    
    return () => {
      anim.kill();
    };
  }, []);

  return (
    <section id="about" className="min-h-screen py-20 flex items-center justify-center px-6 md:px-20 relative z-10">
      <div className="max-w-4xl w-full" ref={containerRef}>
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white whitespace-nowrap">
            <span className="text-primary font-mono text-xl md:text-2xl mr-2">01.</span> About Me
          </h2>
          <div className="h-[1px] bg-white/10 w-full max-w-[300px]" />
        </div>

        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX: rotateX,
            rotateY: rotateY,
            transformStyle: "preserve-3d",
          }}
          className="glass-card p-8 md:p-12 relative overflow-hidden group border-white/5 bg-white/[0.02]"
        >
          {/* Subtle Glare Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div style={{ transform: "translateZ(40px)" }} className="relative z-10">
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
              I’m <span className="text-primary font-medium text-glow">Aryan Kale</span>, a tech enthusiast who enjoys solving real-world problems and building things from scratch. I spend most of my time exploring new technologies, experimenting with ideas, and creating projects that are both practical and fun.
            </p>
            <p className="text-gray-400 mt-6 leading-relaxed">
              My architectural philosophy revolves around writing clean, scalable code and delivering seamless user experiences. I'm constantly pursuing perfection in performance and design.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
