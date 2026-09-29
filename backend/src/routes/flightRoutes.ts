import { Router } from 'express';
import {
  searchFlights,
  createFlightBookingRequest,
  repriceFlight,
  getSSR,
  searchAirports,
} from '../controllers/flightController.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { flightSearchLimiter } from '../middleware/rateLimiter.js';
import {
  flightSearchSchema,
  flightRepriceSchema,
  flightSsrSchema,
} from '../validators/flight.validator.js';
import { flightBookingRequestSchema } from '../validators/flightBookingRequest.validator.js';
import { idempotencyMiddleware } from '../middleware/idempotency.js';

const router = Router();

// 0. Worldwide Airport Autocomplete Search (supports both GET and POST)
router.get('/airports', searchAirports);
router.post('/airports', searchAirports);

// 1. Active Flight Search Endpoint (Protected against bot scraping & rapid automated hits)
router.post('/search', flightSearchLimiter, validateBody(flightSearchSchema), searchFlights);

// 2. Flight Reprice Endpoint (Air_Reprice)
router.post('/reprice', validateBody(flightRepriceSchema), repriceFlight);

// 3. Flight Special Service Requests Endpoint (Air_GetSSR)
router.post('/ssr', validateBody(flightSsrSchema), getSSR);

// 4. Flight Booking Request Endpoint (Protected with O(1) Idempotency Key against duplicate submits & double charges)
router.post(
  '/booking-request',
  idempotencyMiddleware({ ttlSeconds: 900 }),
  validateBody(flightBookingRequestSchema),
  createFlightBookingRequest
);

export default router;





