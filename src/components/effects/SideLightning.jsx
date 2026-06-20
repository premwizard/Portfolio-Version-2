import React, { useEffect, useRef } from 'react';
import { createVolumetricBolt, random } from './lightningUtils';

const SideLightning = () => {
  const canvasRef = useRef(null);
  const boltsRef = useRef([]);
  const nextSpawnTimeRef = useRef(0);
  const animationFrameId = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);

    const isMobile = () => window.innerWidth < 768;

    const render = (time) => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn Logic: Wait 3 to 8 seconds between completely finished strikes
      // To ensure it completely disappears, we only spawn if boltsRef is empty, OR time has passed significantly
      if (time > nextSpawnTimeRef.current && boltsRef.current.length === 0) {
        boltsRef.current.push(createVolumetricBolt(canvas.width, canvas.height, isMobile()));
        
        const minDelay = isMobile() ? 5000 : 3000;
        const maxDelay = isMobile() ? 10000 : 8000;
        nextSpawnTimeRef.current = time + random(minDelay, maxDelay);
      }

      for (let i = boltsRef.current.length - 1; i >= 0; i--) {
        const bolt = boltsRef.current[i];
        bolt.currentFrame += 1;
        
        // Handle Visibility Lifecycle
        if (bolt.currentFrame > bolt.holdFrames) {
          bolt.opacity -= 0.03; // Smooth, rapid fade out
        }
        
        if (bolt.opacity <= 0) {
          boltsRef.current.splice(i, 1);
          continue;
        }

        const pulse = Math.abs(Math.sin(time * 0.05 + bolt.currentFrame * 0.1)); 
        const activeAlpha = bolt.opacity * (0.6 + pulse * 0.4);

        // --- EDGE ILLUMINATION ---
        ctx.globalCompositeOperation = 'screen';
        if (bolt.opacity > 0.1) {
          ctx.save();
          let gradient;
          
          if (bolt.originEdge === 0) { // Left
            gradient = ctx.createLinearGradient(0, 0, canvas.width * 0.3, 0);
          } else if (bolt.originEdge === 1) { // Right
            gradient = ctx.createLinearGradient(canvas.width, 0, canvas.width * 0.7, 0);
          } else { // Top
            gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.3);
          }
          
          const hexColor = bolt.color; 
          const r = parseInt(hexColor.slice(1, 3), 16);
          const g = parseInt(hexColor.slice(3, 5), 16);
          const b = parseInt(hexColor.slice(5, 7), 16);
          
          gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${activeAlpha * 0.15})`);
          gradient.addColorStop(1, 'rgba(0,0,0,0)');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.restore();
        }

        // --- LAYER 3: OUTER HAZE (Volumetric Fog) ---
        if (!isMobile()) {
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          
          // Large strikes get massive ambient fog
          const blurBoost = bolt.strikeType === 'Large' ? 40 : 0;
          ctx.shadowBlur = 60 + pulse * 20 + blurBoost;
          ctx.shadowColor = bolt.color;
          ctx.strokeStyle = bolt.color;
          ctx.globalAlpha = activeAlpha * (bolt.strikeType === 'Large' ? 0.15 : 0.1); 

          bolt.paths.forEach(p => {
            if (p.type === 'micro') return; 
            ctx.lineWidth = p.baseThickness * (bolt.strikeType === 'Large' ? 6 : 4);
            ctx.beginPath();
            ctx.moveTo(p.segments[0].x, p.segments[0].y);
            for (let j = 1; j < p.segments.length; j++) {
              ctx.lineTo(p.segments[j].x, p.segments[j].y);
            }
            ctx.stroke();
          });
          ctx.restore();
        }

        // --- LAYER 2: ENERGY PLASMA ---
        ctx.save();
        ctx.globalCompositeOperation = 'screen'; 
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowBlur = isMobile() ? 15 : 30;
        ctx.shadowColor = bolt.color;
        ctx.strokeStyle = bolt.color;
        ctx.globalAlpha = activeAlpha * 0.6;

        bolt.paths.forEach(p => {
          ctx.lineWidth = p.baseThickness * (1 + pulse * 0.5);
          ctx.beginPath();
          ctx.moveTo(p.segments[0].x, p.segments[0].y);
          for (let j = 1; j < p.segments.length; j++) {
            ctx.lineTo(p.segments[j].x, p.segments[j].y);
          }
          ctx.stroke();
        });
        ctx.restore();

        // --- LAYER 1: INNER CORE ---
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowBlur = 10;
        ctx.shadowColor = bolt.coreColor;
        ctx.strokeStyle = bolt.coreColor;
        ctx.globalAlpha = activeAlpha;

        bolt.paths.forEach(p => {
          ctx.lineWidth = p.type === 'trunk' ? 1.5 : (p.type === 'arc' ? 1.0 : 0.5);
          ctx.beginPath();
          ctx.moveTo(p.segments[0].x, p.segments[0].y);
          for (let j = 1; j < p.segments.length; j++) {
            ctx.lineTo(p.segments[j].x, p.segments[j].y);
          }
          ctx.stroke();
        });
        ctx.restore();

        // --- PARTICLES ---
        if (bolt.particles && bolt.particles.length > 0) {
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          
          for (let pIdx = bolt.particles.length - 1; pIdx >= 0; pIdx--) {
            const p = bolt.particles[pIdx];
            
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05; 
            p.life -= 0.02;
            
            // Link particle life to overall bolt opacity so they fade together
            const pAlpha = p.life * bolt.opacity;

            if (pAlpha > 0) {
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255, 255, 255, ${pAlpha})`;
              ctx.shadowBlur = 8;
              ctx.shadowColor = bolt.color;
              ctx.fill();
            } else {
              bolt.particles.splice(pIdx, 1);
            }
          }
          ctx.restore();
        }
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    nextSpawnTimeRef.current = performance.now() + 1000; 
    animationFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }} 
      aria-hidden="true"
    />
  );
};

export default SideLightning;
