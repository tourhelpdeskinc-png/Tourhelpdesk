import { Router } from 'express';
import {
  searchHotelByName,
  searchHotels,
  getHotelDetails,
  getCancellationPolicy,
  createTempBooking,
  issueHotelTicket,
} from '../controllers/hotelController.js';
import { authMiddleware } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { hotelSearchLimiter } from '../middleware/rateLimiter.js';
import {
  hotelAutocompleteSchema,
  hotelSearchSchema,
  hotelDetailsSchema,
  hotelTempBookingSchema,
  hotelTicketSchema,
} from '../validators/hotel.validator.js';
import { idempotencyMiddleware } from '../middleware/idempotency.js';

const router = Router();

router.post('/autocomplete', hotelSearchLimiter, validateBody(hotelAutocompleteSchema), searchHotelByName);
router.post('/search', hotelSearchLimiter, validateBody(hotelSearchSchema), searchHotels);
router.post('/details', validateBody(hotelDetailsSchema), getHotelDetails);
router.post('/cancellation-policy', getCancellationPolicy);
router.post('/temp-booking', authMiddleware, idempotencyMiddleware({ ttlSeconds: 900 }), validateBody(hotelTempBookingSchema), createTempBooking);
router.post('/ticket', authMiddleware, idempotencyMiddleware({ ttlSeconds: 900 }), validateBody(hotelTicketSchema), issueHotelTicket);

export default router;

