export interface User {
  id: string;
  name: string;
  contact: string;
  email?: string;
  role: "owner" | "tenant";
  initials: string;
  color: string;
  verified: boolean;
}

export interface Property {
  _id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  type: "Studio" | "Apartment" | "Villa" | "Penthouse" | "Independent House";
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  amenities: string[];
  available: boolean;
  ownerId: string;
  tenantId?: string;
  gradient: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  propertyId: string;
  tenantId: string;
  ownerId: string;
  status: "open" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  _id: string;
  propertyId: string;
  tenantId: string;
  ownerId: string;
  date: string;
  time: string;
  status: "pending" | "approved" | "declined";
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  propertyId: string;
  tenantId: string;
  ownerId: string;
  amount: number;
  month: string;
  status: "pending" | "paid";
  dueDate: string;
  paidDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  propertyId?: string;
  text: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (contact: string, password: string) => Promise<void>;
  signup: (name: string, contact: string, password: string, role: "owner" | "tenant") => Promise<void>;
  logout: () => void;
}
