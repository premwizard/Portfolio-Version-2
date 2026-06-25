import React from 'react';

const GRADIENTS = [
  {
    from: 'from-[#d4967a]',
    to: 'to-[#c8845e]',
    text: 'text-[#080507]',
    glow: 'shadow-[0_0_15px_rgba(212,150,122,0.5)]',
    border: 'border-[#d4967a]/40'
  },
  {
    from: 'from-[#8e2de2]',
    to: 'to-[#4a00e0]',
    text: 'text-white',
    glow: 'shadow-[0_0_15px_rgba(142,45,226,0.5)]',
    border: 'border-[#8e2de2]/40'
  },
  {
    from: 'from-[#00c6ff]',
    to: 'to-[#0072ff]',
    text: 'text-white',
    glow: 'shadow-[0_0_15px_rgba(0,198,255,0.5)]',
    border: 'border-[#00c6ff]/40'
  },
  {
    from: 'from-[#f857a6]',
    to: 'to-[#ff5858]',
    text: 'text-white',
    glow: 'shadow-[0_0_15px_rgba(248,87,166,0.5)]',
    border: 'border-[#f857a6]/40'
  },
  {
    from: 'from-[#11998e]',
    to: 'to-[#38ef7d]',
    text: 'text-[#080507]',
    glow: 'shadow-[0_0_15px_rgba(56,239,125,0.5)]',
    border: 'border-[#38ef7d]/40'
  },
  {
    from: 'from-[#f7971e]',
    to: 'to-[#ffd200]',
    text: 'text-[#080507]',
    glow: 'shadow-[0_0_15px_rgba(247,151,30,0.5)]',
    border: 'border-[#f7971e]/40'
  },
  {
    from: 'from-[#ea384d]',
    to: 'to-[#d31027]',
    text: 'text-white',
    glow: 'shadow-[0_0_15px_rgba(234,56,77,0.5)]',
    border: 'border-[#ea384d]/40'
  }
];

const getGradient = (name) => {
  if (!name) return GRADIENTS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
};

const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

const Avatar = ({ name, size = 'lg', isActive = true }) => {
  const initials = getInitials(name);
  const theme = getGradient(name);

  // Define sizes matching existing design
  const sizeClasses = size === 'sm' 
    ? 'w-8 h-8 text-xs border' 
    : 'w-16 h-16 text-2xl border-2 mb-4';

  return (
    <div
      className={`
        relative
        rounded-full
        flex
        items-center
        justify-center
        font-bold
        select-none
        overflow-hidden
        transition-all
        duration-300
        hover:scale-105
        ${sizeClasses}
        ${isActive 
          ? `bg-gradient-to-tr ${theme.from} ${theme.to} ${theme.text} ${theme.border} ${theme.glow}` 
          : 'bg-white/5 text-[var(--acc, #d4967a)] border-white/10 hover:bg-white/10'
        }
      `}
    >
      {/* Subtle overlay reflection for a glass-like premium feel */}
      <span className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-full" />
      
      {/* Dynamic Initials */}
      <span className="relative z-10 tracking-wider font-extrabold">{initials}</span>
    </div>
  );
};

export default Avatar;
