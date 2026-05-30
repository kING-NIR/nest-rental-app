import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { Property } from "../models/Property";
import mongoose from "mongoose";

const GRADIENTS = [
  "linear-gradient(145deg,#1a1040 0%,#2d1b6e 55%,#0f2460 100%)",
  "linear-gradient(145deg,#0d2618 0%,#1a4a35 55%,#0a3025 100%)",
  "linear-gradient(145deg,#0d0d22 0%,#1a1a45 55%,#221560 100%)",
  "linear-gradient(145deg,#2a0a18 0%,#4a1530 55%,#38082a 100%)",
  "linear-gradient(145deg,#0a1a2a 0%,#153a5a 55%,#0a2535 100%)",
];

// Demo properties for database-less mode
const DEMO_PROPERTIES = [
  {
    id: "demo1",
    ownerId: "507f1f77bcf86cd799439011",
    title: "Modern 2BHK Apartment",
    description: "Luxurious apartment in prime location with modern amenities",
    address: "Banjara Hills, Hyderabad",
    city: "Hyderabad",
    type: "Apartment",
    price: 50000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    available: true,
    amenities: ["WiFi", "Gym", "Pool", "Security"],
    images: [],
    gradient: GRADIENTS[0],
    createdAt: new Date(),
  },
  {
    id: "demo2",
    ownerId: "507f1f77bcf86cd799439011",
    title: "Spacious Villa with Garden",
    description: "Beautiful villa perfect for families with large garden",
    address: "Jubilee Hills, Hyderabad",
    city: "Hyderabad",
    type: "Villa",
    price: 150000,
    bedrooms: 4,
    bathrooms: 3,
    area: 3500,
    available: true,
    amenities: ["Garden", "Parking", "Security", "Furnished"],
    images: [],
    gradient: GRADIENTS[1],
    createdAt: new Date(),
  },
  {
    id: "demo3",
    ownerId: "demo_other_owner",
    title: "Studio Apartment Downtown",
    description: "Cozy studio perfect for singles and professionals",
    address: "HITEC City, Hyderabad",
    city: "Hyderabad",
    type: "Studio",
    price: 25000,
    bedrooms: 1,
    bathrooms: 1,
    area: 500,
    available: true,
    amenities: ["WiFi", "Furnished"],
    images: [],
    gradient: GRADIENTS[2],
    createdAt: new Date(),
  },
];

const isDBConnected = () => {
  return mongoose.connection.readyState === 1;
};

export const getProperties = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { city, type, available } = req.query;

    // Demo mode
    if (!isDBConnected()) {
      let filtered = [...DEMO_PROPERTIES];
      if (city) filtered = filtered.filter(p => p.city === city);
      if (type) filtered = filtered.filter(p => p.type === type);
      if (available === "true") filtered = filtered.filter(p => p.available === true);
      res.json(filtered);
      return;
    }

    const filter: any = {};
    if (city) filter.city = city;
    if (type) filter.type = type;
    if (available === "true") filter.available = true;

    const properties = await Property.find(filter).sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch properties" });
  }
};

export const getMyProperties = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    // Demo mode
    if (!isDBConnected()) {
      const myProps = DEMO_PROPERTIES.filter(p => p.ownerId === userId);
      res.json(myProps);
      return;
    }

    const properties = await Property.find({ ownerId: userId }).sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch properties" });
  }
};

export const getPropertyById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Demo mode
    if (!isDBConnected()) {
      const prop = DEMO_PROPERTIES.find(p => p.id === id);
      if (!prop) {
        res.status(404).json({ error: "Property not found" });
        return;
      }
      res.json(prop);
      return;
    }

    const property = await Property.findById(id);
    if (!property) {
      res.status(404).json({ error: "Property not found" });
      return;
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch property" });
  }
};

export const createProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, address, city, type, price, bedrooms, bathrooms, area, amenities } = req.body;

    if (!title || !description || !address || !city || !type || !price) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const property = new Property({
      title,
      description,
      address,
      city,
      type,
      price: Number(price),
      bedrooms: Number(bedrooms) || 1,
      bathrooms: Number(bathrooms) || 1,
      area: Number(area) || 0,
      amenities: amenities || [],
      ownerId: req.user?.id,
      available: true,
      gradient: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
    });

    await property.save();
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ error: "Failed to create property" });
  }
};

export const updateProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      res.status(404).json({ error: "Property not found" });
      return;
    }

    if (property.ownerId !== req.user?.id) {
      res.status(403).json({ error: "Not authorized" });
      return;
    }

    Object.assign(property, req.body);
    await property.save();
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: "Failed to update property" });
  }
};

export const deleteProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      res.status(404).json({ error: "Property not found" });
      return;
    }

    if (property.ownerId !== req.user?.id) {
      res.status(403).json({ error: "Not authorized" });
      return;
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: "Property deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete property" });
  }
};
