import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

const Testimonials = () => {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data);
    } catch (error) {
      console.error('Failed to load testimonials', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleNext = () => {
    if (testimonials.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex, testimonials]);

  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const currentTestimonial = testimonials[currentIndex];

  if (isLoading) {
    return (
      <section id="testimonials" className="py-20 flex justify-center items-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-[var(--acc)] border-t-transparent rounded-full animate-spin"></div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section id="testimonials" className="py-20 px-4 md:px-8 max-w-7xl mx-auto text-center relative z-10" style={{ color: 'var(--tx, #f0ece8)' }}>
        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--acc, #d4967a)' }}>Testimonials</h2>
        <p className="text-lg opacity-80 mb-8" style={{ color: 'var(--pt, #b8ccd8)' }}>Be the first to leave a review!</p>
        <button 
          onClick={() => navigate('/review')}
          className="px-8 py-4 rounded-xl font-bold text-[#080507] hover:scale-105 transition-transform"
          style={{ backgroundColor: 'var(--acc, #d4967a)' }}
        >
          Write a Review
        </button>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-20 px-4 md:px-8 max-w-7xl mx-auto relative z-10" style={{ backgroundColor: 'transparent', color: 'var(--tx, #f0ece8)' }}>
      
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--acc, #d4967a)' }}>Testimonials </h2>
        <p className="text-lg opacity-80" style={{ color: 'var(--pt, #b8ccd8)' }}>What others say about working with me</p>
      </div>

      {/* Featured Spotlight Card */}
      <div className="relative mb-12 flex justify-center">
        {/* Radial Glow Background */}
        <div className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none">
          <div className="w-[60%] h-[60%] rounded-full blur-[100px] opacity-20" style={{ backgroundColor: 'var(--acc, #d4967a)' }}></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl p-8 md:p-12 rounded-3xl border border-white/10 backdrop-blur-md bg-white/5 shadow-2xl flex flex-col items-center text-center overflow-hidden">
           <FaQuoteLeft className="text-6xl md:text-8xl absolute top-4 left-6 opacity-10" style={{ color: 'var(--acc2, #c8845e)' }} />
           
           <AnimatePresence mode="wait">
             <motion.div
               key={currentIndex}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               transition={{ duration: 0.5 }}
               className="flex flex-col items-center w-full"
             >
               <div className="flex gap-1 mb-6">
                 {[...Array(currentTestimonial.rating)].map((_, i) => (
                   <FaStar key={i} style={{ color: 'var(--acc, #d4967a)' }} className="text-xl" />
                 ))}
               </div>

               <p className="text-xl md:text-3xl font-medium leading-relaxed mb-10 italic">
                 "{currentTestimonial?.feedback || currentTestimonial?.text}"
               </p>

               <div className="flex flex-col items-center">
                 <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-lg border-2 border-transparent bg-gradient-to-tr from-[#d4967a] to-[#c8845e] text-[#080507]">
                   {getInitials(currentTestimonial.name)}
                 </div>
                 <h4 className="text-xl font-bold" style={{ color: 'var(--pt, #b8ccd8)' }}>{currentTestimonial.name}</h4>
                 <p className="text-sm opacity-70">{currentTestimonial.role} {currentTestimonial.company && `at ${currentTestimonial.company}`}</p>
               </div>
             </motion.div>
           </AnimatePresence>
        </div>
      </div>

      {/* Infinite Testimonial Carousel Console */}
      {testimonials.length > 1 && (
        <div className="mb-24 w-full overflow-hidden relative marquee-container" style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}>
          <div className="flex w-max marquee-content py-4">
            {[...Array(2)].map((_, listIndex) => (
              <div key={listIndex} className="flex gap-4 md:gap-6 pr-4 md:pr-6">
                {testimonials.map((testimonial, index) => (
                  <motion.div 
                    key={`${testimonial.id}-${index}-${listIndex}`}
                    onClick={() => handleDotClick(index)}
                    whileHover={{ scale: 1.02 }}
                    className={`w-[260px] md:w-[320px] p-5 rounded-2xl border transition-colors cursor-pointer flex flex-col shrink-0 select-none ${currentIndex === index ? 'border-[#d4967a] shadow-[0_0_15px_rgba(212,150,122,0.3)] bg-white/10' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
                  >
                    <div className="flex gap-1 mb-3">
                       {[...Array(testimonial.rating)].map((_, i) => (
                         <FaStar key={i} style={{ color: 'var(--acc, #d4967a)' }} className="text-[10px] opacity-80" />
                       ))}
                    </div>
                    <p className="text-sm opacity-80 line-clamp-3 mb-4 flex-grow">"{testimonial.feedback || testimonial.text}"</p>
                    
                    <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: currentIndex === index ? 'var(--acc, #d4967a)' : 'rgba(255,255,255,0.1)', color: currentIndex === index ? '#080507' : 'var(--acc, #d4967a)' }}>
                        {getInitials(testimonial.name)}
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold" style={{ color: 'var(--pt, #b8ccd8)' }}>{testimonial.name}</h5>
                        <p className="text-xs opacity-60 truncate max-w-[200px]">{testimonial.role} {testimonial.company && `• ${testimonial.company}`}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes marquee-scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .marquee-content {
              animation: marquee-scroll 40s linear infinite;
            }
            .marquee-container:hover .marquee-content {
              animation-play-state: paused;
            }
          `}} />
        </div>
      )}

      {/* Write Review Section */}
      <div className="max-w-3xl mx-auto flex justify-center mt-12">
        <button 
          onClick={() => navigate('/review')}
          className="px-8 py-4 rounded-xl font-bold text-[#080507] hover:scale-105 transition-transform shadow-[0_0_20px_rgba(212,150,122,0.4)]"
          style={{ backgroundColor: 'var(--acc, #d4967a)' }}
        >
          Worked with me? Share Your Experience
        </button>
      </div>

    </section>
  );
};

export default Testimonials;
