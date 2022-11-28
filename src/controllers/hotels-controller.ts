import { AuthenticatedRequest } from "@/middlewares";
import hotelsServices from "@/services/hotels-service/index";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const hotels = await hotelsServices.getHotelsList(userId);

    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name === "ticketNotFound") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
    if (error.name === "invalidTicket") {                    
      return res.status(httpStatus.BAD_REQUEST).send(error);
    } 
    if (error.name === "enrollmentNotFound") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getRoomsFromHotel(req: AuthenticatedRequest, res: Response) {
  const hotelId  = Number(req.params.hotelId);

  try {
    const rooms = await hotelsServices.getRoomsFromHotel(hotelId);

    return res.status(httpStatus.OK).send(rooms);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
