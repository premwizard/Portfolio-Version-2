import express from 'express';
import {
  submitTestimonial,
  getApprovedTestimonials,
  getAllTestimonials,
  updateTestimonialStatus,
  deleteTestimonial,
} from '../controllers/testimonialController.js';

const router = express.Router();

// Public routes
router.route('/testimonials')
  .post(submitTestimonial)
  .get(getApprovedTestimonials);

// Admin routes
router.route('/admin/testimonials')
  .get(getAllTestimonials);

router.route('/admin/testimonials/:id')
  .patch(updateTestimonialStatus)
  .delete(deleteTestimonial);

export default router;
