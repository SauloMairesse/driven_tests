import { getHotels, getRoomsFromHotel } from "@/controllers/hotels-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const hotelsRouter = Router();

hotelsRouter.all("/*", authenticateToken)
  .get("/", getHotels)
  .get("/:hotelId", getRoomsFromHotel);
export { hotelsRouter };
