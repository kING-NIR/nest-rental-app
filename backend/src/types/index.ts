// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

// User types
export interface UserDocument {
  _id: string;
  contact: string;
  password: string;
  role: "owner" | "tenant";
  createdAt: Date;
  updatedAt: Date;
  comparePassword(plainPassword: string): Promise<boolean>;
}

// Property types
export interface PropertyDocument {
  _id: string;
  name: string;
  address: string;
  city: string;
  price: number;
  type: "Studio" | "Apartment" | "Villa" | "Penthouse" | "Independent House";
  bedrooms: number;
  bathrooms: number;
  description: string;
  ownerId: string;
  available: boolean;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Task types
export interface TaskDocument {
  _id: string;
  title: string;
  description: string;
  propertyId: string;
  tenantId: string;
  ownerId: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
}

// Appointment types
export interface AppointmentDocument {
  _id: string;
  propertyId: string;
  tenantId: string;
  ownerId: string;
  date: Date;
  time: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

// Payment types
export interface PaymentDocument {
  _id: string;
  rentalId: string;
  amount: number;
  paymentDate: Date;
  method: "card" | "bank-transfer" | "check";
  transactionId: string;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

// Message types
export interface MessageDocument {
  _id: string;
  propertyId: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Rental types
export interface RentalDocument {
  _id: string;
  propertyId: string;
  tenantId: string;
  ownerId: string;
  startDate: Date;
  endDate: Date;
  price: number;
  status: "active" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

// Request/Response types
export interface LoginRequest {
  contact: string;
  password: string;
}

export interface SignupRequest {
  contact: string;
  password: string;
  role: "owner" | "tenant";
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    contact: string;
    role: string;
  };
}

export interface PropertyCreateRequest {
  name: string;
  address: string;
  city: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  description: string;
  images?: string[];
}

export interface TaskCreateRequest {
  title: string;
  description: string;
  propertyId: string;
  priority?: "low" | "medium" | "high";
}

export interface AppointmentCreateRequest {
  propertyId: string;
  date: string;
  time: string;
  message?: string;
}

export interface PaymentCreateRequest {
  rentalId: string;
  amount: number;
  method: "card" | "bank-transfer" | "check";
}

export interface MessageCreateRequest {
  propertyId: string;
  receiverId: string;
  content: string;
}
