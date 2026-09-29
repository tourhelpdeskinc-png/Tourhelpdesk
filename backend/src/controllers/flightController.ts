import { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import * as flightService from '../services/flightService.js';

// export const preCachePopularRoutes = flightService.preCachePopularRoutes;

import { createFlightBookingRequestService } from '../services/flightBookingService.js';
import { searchAirportsService } from '../services/airportService.js';

// Airport Autocomplete Search Controller
export const searchAirports = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const query = (req.query.q as string) || (req.body.query as string) || '';
  const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit || req.body.limit || 15), 10) || 15));
  const airports = searchAirportsService(query, limit);

  res.status(200).json({
    success: true,
    airports,
    count: airports.length,
  });
});

// Active Flight Search Controller
export const searchFlights = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await flightService.searchLiveFlights({
    ...req.body,
    clientIp: req.ip,
  });

  res.status(200).json({
    success: true,
    ...result,
  });
});

// Flight Booking Request Controller (Saves to DB & triggers customer/admin emails)
export const createFlightBookingRequest = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await createFlightBookingRequestService(req.body, req.ip);
    res.status(201).json(result);
  }
);


export const repriceFlight = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await flightService.repriceLiveFlight({
    ...req.body,
    clientIp: req.ip,
  });

  res.status(200).json(result);
});

export const getSSR = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await flightService.getLiveSSR({
    ...req.body,
    clientIp: req.ip,
  });

  res.status(200).json(result);
});

export const tempBooking = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await flightService.tempBookingLiveFlight({
    ...req.body,
    clientIp: req.ip,
  });

  res.status(200).json(result);
});

export const issueTicket = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await flightService.issueTicketLiveFlight({
    ...req.body,
    clientIp: req.ip,
  });

  res.status(200).json(result);
});

export const getFlightDetails = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Flight details endpoint ready for live PNR repricing',
  });
});




