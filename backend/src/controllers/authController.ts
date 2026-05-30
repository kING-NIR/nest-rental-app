import { Request, Response } from "express";
import { User } from "../models/User";
import { generateToken } from "../middleware/auth";
import mongoose from "mongoose";

// Demo mode when database is unavailable
const DEMO_USERS = {
  "9999999991": {
    id: "507f1f77bcf86cd799439011",
    name: "Owner User",
    contact: "9999999991",
    email: "owner@demo.com",
    role: "owner",
    initials: "OU",
  },
  "9999999993": {
    id: "507f1f77bcf86cd799439012",
    name: "Tenant User",
    contact: "9999999993",
    email: "tenant@demo.com",
    role: "tenant",
    initials: "TU",
  },
};

const isDBConnected = () => {
  return mongoose.connection.readyState === 1;
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, contact, email, password, role } = req.body;

    if (!name || !contact || !password || !role) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Demo mode fallback
    if (!isDBConnected()) {
      if (contact in DEMO_USERS) {
        res.status(409).json({ error: "Contact already registered" });
        return;
      }
      const initials = name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
      const token = generateToken("demo_user_id");
      res.status(201).json({
        user: { name, contact, email, role, initials },
        token,
      });
      return;
    }

    const existing = await User.findOne({ contact });
    if (existing) {
      res.status(409).json({ error: "Contact already registered" });
      return;
    }

    const initials = name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const user = new User({
      name,
      contact,
      email,
      password,
      role,
      initials,
    });

    await user.save();

    const token = generateToken(user._id.toString());
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        contact: user.contact,
        role: user.role,
        initials: user.initials,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Signup failed" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { contact, password } = req.body;

    if (!contact || !password) {
      res.status(400).json({ error: "Contact and password required" });
      return;
    }

    // Demo mode - accept any of the demo contacts with password123
    if (!isDBConnected()) {
      if (contact in DEMO_USERS && password === "password123") {
        const demoUser = DEMO_USERS[contact as keyof typeof DEMO_USERS];
        const token = generateToken(demoUser.id);
        res.json({
          user: demoUser,
          token,
        });
        return;
      }
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const user = await User.findOne({ contact });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = generateToken(user._id.toString());
    res.json({
      user: {
        id: user._id,
        name: user.name,
        contact: user.contact,
        role: user.role,
        initials: user.initials,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

export const verifyToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById((req as any).user?.id);
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        contact: user.contact,
        role: user.role,
        initials: user.initials,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Verification failed" });
  }
};
