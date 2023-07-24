import express from 'express';
import { getBookingByUser, createBooking } from '@/controllers/booking-controller';
import { authenticate } from '@/middlewares/authentication';

const router = express.Router();

router.get('/booking', authenticate, getBookingByUser);
router.post('/booking', authenticate, createBooking);

export default router;