import { ApplicationError } from "@/protocols";

export function noneTicketFound(): ApplicationError {
  return {
    name: "ticketNotFound",
    message: "There is no ticket",
  };
}

export function ticketFoundNotValid(): ApplicationError {
  return {
    name: "invalidTicket",
    message: "The ticket found is invalid",
  };
}

export function enrollmentNotFound(): ApplicationError {
  return {
    name: "enrollmentNotFound",
    message: "user doesnt have enrollment",
  };
}
