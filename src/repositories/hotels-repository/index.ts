import { prisma } from "@/config";

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findRoomsFromHotelId( hotelId: number ) {
  return prisma.room.findMany({
    where: {
      hotelId: hotelId
    }
  });
}

async function findHotelById( hotelId: number ) {
  return prisma.hotel.findUnique({
    where: {
      id: hotelId
    }
  });
}

const hotelsRepository = {
  findHotels,
  findHotelById,
  findRoomsFromHotelId
};

export default hotelsRepository;
