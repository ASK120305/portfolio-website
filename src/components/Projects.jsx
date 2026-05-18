import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, ChevronRight, X } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

import burnmateImg from '../assets/burnmate.png';
import collegeBuddyImg from '../assets/college-buddy.png';
import privateCollegesImg from '../assets/private-colleges.png';
import examsManagementImg from '../assets/exams-management.png';

gsap.registerPlugin(ScrollTrigger);

const projectsData = [
  {
    id: 'burnmate',
    title: 'BurnMate',
    description: 'A comprehensive fitness tracking and workout generation platform designed to help users achieve their health goals efficiently.',
    tech: ['React', 'Node.js', 'MongoDB', 'Tailwind'],
    features: ['Workout routines', 'Progress tracking', 'Diet plans'],
    github: 'https://github.com/ASK120305/burnmate-exclusive.git',
    featured: false,
    image: burnmateImg,
  },
  {
    id: 'college-buddy',
    title: 'College Buddy',
    description: 'A platform to help college students connect, share notes, and manage their academic timelines collaboratively.',
    tech: ['Java', 'Spring Boot', 'MySQL', 'React'],
    features: ['Note sharing', 'Event calendar', 'Discussion forums'],
    github: 'https://github.com',
    featured: true,
    image: collegeBuddyImg,
  },
  {
    id: 'private-colleges',
    title: 'Private Colleges Platform',
    description: 'A directory and admission portal for discovering and applying to top private colleges nationwide.',
    tech: ['Next.js', 'PostgreSQL', 'Prisma', 'Tailwind'],
    features: ['College search', 'Application tracking', 'Reviews'],
    github: 'https://github.com',
    featured: false,
    image: privateCollegesImg,
  },
  {
    id: 'exams-management',
    title: 'Exams Management System',
    description: 'A secure and scalable system for managing student examinations, grading, and result generation.',
    tech: ['Python', 'Django', 'SQLite', 'Bootstrap'],
    features: ['Test creation', 'Automated grading', 'Result analytics'],
    github: 'https://github.com',
    featured: false,
    image: examsManagementImg,
  }
];

// Reusable Project Modal component
function ProjectModal({ project, onClose }) {
  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md"
      >
        <motion.div
          initial={{ y: 50, scale: 0.95, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 20, scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-surface shadow-2xl rounded-2xl overflow-hidden border border-white/10"
        >
          {/* Header Image */}
          <div className="w-full h-48 md:h-72 relative group overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent z-10" />
            <img src={project.image} alt={project.title} className="w-full h-full object-cover object-top transition-transform duration-[20s] ease-linear group-hover:scale-110" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white hover:text-primary rounded-full transition-all bg-black/50 hover:bg-black/80 interactive z-20 backdrop-blur-md border border-white/10"
            >
              <X size={24} />
            </button>
            <div className="absolute bottom-6 left-6 md:left-10 z-20">
              <h3 className="text-3xl md:text-5xl font-bold text-white text-glow shadow-black drop-shadow-lg">{project.title}</h3>
            </div>
          </div>

          {/* Content Scrollable area */}
          <div className="p-6 md:p-10 overflow-y-auto">
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tech.map((t) => (
                <span key={t} className="px-3 py-1 text-xs font-mono text-primary bg-primary/10 rounded-full border border-primary/20">
                  {t}
                </span>
              ))}
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-xl text-white font-medium mb-2">Overview</h4>
                <p className="text-gray-400 leading-relaxed text-lg">{project.description}</p>
              </div>

              <div>
                <h4 className="text-xl text-white font-medium mb-2">Key Features</h4>
                <ul className="list-disc list-inside text-gray-400 space-y-2">
                  {project.features.map(f => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-8 mt-4 flex gap-4 border-t border-white/5">
                <a href={project.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded hover:bg-gray-200 transition-colors interactive">
                  <FaGithub size={20} /> View Source
                </a>
                <a href="#" className="flex items-center gap-2 px-6 py-3 bg-white/5 text-white font-semibold rounded hover:bg-white/10 transition-colors interactive border border-white/10">
                  <ExternalLink size={20} /> Live Demo
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Projects() {
  const containerRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const cards = el.querySelectorAll('.project-card');

    // Smooth entrance using GSAP ScrollTrigger
    cards.forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedProject]);

  return (
    <section id="projects" className="min-h-screen py-24 px-6 md:px-20 relative z-10" ref={containerRef}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white whitespace-nowrap">
            <span className="text-primary font-mono text-xl md:text-2xl mr-2">02.</span> Projects
          </h2>
          <div className="h-[1px] bg-white/10 w-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {projectsData.map((project, i) => (
            <motion.div
              key={project.id}
              className={`project-card group cursor-pointer relative ${project.featured ? 'md:col-span-2' : ''}`}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedProject(project)}
            >
              {/* Outer Glow */}
              <div className="absolute -inset-1 bg-primary/20 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700 pointer-events-none" />

              <div className={`glass-card h-full border border-white/10 bg-surface/80 group-hover:bg-surface group-hover:border-primary/40 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-300 relative z-10 flex flex-col overflow-hidden ${project.featured ? 'md:flex-row' : ''}`}>

                {/* Image Section */}
                <div className={`relative overflow-hidden shrink-0 bg-black/50 ${project.featured ? 'md:w-[50%] min-h-[350px]' : 'w-full h-64'}`}>
                  <div className="absolute inset-0 bg-primary/20 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-500 z-10" />
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />
                </div>

                {/* Content Section */}
                <div className={`p-8 md:p-10 flex flex-col flex-1 ${project.featured ? 'justify-center' : ''}`}>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      {project.featured && <span className="text-primary font-mono text-xs tracking-wider uppercase mb-3 block font-bold">✨ Featured App</span>}
                      <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-primary transition-colors">{project.title}</h3>
                    </div>
                    <div className="p-2 bg-white/5 rounded-full group-hover:bg-primary/20 transition-colors border border-white/5 group-hover:border-primary/20">
                      <ChevronRight className="text-gray-400 group-hover:text-primary" />
                    </div>
                  </div>

                  <p className="text-gray-400 mb-8 max-w-2xl leading-relaxed group-hover:text-gray-300 transition-colors text-[15px] md:text-base">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tech.map(t => (
                      <span key={t} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-mono text-gray-300 group-hover:border-primary/30 group-hover:text-primary transition-colors">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  );
}
