import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiCheck, FiX, FiTrash2, FiSearch, FiRefreshCw } from 'react-icons/fi';

const AdminTestimonials = () => {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
      const res = await axios.get(`${API_URL}/api/admin/testimonials`);
      setTestimonials(res.data);
    } catch (error) {
      toast.error('Failed to load testimonials');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
      await axios.patch(`${API_URL}/api/admin/testimonials/${id}`, { status: newStatus });
      toast.success(`Testimonial marked as ${newStatus}`);
      setTestimonials(testimonials.map(t => t._id === id ? { ...t, status: newStatus } : t));
    } catch (error) {
      toast.error(`Failed to update status`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
        await axios.delete(`${API_URL}/api/admin/testimonials/${id}`);
        toast.success('Testimonial deleted');
        setTestimonials(testimonials.filter(t => t._id !== id));
      } catch (error) {
        toast.error('Failed to delete testimonial');
      }
    }
  };

  const filteredTestimonials = testimonials
    .filter(t => {
      if (activeTab !== 'all' && t.status !== activeTab) return false;
      if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });

  const stats = {
    total: testimonials.length,
    pending: testimonials.filter(t => t.status === 'pending').length,
    approved: testimonials.filter(t => t.status === 'approved').length,
    rejected: testimonials.filter(t => t.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-background text-platinum p-4 md:p-8 relative">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="noise-bg"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <button 
              onClick={() => navigate('/')}
              className="mb-4 text-sm font-medium hover:underline flex items-center gap-2"
              style={{ color: 'var(--acc)' }}
            >
              ← Back to Portfolio
            </button>
            <h1 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--acc)' }}>Testimonial Admin</h1>
            <p className="opacity-70 mt-2">Manage your portfolio reviews</p>
          </div>
          <button 
            onClick={fetchTestimonials}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors w-fit"
          >
            <FiRefreshCw className={isLoading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'text-blue-400' },
            { label: 'Pending', value: stats.pending, color: 'text-yellow-400' },
            { label: 'Approved', value: stats.approved, color: 'text-green-400' },
            { label: 'Rejected', value: stats.rejected, color: 'text-red-400' },
          ].map(stat => (
            <div key={stat.label} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-sm opacity-70 mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters and Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white/5 p-2 rounded-xl border border-white/10 backdrop-blur-sm">
          <div className="flex w-full md:w-auto overflow-x-auto gap-2">
            {['pending', 'approved', 'rejected', 'all'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg capitalize whitespace-nowrap transition-all ${activeTab === tab ? 'bg-white/10 shadow-sm' : 'hover:bg-white/5 opacity-70 hover:opacity-100'}`}
                style={{ color: activeTab === tab ? 'var(--acc)' : 'inherit' }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
              <input 
                type="text" 
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-[#d4967a] text-sm"
              />
            </div>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#d4967a]"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[var(--acc)] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredTestimonials.length === 0 ? (
          <div className="text-center py-20 opacity-50 bg-white/5 rounded-2xl border border-white/10">
            <p>No testimonials found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {filteredTestimonials.map(t => (
                <motion.div 
                  key={t._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: 'var(--pt)' }}>{t.name}</h3>
                      <p className="text-sm opacity-70">{t.role} {t.company && `• ${t.company}`}</p>
                      <p className="text-xs opacity-50 mt-1">{new Date(t.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full uppercase font-bold tracking-wider
                      ${t.status === 'approved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                        t.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                        'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <p className="italic opacity-90 flex-grow mb-6 text-sm leading-relaxed">
                    "{t.feedback}"
                  </p>

                  <div className="flex gap-2 mt-auto pt-4 border-t border-white/5">
                    {t.status !== 'approved' && (
                      <button 
                        onClick={() => handleStatusChange(t._id, 'approved')}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors text-sm font-medium border border-green-500/20"
                      >
                        <FiCheck /> Approve
                      </button>
                    )}
                    {t.status !== 'rejected' && (
                      <button 
                        onClick={() => handleStatusChange(t._id, 'rejected')}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium border border-red-500/20"
                      >
                        <FiX /> Reject
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(t._id)}
                      className="w-12 flex items-center justify-center py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors border border-white/10 hover:border-red-500/20"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTestimonials;
