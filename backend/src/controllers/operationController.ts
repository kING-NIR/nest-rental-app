import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../middleware/auth";
import { Task, Appointment, Payment, Message, Rental } from "../models/index";

// Demo data
const DEMO_TASKS = [
  {
    _id: "507f1f77bcf86cd799439051",
    title: "Fix leaky bathroom faucet",
    description: "Tenant reported water leakage from bathroom sink",
    propertyId: "507f1f77bcf86cd799439021",
    tenantId: "507f1f77bcf86cd799439012",
    ownerId: "507f1f77bcf86cd799439011",
    status: "open",
    priority: "high",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    _id: "507f1f77bcf86cd799439052",
    title: "Repair kitchen light",
    description: "Main kitchen light is not turning on",
    propertyId: "507f1f77bcf86cd799439021",
    tenantId: "507f1f77bcf86cd799439012",
    ownerId: "507f1f77bcf86cd799439011",
    status: "in-progress",
    priority: "medium",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
];

const DEMO_APPOINTMENTS = [
  {
    _id: "507f1f77bcf86cd799439061",
    propertyId: "507f1f77bcf86cd799439021",
    tenantId: "507f1f77bcf86cd799439012",
    ownerId: "507f1f77bcf86cd799439011",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    time: "10:00 AM",
    status: "pending",
    message: "Property viewing for new tenant",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const DEMO_PAYMENTS = [
  {
    _id: "507f1f77bcf86cd799439071",
    propertyId: "507f1f77bcf86cd799439021",
    tenantId: "507f1f77bcf86cd799439012",
    ownerId: "507f1f77bcf86cd799439011",
    amount: 50000,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: "pending",
    description: "May 2026 Rent",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const DEMO_MESSAGES = [
  {
    _id: "507f1f77bcf86cd799439081",
    senderId: "507f1f77bcf86cd799439012",
    receiverId: "507f1f77bcf86cd799439011",
    propertyId: "507f1f77bcf86cd799439021",
    text: "Hi, I would like to schedule a viewing for your property",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    _id: "507f1f77bcf86cd799439082",
    senderId: "507f1f77bcf86cd799439011",
    receiverId: "507f1f77bcf86cd799439012",
    propertyId: "507f1f77bcf86cd799439021",
    text: "Sure! How about tomorrow at 10 AM?",
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },
];

const isDBConnected = () => mongoose.connection.readyState === 1;

// TASKS
export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { propertyId } = req.query;
    
    if (!isDBConnected()) {
      let filtered = [...DEMO_TASKS];
      if (req.query.forOwner === "true") {
        filtered = filtered.filter(t => t.ownerId === req.user?.id);
      } else if (req.query.forTenant === "true") {
        filtered = filtered.filter(t => t.tenantId === req.user?.id);
      }
      res.json(filtered);
      return;
    }

    const filter: any = {};

    if (propertyId) filter.propertyId = propertyId;
    if (req.query.forOwner === "true") {
      filter.ownerId = req.user?.id;
    } else if (req.query.forTenant === "true") {
      filter.tenantId = req.user?.id;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, propertyId, priority } = req.body;

    if (!title || !propertyId) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const rental = await Rental.findOne({ propertyId, tenantId: req.user?.id });
    if (!rental) {
      res.status(403).json({ error: "No active rental for this property" });
      return;
    }

    const task = new Task({
      title,
      description,
      propertyId,
      tenantId: req.user?.id,
      ownerId: rental.ownerId,
      priority: priority || "medium",
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    if (task.ownerId !== req.user?.id && task.tenantId !== req.user?.id) {
      res.status(403).json({ error: "Not authorized" });
      return;
    }

    if (req.body.status) task.status = req.body.status;
    if (req.body.priority) task.priority = req.body.priority;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
};

// APPOINTMENTS
export const getAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!isDBConnected()) {
      let filtered = [...DEMO_APPOINTMENTS];
      if (req.query.forOwner === "true") {
        filtered = filtered.filter(a => a.ownerId === req.user?.id);
      } else if (req.query.forTenant === "true") {
        filtered = filtered.filter(a => a.tenantId === req.user?.id);
      }
      res.json(filtered);
      return;
    }

    const filter: any = {};

    if (req.query.forOwner === "true") {
      filter.ownerId = req.user?.id;
    } else if (req.query.forTenant === "true") {
      filter.tenantId = req.user?.id;
    }

    const appointments = await Appointment.find(filter).sort({ date: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

export const createAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { propertyId, date, time, message } = req.body;

    if (!propertyId || !date || !time) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const { ownerId } = await Property.findById(propertyId) || {};
    if (!ownerId) {
      res.status(404).json({ error: "Property not found" });
      return;
    }

    const appointment = new Appointment({
      propertyId,
      tenantId: req.user?.id,
      ownerId,
      date: new Date(date),
      time,
      message,
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Failed to create appointment" });
  }
};

export const updateAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      res.status(404).json({ error: "Appointment not found" });
      return;
    }

    if (appointment.ownerId !== req.user?.id) {
      res.status(403).json({ error: "Not authorized" });
      return;
    }

    if (req.body.status) appointment.status = req.body.status;

    await appointment.save();
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Failed to update appointment" });
  }
};

// PAYMENTS
export const getPayments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!isDBConnected()) {
      let filtered = [...DEMO_PAYMENTS];
      if (req.query.forOwner === "true") {
        filtered = filtered.filter(p => p.ownerId === req.user?.id);
      } else if (req.query.forTenant === "true") {
        filtered = filtered.filter(p => p.tenantId === req.user?.id);
      }
      res.json(filtered);
      return;
    }

    const filter: any = {};

    if (req.query.forOwner === "true") {
      filter.ownerId = req.user?.id;
    } else if (req.query.forTenant === "true") {
      filter.tenantId = req.user?.id;
    }

    const payments = await Payment.find(filter).sort({ dueDate: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};

export const recordPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      res.status(404).json({ error: "Payment not found" });
      return;
    }

    if (payment.tenantId !== req.user?.id) {
      res.status(403).json({ error: "Not authorized" });
      return;
    }

    payment.status = "paid";
    payment.paidDate = new Date();

    await payment.save();
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: "Failed to record payment" });
  }
};

// MESSAGES
export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { recipientId } = req.query;

    if (!isDBConnected()) {
      const filtered = DEMO_MESSAGES.filter(m => 
        (m.senderId === req.user?.id && m.receiverId === recipientId) ||
        (m.senderId === recipientId && m.receiverId === req.user?.id)
      );
      res.json(filtered);
      return;
    }

    const messages = await Message.find({
      $or: [
        { senderId: req.user?.id, receiverId: recipientId },
        { senderId: recipientId, receiverId: req.user?.id },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { receiverId, text, propertyId } = req.body;

    if (!receiverId || !text) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const message = new Message({
      senderId: req.user?.id,
      receiverId,
      propertyId,
      text,
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
};

import { Property } from "../models/Property";
