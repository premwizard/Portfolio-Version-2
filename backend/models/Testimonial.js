import mongoose from 'mongoose';

const testimonialSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: false,
  },
  feedback: {
    type: String,
    required: true,
  },
  linkedin: {
    type: String,
    required: false,
  },
  rating: {
    type: Number,
    default: 5,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
