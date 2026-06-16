import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const testimonials = [
  {
    id: 1,
    name: "Aisha Patel",
    role: "Product Manager",
    company: "TechCorp",
    text: "Working with this developer was an absolute pleasure. They brought our vision to life with incredible attention to detail and a keen eye for design. The final product exceeded our expectations.",
    rating: 5,
  },
  {
    id: 2,
    name: "James Wilson",
    role: "Creative Director",
    company: "Designify",
    text: "An exceptional talent! The ability to seamlessly blend complex functionality with stunning aesthetics is rare. I highly recommend them for any frontend or full-stack project.",
    rating: 5,
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "CEO",
    company: "StartUp Inc.",
    text: "Our conversion rates skyrocketed after the redesign. Not only is the code clean and maintainable, but the user experience is incredibly intuitive. A true professional.",
    rating: 5,
  },
  {
    id: 4,
    name: "Michael Chang",
    role: "Senior Engineer",
    company: "CloudSystems",
    text: "Collaborating on complex architectural problems was seamless. They have a deep understanding of modern web technologies and always write scalable, efficient code.",
    rating: 5,
  },
    {
    id: 5,
    name: "James",
    role: "Creative Director",
    company: "Designify",
    text: "An exceptional talent! The ability to seamlessly blend complex functionality with stunning aesthetics is rare. I highly recommend them for any frontend or full-stack project.",
    rating: 5,
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    feedback: '',
    linkedin: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isFormOpen) {
        handleNext();
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex, isFormOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Replace with your actual EmailJS service ID, template ID, and public key
    emailjs.send(
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID',
      formData,
      'YOUR_PUBLIC_KEY'
    ).then((response) => {
      console.log('SUCCESS!', response.status, response.text);
      setSubmitStatus('success');
      setFormData({ name: '', role: '', company: '', feedback: '', linkedin: '' });
      setTimeout(() => setSubmitStatus(null), 5000);
    }).catch((error) => {
      console.log('FAILED...', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    }).finally(() => {
      setIsSubmitting(false);
    });
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto" style={{ backgroundColor: 'var(--bg, #080507)', color: 'var(--tx, #f0ece8)' }}>
      
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
                 "{currentTestimonial.text}"
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
                  <p className="text-sm opacity-80 line-clamp-3 mb-4 flex-grow">"{testimonial.text}"</p>
                  
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

      {/* Write Review Section */}
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="w-full p-6 rounded-2xl border border-white/10 bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 transition-all flex items-center justify-between group shadow-lg"
        >
          <div className="text-left">
            <h3 className="text-xl md:text-2xl font-bold mb-1" style={{ color: 'var(--acc2, #c8845e)' }}>Worked with me? Share Your Experience</h3>
            <p className="text-sm opacity-70">Your feedback means the world to me and helps others know what to expect.</p>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors shrink-0 ml-4">
            {isFormOpen ? <FiChevronUp className="text-2xl" /> : <FiChevronDown className="text-2xl" />}
          </div>
        </button>

        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-6 md:p-8 mt-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium opacity-80">Name *</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Rahul Sharma" 
                        className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:border-[#d4967a] focus:outline-none focus:ring-1 focus:ring-[#d4967a] transition-colors placeholder-white/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="role" className="text-sm font-medium opacity-80">Role/Designation *</label>
                      <input 
                        type="text" 
                        id="role" 
                        name="role" 
                        required
                        value={formData.role}
                        onChange={handleChange}
                        placeholder="Senior Frontend Developer" 
                        className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:border-[#d4967a] focus:outline-none focus:ring-1 focus:ring-[#d4967a] transition-colors placeholder-white/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="company" className="text-sm font-medium opacity-80">Company/Organization (optional)</label>
                      <input 
                        type="text" 
                        id="company" 
                        name="company" 
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Google" 
                        className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:border-[#d4967a] focus:outline-none focus:ring-1 focus:ring-[#d4967a] transition-colors placeholder-white/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="linkedin" className="text-sm font-medium opacity-80">LinkedIn/Profile Link (optional)</label>
                      <input 
                        type="text" 
                        id="linkedin" 
                        name="linkedin" 
                        value={formData.linkedin}
                        onChange={handleChange}
                        placeholder="linkedin.com/in/yourname" 
                        className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:border-[#d4967a] focus:outline-none focus:ring-1 focus:ring-[#d4967a] transition-colors placeholder-white/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="feedback" className="text-sm font-medium opacity-80">Feedback/Testimonial *</label>
                    <textarea 
                      id="feedback" 
                      name="feedback" 
                      required
                      rows="4"
                      value={formData.feedback}
                      onChange={handleChange}
                      placeholder="Share your experience (2-5 sentences)..." 
                      className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:border-[#d4967a] focus:outline-none focus:ring-1 focus:ring-[#d4967a] transition-colors placeholder-white/20 resize-y"
                    ></textarea>
                  </div>

                  {submitStatus === 'success' && (
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center justify-center">
                      Thank you! Your testimonial has been submitted successfully.
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-center">
                      Oops! Something went wrong. Please try again later.
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-lg font-bold text-[#080507] transition-all hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
                    style={{ backgroundColor: 'var(--acc, #d4967a)' }}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>

                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </section>
  );
};

export default Testimonials;
