import { useSyncExternalStore } from "react";
import { bookings as initialBookings } from "../../../data/mockData";
import type { Booking } from "../../../types";

type BookingState = {
  bookings: Booking[];
  reservedBookIds: string[];
};

const STORAGE_KEY = "book-exchange-lab3-bookings";

function readInitialState(): BookingState {
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as BookingState;
        if (Array.isArray(parsed.bookings) && Array.isArray(parsed.reservedBookIds)) return parsed;
      }
    } catch {
      // If local storage contains invalid data, use the demo data.
    }
  }
  return { bookings: initialBookings, reservedBookIds: [] };
}

let state: BookingState = readInitialState();
const listeners = new Set<() => void>();

function publish(next: BookingState) {
  state = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // The app remains usable when storage is unavailable.
  }
  listeners.forEach((listener) => listener());
}

export function subscribeBookings(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getBookingState() {
  return state;
}

export function useBookingState() {
  return useSyncExternalStore(subscribeBookings, getBookingState, getBookingState);
}

export function getBookStatus(bookId: string, originalStatus: Booking["status"] extends never ? never : "available" | "reserved" | "loaned") {
  return state.reservedBookIds.includes(bookId) ? "reserved" : originalStatus;
}

export function reserveBook(bookId: string, locationId: string) {
  if (state.reservedBookIds.includes(bookId)) return false;

  const today = new Date();
  const due = new Date(today);
  due.setDate(due.getDate() + 14);
  const toIsoDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const booking: Booking = {
    id: `bk-${Date.now()}`,
    bookId,
    locationId,
    reservedOn: toIsoDate(today),
    dueDate: toIsoDate(due),
    status: "active",
  };

  publish({
    bookings: [booking, ...state.bookings],
    reservedBookIds: [...state.reservedBookIds, bookId],
  });
  return true;
}
