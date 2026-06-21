import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// --- AI PARTICLE NETWORK ---
const ParticleNetwork = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Theme observer for Canvas rendering
    let isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
    const themeObserver = new MutationObserver(() => {
      isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // Handle Resize
    const setSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    setSize();
    window.addEventListener('resize', setSize);

    // Layer 2: Main Neural Particles
    const particles = [];
    const numParticles = 130; 
    const connectionDistance = 160;
    const mouseConnectionDistance = 220;

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 0.8,
        baseAlpha: Math.random() * 0.5 + 0.3
      });
    }

    // Layer 3: Micro Bright Floating Particles
    const microParticles = [];
    const numMicro = 60;
    for (let i = 0; i < numMicro; i++) {
      microParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.1,
        vy: -Math.random() * 0.4 - 0.1, 
        radius: Math.random() * 1.2 + 0.3,
        alpha: Math.random() * 0.7 + 0.3
      });
    }

    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    let time = 0;

    const draw = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- THEME COLORS ---
      const cLines = isLightMode ? '217, 119, 6' : '255, 160, 100'; // #D97706 or Dark Orange
      const cMouse = isLightMode ? '234, 88, 12' : '255, 180, 120'; // #EA580C or Peach
      const cBloom = isLightMode ? '217, 119, 6' : '255, 160, 100'; // #D97706 or Dark Orange
      const cCore = isLightMode ? '194, 65, 12' : '255, 230, 200'; // #C2410C or Bright Peach
      const cMicro = isLightMode ? '217, 119, 6' : '255, 210, 150'; // #D97706 or Gold
      
      // Increased opacity multipliers for light mode to improve contrast
      const opMult = isLightMode ? 1.5 : 1;

      // Draw connections first so they render under the bright particle cores
      for (let i = 0; i < numParticles; i++) {
        let p = particles[i];

        // Connections to other particles
        for (let j = i + 1; j < numParticles; j++) {
          let p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            
            let baseOp = 0.25 - (dist / connectionDistance) * 0.25;
            baseOp *= opMult; // Boost visibility
            const pulse = (Math.sin(time * 2 + p.x * 0.01) + 1) * 0.1 * opMult;
            
            ctx.strokeStyle = `rgba(${cLines}, ${baseOp + pulse})`;
            ctx.lineWidth = isLightMode ? 1.2 : 0.8; // Thicker lines in light mode
            ctx.stroke();
          }
        }

        // Mouse connection & interaction
        const dxMouse = p.x - mouse.x;
        const dyMouse = p.y - mouse.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        
        if (distMouse < mouseConnectionDistance) {
           p.x += dxMouse * 0.002;
           p.y += dyMouse * 0.002;

           ctx.beginPath();
           ctx.moveTo(p.x, p.y);
           ctx.lineTo(mouse.x, mouse.y);
           const opacity = (0.4 - (distMouse / mouseConnectionDistance) * 0.4) * opMult;
           ctx.strokeStyle = `rgba(${cMouse}, ${opacity})`;
           ctx.lineWidth = isLightMode ? 1.8 : 1.2;
           ctx.stroke();
        }
      }

      // Draw Main Particles with native Canvas Bloom
      for (let i = 0; i < numParticles; i++) {
        let p = particles[i];
        
        // Move with ambient drifting
        p.x += p.vx + Math.sin(time + p.y * 0.01) * 0.2;
        p.y += p.vy + Math.cos(time + p.x * 0.01) * 0.2;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Outer Bloom
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
        const bloomAlpha = Math.min(1, p.baseAlpha * opMult);
        grad.addColorStop(0, `rgba(${cBloom}, ${bloomAlpha})`);
        grad.addColorStop(1, `rgba(${cBloom}, 0)`);
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Solid Core
        ctx.beginPath();
        const coreRadius = isLightMode ? p.radius * 0.9 : p.radius * 0.6; // Slightly larger core in light mode
        ctx.arc(p.x, p.y, coreRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cCore}, ${Math.min(1, p.baseAlpha + 0.4)})`;
        ctx.fill();
      }

      // Draw Micro Bright Floating Particles
      for (let i = 0; i < numMicro; i++) {
        let mp = microParticles[i];
        mp.x += mp.vx + Math.sin(time * 2 + mp.y * 0.05) * 0.1;
        mp.y += mp.vy;

        // Wrap around vertically
        if (mp.y < -10) mp.y = canvas.height + 10;
        if (mp.x < -10) mp.x = canvas.width + 10;
        if (mp.x > canvas.width + 10) mp.x = -10;

        ctx.beginPath();
        const mRadius = isLightMode ? mp.radius * 1.5 : mp.radius;
        ctx.arc(mp.x, mp.y, mRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cMicro}, ${Math.min(1, mp.alpha * opMult)})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      themeObserver.disconnect();
      window.removeEventListener('resize', setSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto z-20" />;
};

// --- MULTI-LAYER GLOWS ---
const GlowingOrbs = ({ isLightMode }) => {
  return (
    <>
      {/* Light Mode Specific Subtly Tinted Contrast Layer */}
      {isLightMode && (
        <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,_#fcebd7_0%,_transparent_75%)] opacity-80" />
      )}

      {/* Layer 1: Large soft background glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div 
          className={`absolute w-[500px] h-[500px] rounded-full blur-[140px] transition-colors duration-700 ${isLightMode ? 'bg-[#D97706]/20' : 'bg-[var(--acc)]/30'}`}
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -80, 60, 0],
            scale: [1, 1.1, 0.95, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: '-10%', left: '5%' }}
        />
        <motion.div 
          className={`absolute w-[450px] h-[450px] rounded-full blur-[120px] transition-colors duration-700 ${isLightMode ? 'bg-[#EA580C]/15' : 'bg-[var(--acc2)]/25'}`}
          animate={{
            x: [0, -80, 70, 0],
            y: [0, 60, -50, 0],
            scale: [1, 0.85, 1.15, 1]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          style={{ bottom: '-5%', right: '-5%' }}
        />
      </div>

      {/* Layer 4: Foreground subtle highlight glow */}
      <div className="absolute inset-0 pointer-events-none z-30">
        <motion.div 
          className={`absolute w-[200px] h-[200px] rounded-full blur-[80px] transition-colors duration-700 ${isLightMode ? 'bg-[#B45309]/15' : 'bg-[#FFD700]/10'}`}
          animate={{
            x: [0, -40, 40, 0],
            y: [0, 40, -40, 0],
            scale: [1, 1.5, 0.8, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: '30%', left: '30%' }}
        />
      </div>
    </>
  );
};

// --- EXPORTED COMPONENT ---
const HeroIllustration = () => {
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsLightMode(document.documentElement.getAttribute('data-theme') === 'light');
    };
    
    // Initial check
    checkTheme();

    // Observe theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full aspect-square flex items-center justify-center max-w-[850px] mx-auto pointer-events-none">
      <div 
        className="relative z-10 w-full h-full"
        style={{ 
          maskImage: 'radial-gradient(circle at center, black 35%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 35%, transparent 75%)'
        }}
      >
        {/* Layer 1 & Layer 4: Soft floating blurred gradient orbs & foreground highlights */}
        <GlowingOrbs isLightMode={isLightMode} />

        {/* Layer 2 & Layer 3: Neural Network HTML5 Canvas & Micro Particles */}
        <ParticleNetwork />
      </div>
    </div>
  );
};

export default HeroIllustration;
