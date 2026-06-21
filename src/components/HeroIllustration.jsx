import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

// --- AI PARTICLE NETWORK ---
const ParticleNetwork = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Handle Resize
    const setSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    setSize();
    window.addEventListener('resize', setSize);

    // Particle logic
    const particles = [];
    const numParticles = 80; // Dense enough for neural feel, sparse enough for clean look
    const connectionDistance = 140;
    const mouseConnectionDistance = 200;

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.5
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

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < numParticles; i++) {
        let p = particles[i];
        
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 154, 90, 0.6)';
        ctx.fill();

        // Mouse interaction (draw line to mouse + gentle repulsion)
        const dxMouse = p.x - mouse.x;
        const dyMouse = p.y - mouse.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        
        if (distMouse < mouseConnectionDistance) {
           // Subtle mouse repulsion / parallax effect
           p.x += dxMouse * 0.005;
           p.y += dyMouse * 0.005;

           ctx.beginPath();
           ctx.moveTo(p.x, p.y);
           ctx.lineTo(mouse.x, mouse.y);
           const opacity = 0.3 - (distMouse / mouseConnectionDistance) * 0.3;
           ctx.strokeStyle = `rgba(255, 154, 90, ${opacity})`;
           ctx.lineWidth = 0.8;
           ctx.stroke();
        }

        // Draw connections to other particles
        for (let j = i + 1; j < numParticles; j++) {
          let p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const opacity = 0.15 - (dist / connectionDistance) * 0.15;
            ctx.strokeStyle = `rgba(255, 154, 90, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', setSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto z-10" />;
};

// --- GLOWING ORBS BACKGROUND ---
const GlowingOrbs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[2.5rem] z-0">
      <motion.div 
        className="absolute w-[400px] h-[400px] bg-[#FF9A5A]/20 rounded-full blur-[100px] mix-blend-screen"
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 50, 0],
          scale: [1, 1.2, 0.9, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: '0%', left: '10%' }}
      />
      <motion.div 
        className="absolute w-[350px] h-[350px] bg-[#FF7034]/15 rounded-full blur-[100px] mix-blend-screen"
        animate={{
          x: [0, -70, 60, 0],
          y: [0, 50, -40, 0],
          scale: [1, 0.8, 1.1, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        style={{ bottom: '0%', right: '5%' }}
      />
    </div>
  );
};

// --- EXPORTED COMPONENT ---
const HeroIllustration = () => {
  return (
    <div className="relative w-full aspect-square flex items-center justify-center max-w-[600px] mx-auto">
      <div className="relative z-10 w-full h-full">
        {/* Soft floating blurred gradient orbs */}
        <GlowingOrbs />

        {/* Neural Network HTML5 Canvas */}
        <ParticleNetwork />

        {/* Deep atmospheric gradients so the container blends entirely into the dark theme */}
        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-t from-background via-transparent to-transparent opacity-90 pointer-events-none z-20" />
        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-background via-transparent to-transparent opacity-60 pointer-events-none z-20" />
        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-r from-background via-transparent to-transparent opacity-80 pointer-events-none z-20" />
        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-l from-background via-transparent to-transparent opacity-80 pointer-events-none z-20" />
        
        {/* Extra central radial gradient to completely obscure any sharp edges */}
        <div className="absolute inset-0 rounded-[2.5rem] pointer-events-none z-20" style={{ background: 'radial-gradient(circle, transparent 40%, var(--background) 100%)' }} />
      </div>
    </div>
  );
};

export default HeroIllustration;
