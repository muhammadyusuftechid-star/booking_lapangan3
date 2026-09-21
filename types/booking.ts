export interface Lapangan {
  id: string;
  name: string;
  description: string | null;
  location: string;
  price: number;
  picture_url: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: string;
  paymentDate: Date;
  paymentType: string | null;
}

export interface Customer {
  id: string;
  userId: string;
  email: string;
  name: string | null;
  username: string;
}

export interface BookingWithRelations {
  id: string;
  customerId: string;
  lapanganId: string;
  startTime: Date | string;
  endTime: Date | string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  createdAt?: Date;
  updatedAt?: Date;
  lapangan?: Lapangan;
  customer?: Customer;
  payments?: Payment[];
}
