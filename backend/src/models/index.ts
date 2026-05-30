import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  propertyId: string;
  tenantId: string;
  ownerId: string;
  status: "open" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    propertyId: { type: String, required: true },
    tenantId: { type: String, required: true },
    ownerId: { type: String, required: true },
    status: { type: String, enum: ["open", "in-progress", "resolved"], default: "open" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  },
  { timestamps: true }
);

taskSchema.index({ propertyId: 1, tenantId: 1 });
taskSchema.index({ ownerId: 1 });

export const Task = mongoose.model<ITask>("Task", taskSchema);

// Rental agreement
export interface IRental extends Document {
  propertyId: string;
  tenantId: string;
  ownerId: string;
  startDate: Date;
  endDate?: Date;
  monthlyRent: number;
  deposit: number;
  status: "active" | "ended";
  createdAt: Date;
  updatedAt: Date;
}

const rentalSchema = new Schema<IRental>(
  {
    propertyId: { type: String, required: true },
    tenantId: { type: String, required: true },
    ownerId: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    monthlyRent: { type: Number, required: true, min: 0 },
    deposit: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["active", "ended"], default: "active" },
  },
  { timestamps: true }
);

rentalSchema.index({ propertyId: 1 });
rentalSchema.index({ tenantId: 1 });
rentalSchema.index({ ownerId: 1 });

export const Rental = mongoose.model<IRental>("Rental", rentalSchema);

// Appointments
export interface IAppointment extends Document {
  propertyId: string;
  tenantId: string;
  ownerId: string;
  date: Date;
  time: string;
  status: "pending" | "approved" | "declined";
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    propertyId: { type: String, required: true },
    tenantId: { type: String, required: true },
    ownerId: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "declined"], default: "pending" },
    message: { type: String },
  },
  { timestamps: true }
);

appointmentSchema.index({ propertyId: 1 });
appointmentSchema.index({ tenantId: 1, ownerId: 1 });

export const Appointment = mongoose.model<IAppointment>("Appointment", appointmentSchema);

// Payments
export interface IPayment extends Document {
  propertyId: string;
  tenantId: string;
  ownerId: string;
  amount: number;
  month: string;
  status: "pending" | "paid";
  dueDate: Date;
  paidDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    propertyId: { type: String, required: true },
    tenantId: { type: String, required: true },
    ownerId: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    month: { type: String, required: true },
    status: { type: String, enum: ["pending", "paid"], default: "pending" },
    dueDate: { type: Date, required: true },
    paidDate: { type: Date },
  },
  { timestamps: true }
);

paymentSchema.index({ propertyId: 1, tenantId: 1 });
paymentSchema.index({ ownerId: 1 });
paymentSchema.index({ status: 1 });

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema);

// Messages
export interface IMessage extends Document {
  senderId: string;
  receiverId: string;
  propertyId?: string;
  text: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    propertyId: { type: String },
    text: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

messageSchema.index({ senderId: 1, receiverId: 1 });
messageSchema.index({ createdAt: -1 });

export const Message = mongoose.model<IMessage>("Message", messageSchema);
