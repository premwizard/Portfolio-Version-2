import { useEffect, useState, useRef } from 'react';

const COLORS = ['#fce8e0', '#e8b4a0', '#c9758a', '#b05060', '#d4906e'];

/** Rose gold sparkle burst trail; hides system cursor on fine-pointer desktop. */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const lastBurstRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const apply = () => {
      const ok = mq.matches;
      setEnabled(ok);
      document.documentElement.classList.toggle('custom-cursor-on', ok);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => {
      mq.removeEventListener('change', apply);
      document.documentElement.classList.remove('custom-cursor-on');
    };
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    const spawnBurst = (e) => {
      for (let i = 0; i < 5; i++) {
        const s = document.createElement('div');
        s.className = 'spark';
        const size = Math.random() * 12 + 8;
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 48 + 22;
        s.style.cssText = `
          width:${size}px;
          height:${size}px;
          left:${e.clientX - size / 2}px;
          top:${e.clientY - size / 2}px;
          background:${COLORS[Math.floor(Math.random() * COLORS.length)]};
          --tx:${Math.cos(angle) * dist}px;
          --ty:${Math.sin(angle) * dist}px;
        `;
        document.body.appendChild(s);
        window.setTimeout(() => s.remove(), 700);
      }
    };

    const onMouseMove = (e) => {
      const now = performance.now();
      if (now - lastBurstRef.current < 45) return;
      lastBurstRef.current = now;
      spawnBurst(e);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [enabled]);

  return null;
}
