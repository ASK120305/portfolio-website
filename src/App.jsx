import { useState, Suspense, lazy } from 'react';
import Loader from './components/Loader';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';

// Lazy load the 3D canvases for performance
const BackgroundCanvas = lazy(() => import('./components/BackgroundCanvas'));
const KatanaCanvas = lazy(() => import('./components/KatanaCanvas'));

export default function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <>
      <CustomCursor />
      <Navbar />
      
      {!loadingComplete && (
        <Loader onComplete={() => setLoadingComplete(true)} />
      )}

      {/* Render main content even when loading so it's ready, but hide under loader */}
      <div className="relative min-h-screen bg-background">
        {loadingComplete && (
          <>
            <Suspense fallback={null}>
              <BackgroundCanvas />
            </Suspense>
            <Suspense fallback={null}>
              <KatanaCanvas />
            </Suspense>
          </>
        )}
        
        {/* Main scrollable container */}
        <main className={`relative z-10 transition-opacity duration-1000 ${loadingComplete ? 'opacity-100' : 'opacity-0'}`}>
          <Hero />
          <About />
          <Projects />
          <Skills />
          <Contact />
        </main>
      </div>
    </>
  );
}
