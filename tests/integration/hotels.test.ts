import supertest from "supertest";
import app, { init } from "@/app";
import httpStatus from "http-status";

import {  createEnrollmentWithAddress,
  createTicket, 
  createTicketType, 
  createTicketTypeValidToShowHotels, 
  createUser } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import { TicketStatus } from "@prisma/client";
import { createHotel, createRoom } from "../factories/hotels-factory";
import { date } from "joi";
import exp from "constants";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

beforeAll(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("Testing Router /hotels/", () => {
  it("GET Hotels list fail by token invalid ", async () => {
    const response = await server.get("/hotels/").set("Authorization", "Bearer ");
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("GET Hotels fail by none enrollment", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const response = await server.get("/hotels/").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
    expect(response.body.message).toBe("user doesnt have enrollment");
  });

  it("GET Hotels fail by none ticket", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment =  await createEnrollmentWithAddress(user);

    const response = await server.get("/hotels/").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
    expect(response.body.message).toBe("There is no ticket");
  });

  it("GET Hotels fail by invalid ticket", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment =  await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

    const response = await server.get("/hotels/").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
    expect(response.body.message).toBe("The ticket found is invalid");
  });

  it("GET Hotels list sucessefully ", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment =  await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeValidToShowHotels();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const hotel = await createHotel();

    const response = await server.get("/hotels/").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: hotel.id,
          name: hotel.name,
          image: hotel.image,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)  
        })
      ])
    );
  });
});

describe("Testing Router /hotels/hotelId", () => {
  it("GET Rooms List sucessefully ", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment =  await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeValidToShowHotels();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    
    const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body[0]).toEqual(expect.objectContaining({
      id: hotel.id,
      name: hotel.name,
      image: hotel.image,
      createdAt: hotel.createdAt.toISOString(),
      updatedAt: hotel.updatedAt.toISOString(),
      Rooms: expect.arrayContaining([
        expect.objectContaining({
          id: room.id,
          name: room.name,
          capacity: room.capacity,
          hotelId: room.hotelId,
          createdAt: room.createdAt.toISOString(),
          updatedAt: room.updatedAt.toISOString()
        })  
      ])
    })  
    );
  });

  it("GET Rooms List => Error HotelId invalid ", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment =  await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeValidToShowHotels();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const hotel = await createHotel();

    const response = await server.get("/hotels/0").set("Authorization", `Bearer ${token}`);
    
    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it("GET Hotels list fail by token invalid ", async () => {
    const hotel = await createHotel();

    const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", "Bearer ");
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
});
