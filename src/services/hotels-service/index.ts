import hotelsRepository from "@/repositories/hotels-repository";
import ticketRepository from "@/repositories/ticket-repository";
import enrollmentRepository, { CreateEnrollmentParams } from "@/repositories/enrollment-repository";
import { enrollmentNotFound, noneTicketFound, ticketFoundNotValid } from "./errors";
import { notFoundError } from "@/errors";

async function getHotelsList(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if(!enrollment) {
    throw enrollmentNotFound(); 
  }

  const ticket= await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket) { 
    throw noneTicketFound(); 
  }
  if(ticket.TicketType.includesHotel !== true || ticket.TicketType.isRemote !== false || ticket.status !== "PAID") {
    throw ticketFoundNotValid(); //preciso mudar
  }

  const hotelsList = await hotelsRepository.findHotels();
  
  return hotelsList;
}

async function getRoomsFromHotel(hotelId: number) {
  const hotel = await hotelsRepository.findHotelById(hotelId);
  if(!hotel) {
    throw notFoundError();
  }

  const roomList = await hotelsRepository.findRoomsFromHotelId(hotelId);

  return roomList;
}

const hotelsServices = {
  getHotelsList,
  getRoomsFromHotel
};

export default hotelsServices;
