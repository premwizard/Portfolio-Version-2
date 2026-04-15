import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';

const ROLES = [
  'AI Product Engineer',
  'Full Stack Developer',
  'UI/UX Designer',
];

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const fullText = 'PREM M';
  const [roleIndex, setRoleIndex] = useState(0);
  const [scrollIndicatorVisible, setScrollIndicatorVisible] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setDisplayText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 150);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setRoleIndex((i) => (i + 1) % ROLES.length);
    }, 2500);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const pastHero = rect.bottom < 120;
      setScrollIndicatorVisible(!pastHero);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pb-24 pt-20"
    >
      {/* Decorative Blur Backgrounds */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[120px] transition-colors duration-300" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-secondary/10 blur-[120px] transition-colors duration-300" />

      <div className="relative z-10 mx-auto max-w-3xl text-center sm:max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="mb-4 block text-xs font-medium uppercase tracking-widest text-primary sm:text-sm">
            Welcome to my world
          </span>
          <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="text-transparent bg-gradient-to-r from-primary via-warm to-platinum bg-clip-text text-glow">
              {displayText}
            </span>
            <span className="animate-pulse text-primary">|</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mb-10 flex flex-nowrap items-center justify-center gap-2 text-lg font-light md:text-xl transition-colors duration-300"
          style={{ lineHeight: 1 }}
        >
          <span className="shrink-0" style={{ lineHeight: 1, color: 'var(--txs)' }}>
            I am a
          </span>
          <span
            className="m-0 max-w-full p-0"
            style={{
              height: '1.4em',
              overflow: 'hidden',
              display: 'inline-flex',
              alignItems: 'center',
              lineHeight: 1,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={ROLES[roleIndex]}
                className="whitespace-nowrap"
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  color: 'var(--acc)',
                  lineHeight: 1,
                  transition: 'color 0.3s ease',
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              >
                {ROLES[roleIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
        >
          <a
            href="#projects"
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-6 py-3 font-semibold text-background transition-all duration-300 hover:shadow-[0_0_20px_var(--border2)] sm:w-auto"
          >
            <span className="relative z-10 flex items-center gap-2">
              View Projects{' '}
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </span>
          </a>
          <a
            href="#contact"
            className="flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 transition-all duration-300 sm:w-auto"
            style={{
              borderColor: 'var(--border)',
              border: '1px solid var(--border)',
              color: 'var(--tx)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--acc)';
              e.currentTarget.style.color = 'var(--tx-on-acc)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--tx)';
            }}
          >
            Contact Me <Download size={18} />
          </a>
        </motion.div>
      </div>

      <motion.div
        className="pointer-events-none absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollIndicatorVisible ? 1 : 0 }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        aria-hidden
      >
        <span
          className="uppercase"
          style={{ fontSize: 9, letterSpacing: '0.2em', color: 'var(--txm)', transition: 'color 0.3s ease' }}
        >
          SCROLL
        </span>
        <div
          className="relative mx-auto w-px overflow-visible transition-colors duration-300"
          style={{
            height: 40,
            backgroundColor: `color-mix(in srgb, var(--acc) 30%, transparent)`,
          }}
        >
          <motion.div
            className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full transition-colors duration-300"
            style={{ backgroundColor: 'var(--color-primary)' }}
            animate={{ y: [2, 30, 2] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
