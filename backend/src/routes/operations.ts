import { Router } from "express";
import { auth } from "../middleware/auth";
import {
  getTasks,
  createTask,
  updateTask,
  getAppointments,
  createAppointment,
  updateAppointment,
  getPayments,
  recordPayment,
  getMessages,
  sendMessage,
} from "../controllers/operationController";

const router = Router();

// Tasks
router.get("/tasks", auth, getTasks);
router.post("/tasks", auth, createTask);
router.put("/tasks/:id", auth, updateTask);

// Appointments
router.get("/appointments", auth, getAppointments);
router.post("/appointments", auth, createAppointment);
router.put("/appointments/:id", auth, updateAppointment);

// Payments
router.get("/payments", auth, getPayments);
router.put("/payments/:id", auth, recordPayment);

// Messages
router.get("/messages", auth, getMessages);
router.post("/messages", auth, sendMessage);

export default router;
