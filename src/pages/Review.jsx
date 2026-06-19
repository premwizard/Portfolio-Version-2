import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { supabase } from '../lib/supabase';

const Review = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    feedback: '',
    linkedin: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('testimonials').insert([{
        name: formData.name,
        role: formData.role,
        company: formData.company,
        feedback: formData.feedback,
        linkedin: formData.linkedin,
        rating: 5,
        status: 'pending'
      }]);

      if (error) throw error;

      toast.success('Thank you! Your testimonial has been submitted and is pending review.');
      setFormData({ name: '', role: '', company: '', feedback: '', linkedin: '' });
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-platinum flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0">
        <div className="noise-bg"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-3xl">
        <button 
          onClick={() => navigate('/')}
          className="mb-8 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium"
          style={{ color: 'var(--acc)' }}
        >
          ← Back to Portfolio
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 md:p-12 rounded-3xl border border-white/10 backdrop-blur-md bg-white/5 shadow-2xl"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--acc)' }}>Share Your Experience</h1>
            <p className="opacity-70 text-sm md:text-base">Your feedback means the world to me and helps others know what to expect.</p>
          </div>

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

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4 rounded-lg font-bold text-[#080507] transition-all hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 mt-6"
              style={{ backgroundColor: 'var(--acc)' }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Review;
