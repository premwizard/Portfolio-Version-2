import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const LOGO = 'WELCOME';
const EASE_IN_OUT = [0.42, 0, 0.58, 1];

export default function LoadingScreen({ isLoading, onComplete }) {
  const [exitOverlay, setExitOverlay] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!isLoading) return undefined;
    const id = window.setTimeout(() => setExitOverlay(true), 2800);
    return () => window.clearTimeout(id);
  }, [isLoading]);

  if (!isLoading) return null;

  const letters = LOGO.split('');

  const handleOverlayAnimationComplete = () => {
    if (!exitOverlay || completedRef.current) return;
    completedRef.current = true;
    onComplete?.();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{ backgroundColor: 'var(--bg)' }}
      initial={{ opacity: 1, scale: 1 }}
      animate={
        exitOverlay
          ? { opacity: 0, scale: 1.02 }
          : { opacity: 1, scale: 1 }
      }
      transition={{ duration: 0.5, ease: EASE_IN_OUT }}
      onAnimationComplete={handleOverlayAnimationComplete}
    >
      <div
        className="flex flex-col items-center gap-8 px-6"
        aria-busy="true"
        aria-label="Loading"
      >
        <div
          className="flex flex-wrap justify-center"
          style={{
            fontSize: 18,
            gap: '0.3em',
            color: 'var(--tx)',
          }}
        >
          {letters.map((char, i) => (
            <motion.span
              key={`${char}-${i}`}
              className="inline-block"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.04,
                duration: 0.45,
                ease: EASE_IN_OUT,
              }}
            >
              {char === ' ' ? '\u00a0' : char}
            </motion.span>
          ))}
        </div>

        <div
          className="overflow-hidden rounded-full"
          style={{
            width: 200,
            height: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
          }}
        >
          <motion.div
            className="h-full w-full rounded-full origin-left"
            style={{ backgroundColor: 'var(--acc)' }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: 2.2,
              ease: EASE_IN_OUT,
            }}
          />
        </div>

        <motion.p
          className="uppercase"
          style={{
            fontSize: 10,
            letterSpacing: '0.2em',
            color: 'var(--txs)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5, ease: EASE_IN_OUT }}
        >
          Loading experience...
        </motion.p>
      </div>
    </motion.div>
  );
}
