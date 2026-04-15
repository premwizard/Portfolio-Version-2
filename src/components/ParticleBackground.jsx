import React, { useEffect, useRef } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 60; // Subtle density
    
    // Particle class defined outside useEffect to avoid linting warning
    const Particle = function() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      // Move slowly
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      // Rose gold / warm tones - use CSS variables or fallback
      const colors = [
        getComputedStyle(document.documentElement).getPropertyValue('--acc').trim(),
        getComputedStyle(document.documentElement).getPropertyValue('--acc2').trim(),
        getComputedStyle(document.documentElement).getPropertyValue('--pt').trim(),
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.size = Math.random() * 2;
      // Varied opacity (faint)
      this.alpha = Math.random() * 0.5 + 0.1;
    };
    
    Particle.prototype.update = function() {
      this.x += this.vx;
      this.y += this.vy;
      
      // Wrap around
      if (this.x < 0) this.x = w;
      if (this.x > w) this.x = 0;
      if (this.y < 0) this.y = h;
      if (this.y > h) this.y = 0;
    };
    
    Particle.prototype.draw = function() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      
      // Add soft glow
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      
      ctx.fill();
      ctx.restore();
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default ParticleBackground;
