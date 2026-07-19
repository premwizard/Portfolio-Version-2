import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';

import HeroIllustration from './HeroIllustration';

const ROLES = [
  'AI Product Engineer',
  'Full Stack Developer',
  'UI/UX Designer',
];

const MagneticButton = ({ children, className, href, style }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.25, y: middleY * 0.25 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.a
      href={href}
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
      style={style}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.a>
  );
};

const MicroParticles = () => {
  const particles = React.useMemo(() => {
    /* eslint-disable react-hooks/purity */
    return [...Array(20)].map(() => ({
      width: Math.random() * 2 + 1 + 'px',
      height: Math.random() * 2 + 1 + 'px',
      left: `${50 + Math.random() * 50}%`,
      top: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.5 + 0.1,
      animY: [0, -100 - Math.random() * 100],
      animX: [0, (Math.random() - 0.5) * 50],
      animOpacity: [0, Math.random() * 0.5 + 0.2, 0],
      duration: 5 + Math.random() * 5,
      delay: Math.random() * 5
    }));
    /* eslint-enable react-hooks/purity */
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#FF9A5A] shadow-[0_0_8px_rgba(255,154,90,0.8)]"
          style={{ width: p.width, height: p.height, left: p.left, top: p.top, opacity: p.opacity }}
          animate={{ y: p.animY, x: p.animX, opacity: p.animOpacity }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay }}
        />
      ))}
    </div>
  );
};

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const fullText = 'PREM M';
  const [roleIndex, setRoleIndex] = useState(0);
  const [scrollIndicatorVisible, setScrollIndicatorVisible] = useState(true);
  const sectionRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    let currentText = '';
    let isDeleting = false;
    let timer;

    const loopTyping = () => {
      if (!isDeleting && currentText === fullText) {
        timer = setTimeout(() => {
          isDeleting = true;
          loopTyping();
        }, 3000); // Wait 3 seconds before erasing
      } else if (isDeleting && currentText === '') {
        timer = setTimeout(() => {
          isDeleting = false;
          loopTyping();
        }, 800); // Wait a bit before typing again
      } else {
        currentText = isDeleting
          ? fullText.slice(0, currentText.length - 1)
          : fullText.slice(0, currentText.length + 1);

        setDisplayText(currentText);

        const speed = isDeleting ? 75 : 150 + Math.random() * 100;
        timer = setTimeout(loopTyping, speed);
      }
    };

    timer = setTimeout(loopTyping, 500);

    return () => clearTimeout(timer);
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

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pb-24 pt-20 transition-colors duration-300"
    >
      {/* Ambient background glows inherited and enhanced */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Soft orange glow on right side - Theme adaptive */}
        <div className="absolute top-0 right-0 h-full w-[60%] bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-[var(--acc)]/15 via-[var(--acc)]/5 to-transparent blur-[80px] transition-colors duration-300" />
      </div>

      {/* 2. Mouse Glow Effect - Preserved as requested */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-0 mix-blend-screen transition-opacity duration-300"
        animate={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, color-mix(in srgb, var(--acc) 4%, transparent), transparent 40%)`
        }}
      />

      {/* Note: The main background color, noise texture, and micro particles 
          are now seamlessly inherited from the global App.jsx theme (ParticleBackground and .noise-bg),
          matching the About Me section exactly in both Light and Dark mode. */}

      <div className="relative z-10 mx-auto w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between min-h-[80vh] pointer-events-none gap-8">
        {/* Content Wrapper */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left mt-8 lg:mt-0 pointer-events-auto max-w-2xl w-full shrink-0">
          <div className="w-full">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="mb-4 block text-xs font-semibold uppercase tracking-[0.3em] text-[#FF9A5A] sm:text-sm"
            >
              Welcome to my world
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="mb-6 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl tracking-tight"
            >
              <span className="text-[#E88A5B] drop-shadow-[0_0_15px_rgba(200,169,107,0.3)]">
                {displayText}
              </span>
              <span className="animate-pulse text-[#E88A5B] ml-1">|</span>
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="mb-10 flex flex-nowrap items-center justify-center lg:justify-start gap-3 text-lg font-light md:text-xl text-neutral-400 transition-colors duration-300 w-full"
            style={{ lineHeight: 1 }}
          >
            <span className="shrink-0" style={{ lineHeight: 1 }}>
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
                  className="whitespace-nowrap font-medium text-[#C8A96B]"
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                    lineHeight: 1,
                  }}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {ROLES[roleIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.div>

          {/* 6. Button Hover Enhancement (Magnetic) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="flex flex-col w-full sm:w-auto items-center justify-center lg:justify-start gap-4 sm:flex-row sm:gap-6"
          >
            <MagneticButton
              href="#projects"
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[#FF9A5A] px-8 py-4 font-semibold text-[#050505] transition-all duration-300 shadow-[0_0_20px_rgba(255,154,90,0.3)] hover:shadow-[0_0_35px_rgba(255,154,90,0.5)] sm:w-auto"
            >
              <span className="relative z-10 flex items-center gap-2">
                View Projects{' '}
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </MagneticButton>

            <MagneticButton
              href="#contact"
              className="flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 transition-all duration-300 sm:w-auto bg-white/5 backdrop-blur-md hover:bg-white/10"
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
              }}
            >
              Contact Me <Download size={18} />
            </MagneticButton>
          </motion.div>
        </div>

        {/* 7. Improve Right-Side Animation */}
        <div className="hidden lg:flex w-full flex-1 items-center justify-center pointer-events-auto">
          <HeroIllustration />
        </div>
      </div>

      <motion.div
        className="pointer-events-none absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollIndicatorVisible ? 1 : 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden
      >
        <span
          className="uppercase"
          style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', transition: 'color 0.3s ease' }}
        >
          SCROLL
        </span>
        <div
          className="relative mx-auto w-px overflow-visible transition-colors duration-300"
          style={{
            height: 40,
            backgroundColor: `rgba(255,154,90,0.2)`,
          }}
        >
          <motion.div
            className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full transition-colors duration-300 shadow-[0_0_10px_rgba(255,154,90,0.8)]"
            style={{ backgroundColor: '#FF9A5A' }}
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
