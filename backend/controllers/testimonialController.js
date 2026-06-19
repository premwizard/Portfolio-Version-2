import Testimonial from '../models/Testimonial.js';

// @desc    Submit new testimonial
// @route   POST /api/testimonials
// @access  Public
export const submitTestimonial = async (req, res) => {
  try {
    const { name, role, company, feedback, linkedin, rating } = req.body;

    if (!name || !role || !feedback) {
      return res.status(400).json({ message: 'Please provide name, role, and feedback.' });
    }

    const testimonial = new Testimonial({
      name,
      role,
      company,
      feedback,
      linkedin,
      rating: rating || 5,
      status: 'pending' // explicit
    });

    const createdTestimonial = await testimonial.save();
    res.status(201).json(createdTestimonial);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all approved testimonials
// @route   GET /api/testimonials
// @access  Public
export const getApprovedTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all testimonials (Admin)
// @route   GET /api/admin/testimonials
// @access  Public (should be protected in a real app, but omitting auth per requirements)
export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update testimonial status (Admin)
// @route   PATCH /api/admin/testimonials/:id
// @access  Public
export const updateTestimonialStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const testimonial = await Testimonial.findById(id);

    if (testimonial) {
      testimonial.status = status;
      const updatedTestimonial = await testimonial.save();
      res.json(updatedTestimonial);
    } else {
      res.status(404).json({ message: 'Testimonial not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete testimonial (Admin)
// @route   DELETE /api/admin/testimonials/:id
// @access  Public
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);

    if (testimonial) {
      await testimonial.deleteOne();
      res.json({ message: 'Testimonial removed' });
    } else {
      res.status(404).json({ message: 'Testimonial not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
