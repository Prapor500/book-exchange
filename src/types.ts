export type BookStatus = "available" | "reserved" | "loaned";

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  year: number;
  coverColor: string; // демо-обложка вместо реальной картинки
  status: BookStatus;
  locationId: string;
  description: string;
}

export interface PickupLocation {
  id: string;
  name: string;
  address: string;
  hours: string;
  booksAvailable: number;
}

export type BookingStatus = "active" | "overdue" | "returned";

export interface Booking {
  id: string;
  bookId: string;
  locationId: string;
  reservedOn: string; // ISO date
  dueDate: string; // ISO date
  status: BookingStatus;
}
