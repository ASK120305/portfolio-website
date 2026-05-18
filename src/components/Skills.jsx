import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Network } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const skillGroups = [
  {
    orbit: 1, // inner
    duration: '20s',
    items: ['Java', 'Python', 'C/C++', 'SQL', 'JavaScript', 'TypeScript']
  },
  {
    orbit: 2, // middle
    duration: '35s',
    reverse: true,
    items: ['React', 'Angular', 'Bootstrap', 'Express.js', 'Node.js', 'HTML/CSS']
  },
  {
    orbit: 3, // outer
    duration: '50s',
    items: ['Git', 'Docker', 'Kubernetes', 'AWS', 'Vercel', 'pandas', 'NumPy']
  }
];

export default function Skills() {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    
    gsap.fromTo(el, 
      { opacity: 0, scale: 0.95 },
      { 
        opacity: 1, 
        scale: 1, 
        duration: 1, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
        }
      }
    );
    
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section id="skills" className="min-h-screen py-24 px-6 md:px-20 relative z-10 overflow-hidden" ref={containerRef}>
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-24 h-full">
        
        <div className="flex-1 w-full relative h-[400px] md:h-[600px] flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
          
          {/* Center core */}
          <div className="absolute z-20 w-16 h-16 md:w-24 md:h-24 bg-surface border border-primary/50 text-primary rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)] neon-border">
            <Network size={32} />
          </div>

          {/* Orbits */}
          <div className="relative w-full h-full max-w-[600px] max-h-[600px] flex items-center justify-center scale-[0.6] sm:scale-75 md:scale-100">
            {skillGroups.map((group, i) => {
              const size = (i + 1) * 160 + 80;
              return (
                <div 
                  key={group.orbit}
                  className="absolute rounded-full border border-white/5 border-dashed"
                  style={{
                    width: size,
                    height: size,
                    animation: `spin ${group.duration} linear infinite ${group.reverse ? 'reverse' : 'normal'}`
                  }}
                >
                  {group.items.map((skill, index) => {
                    const angle = (index / group.items.length) * 360;
                    return (
                      <div
                        key={skill}
                        className="absolute flex items-center justify-center"
                        style={{
                          top: '50%',
                          left: '50%',
                          transform: `translate(-50%, -50%) rotate(${angle}deg) translate(${size / 2}px) rotate(-${angle}deg)`,
                        }}
                      >
                         <div 
                           className="bg-surface/80 backdrop-blur-sm border border-white/10 text-gray-300 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-sm whitespace-nowrap shadow-xl"
                           style={{
                             animation: `spin ${group.duration} linear infinite ${group.reverse ? 'normal' : 'reverse'}`
                           }}
                         >
                           {skill}
                         </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 w-full">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white whitespace-nowrap">
              <span className="text-primary font-mono text-xl md:text-2xl mr-2">03.</span> Skills
            </h2>
            <div className="h-[1px] bg-white/10 w-full" />
          </div>
          <div className="glass-card p-8 md:p-10 border-white/5 bg-white/[0.02]">
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              I've worked with a diverse range of technologies across the stack. My core proficiency lies in building scalable backends, dynamic frontends, and deploying to cloud infrastructure.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed">
              I'm always eager to learn new tools and frameworks that help build better, faster, and more robust applications.
            </p>
          </div>
        </div>

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </section>
  );
}
