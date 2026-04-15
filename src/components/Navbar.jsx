import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const SECTION_IDS = [
  'home',
  'about',
  'journey',
  'skills-carousel',
  'projects',
  'certificates',
  'contact',
];

const NAV_LINKS = [
  { label: 'About', sectionId: 'about', href: '#about' },
  { label: 'Journey', sectionId: 'journey', href: '#journey' },
  { label: 'Skills', sectionId: 'skills-carousel', href: '#skills-carousel' },
  { label: 'Certificates', sectionId: 'certificates', href: '#certificates' },
  { label: 'Projects', sectionId: 'projects', href: '#projects' },
  { label: 'Contact', sectionId: 'contact', href: '#contact' },
];

function pickActiveSection(ratios) {
  const pairs = [...ratios.entries()].filter(([el]) => el?.isConnected);
  const overHalf = pairs.filter(([, r]) => r >= 0.5);
  const pool = overHalf.length ? overHalf : pairs;
  let bestId = 'home';
  let bestR = -1;
  for (const [el, r] of pool) {
    if (r > bestR) {
      bestR = r;
      bestId = el.id || 'home';
    }
  }
  return bestId;
}

function updateScrollProgress(setter) {
  const doc = document.documentElement;
  const total = doc.scrollHeight - window.innerHeight;
  const p = total > 0 ? window.scrollY / total : 0;
  setter(Math.min(1, Math.max(0, p)));
}

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ratiosRef = useRef(new Map());

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    const onScroll = () => {
      updateScrollProgress(setScrollProgress);
      setScrolled(window.scrollY > 10);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ratios = ratiosRef.current;
    const thresholds = Array.from({ length: 101 }, (_, i) => i / 100);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        ratios.set(entry.target, entry.intersectionRatio);
      });
      setActiveSection(pickActiveSection(ratios));
    }, { threshold: thresholds });

    const raf = requestAnimationFrame(() => {
      SECTION_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      ratios.clear();
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-[1] h-0.5 w-full overflow-hidden bg-transparent">
        <motion.div
          className="h-full"
          style={{ width: `${scrollProgress * 100}%`, backgroundColor: 'var(--color-primary)' }}
          aria-hidden
        />
      </div>

      <div
        className={`relative border-b transition-colors duration-300 backdrop-blur-md`}
        style={{
          borderColor: 'var(--color-border)',
          backgroundColor: `color-mix(in srgb, var(--color-background) 90%, transparent)`,
        }}
      >
        <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-8 py-5">


          <LayoutGroup id="nav-links">
            <nav className="absolute left-1/2 hidden -translate-x-1/2 md:flex md:items-center md:gap-8">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.sectionId;
                return (
                  <a
                    key={link.sectionId}
                    href={link.href}
                    className="relative py-2 text-sm tracking-[0.1em] transition-colors duration-300"
                    style={{
                      color: activeSection === link.sectionId ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    }}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-0 right-0 h-[2px]"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                );
              })}
            </nav>
          </LayoutGroup>

          <div className="flex shrink-0 items-center gap-3">
            <ThemeToggle />

            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center md:hidden"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((o) => !o)}
            >
              <motion.span
                className="absolute left-1/2 top-1/2 block h-0.5 w-5 -translate-x-1/2 rounded-full"
                style={{ backgroundColor: 'var(--color-text-secondary)' }}
                animate={
                  mobileOpen
                    ? { y: 0, rotate: 45 }
                    : { y: -5, rotate: 0 }
                }
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              />
              <motion.span
                className="absolute left-1/2 top-1/2 block h-0.5 w-5 -translate-x-1/2 rounded-full"
                style={{ backgroundColor: 'var(--color-text-secondary)' }}
                animate={
                  mobileOpen
                    ? { opacity: 0, scaleX: 0 }
                    : { opacity: 1, scaleX: 1 }
                }
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              />
              <motion.span
                className="absolute left-1/2 top-1/2 block h-0.5 w-5 -translate-x-1/2 rounded-full"
                style={{ backgroundColor: 'var(--color-text-secondary)' }}
                animate={
                  mobileOpen
                    ? { y: 0, rotate: -45 }
                    : { y: 5, rotate: 0 }
                }
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              key="nav-drawer-backdrop"
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-[60] backdrop-blur-sm md:hidden transition-colors duration-300"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeMobile}
            />
            <motion.aside
              key="nav-drawer-panel"
              className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm flex-col backdrop-blur-xl md:hidden transition-colors duration-300"
              style={{
                borderLeft: '1px solid var(--color-border)',
                backgroundColor: `color-mix(in srgb, var(--color-background) 90%, transparent)`,
              }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              <div className="flex flex-1 flex-col gap-1 px-8 pb-8 pt-20">
                {NAV_LINKS.map((link) => {
                  const isActive = activeSection === link.sectionId;
                  return (
                    <a
                      key={link.sectionId}
                      href={link.href}
                      onClick={closeMobile}
                      className="border-b py-4 text-sm tracking-[0.12em] transition-colors duration-300"
                      style={{
                        borderColor: 'var(--color-border)',
                        color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                      }}
                    >
                      {link.label}
                    </a>
                  );
                })}
              </div>
              <div className="border-t p-8 transition-colors duration-300"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <a
                  href="#contact"
                  onClick={closeMobile}
                  className="flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors duration-300"
                  style={{
                    borderColor: 'var(--color-primary)',
                    border: `1px solid var(--color-primary)`,
                    color: 'var(--color-primary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                    e.currentTarget.style.color = 'var(--color-background)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--color-primary)';
                  }}
                >
                  Hire me
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
