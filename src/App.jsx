import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaGithub, FaLinkedinIn, FaYoutube, FaXTwitter,  } from 'react-icons/fa6';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Journey from './components/Journey';
import SkillsCarousel from './components/SkillsCarousel';
import Certificates from './components/Certificates';
import Projects from './components/Projects';
import Contact from './components/Contact';
import ParticleBackground from './components/ParticleBackground';
import CustomCursor from './components/CustomCursor';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.history.scrollRestoration = "manual";

    // Handle URL hash on initial load
    if (window.location.hash) {
      window.location.hash = '';
    }

    window.scrollTo({
      top: 0,
      behavior: "instant"
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-platinum relative selection:bg-primary/30 transition-colors duration-300"
      style={{ selectionBackgroundColor: 'var(--color-primary)', selectionColor: '#b8ccd8' }}
    >
      <CustomCursor />
      <div className="noise-bg"></div>
      <ParticleBackground />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen
            key="loading"
            isLoading
            onComplete={() => setIsLoading(false)}
          />
        ) : (
          <motion.div
            key="main"
            className="relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.42, 0, 0.58, 1] }}
          >
            <Navbar />
            <main>
              <Hero />
              <About />
              <Journey />
              <SkillsCarousel />
              <Certificates />
              <Projects />
              <Contact />
            </main>

            <footer className="bg-[var(--bg)] border-t border-[var(--acc)]/15 mt-20">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--acc)] to-transparent"></div>
              <motion.div
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {/* Bottom row: Copyright + License + Social Icons */}
                <div className="flex flex-col gap-4 items-center sm:flex-row sm:items-center sm:justify-between text-center sm:text-left">
                  <div>
                    <div className="h-px w-16 bg-[var(--acc)]/20 mx-auto mb-4"></div>
                    <p className="text-[var(--acc)] text-sm mb-2">
                      © {new Date().getFullYear()} Prem M. All rights reserved.
                    </p>
                    <p className="text-[var(--acc)] text-sm">
                      Released under the MIT License · Built with React & Tailwind CSS
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href="https://github.com/premwizard"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                      className="group relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--surf)] to-[var(--bg)] border border-[var(--acc)]/20 shadow-[0_2px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_0_18px_rgba(255,182,193,0.35)] hover:border-[var(--acc)]/60 transition-all duration-300"
                    >
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--acc)] opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300 shadow-[0_0_6px_rgba(255,182,193,0.8)]" />
                      <FaGithub size={20} className="text-[var(--acc)]/60 group-hover:text-[var(--acc)] transition-colors duration-300" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/m-prem/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="group relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--surf)] to-[var(--bg)] border border-[var(--acc)]/20 shadow-[0_2px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_0_18px_rgba(255,182,193,0.35)] hover:border-[var(--acc)]/60 transition-all duration-300"
                    >
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--acc)] opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300 shadow-[0_0_6px_rgba(255,182,193,0.8)]" />
                      <FaLinkedinIn size={20} className="text-[var(--acc)]/60 group-hover:text-[var(--acc)] transition-colors duration-300" />
                    </a>
                    <a
                      href="https://x.com/MPrem2222"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter"
                      className="group relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--surf)] to-[var(--bg)] border border-[var(--acc)]/20 shadow-[0_2px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_0_18px_rgba(255,182,193,0.35)] hover:border-[var(--acc)]/60 transition-all duration-300"
                    >
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--acc)] opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300 shadow-[0_0_6px_rgba(255,182,193,0.8)]" />
                      <FaXTwitter size={20} className="text-[var(--acc)]/60 group-hover:text-[var(--acc)] transition-colors duration-300" />
                    </a>

                    <a
                      href="https://www.youtube.com/@InfinityAILabs-c7b"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="YouTube"
                      className="group relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--surf)] to-[var(--bg)] border border-[var(--acc)]/20 shadow-[0_2px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_0_18px_rgba(255,182,193,0.35)] hover:border-[var(--acc)]/60 transition-all duration-300"
                    >
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--acc)] opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300 shadow-[0_0_6px_rgba(255,182,193,0.8)]" />
                      <FaYoutube size={20} className="text-[var(--acc)]/60 group-hover:text-[var(--acc)] transition-colors duration-300" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
