import mongoose, { Schema, Document } from "mongoose";

export interface IProperty extends Document {
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
  images?: string[];
  gradient: string;
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    type: {
      type: String,
      enum: ["Studio", "Apartment", "Villa", "Penthouse", "Independent House"],
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    bedrooms: { type: Number, required: true, min: 0 },
    bathrooms: { type: Number, required: true, min: 0 },
    area: { type: Number, required: true, min: 0 },
    amenities: [{ type: String }],
    available: { type: Boolean, default: true },
    ownerId: { type: String, required: true },
    tenantId: { type: String, sparse: true },
    images: [{ type: String }],
    gradient: { type: String, default: "linear-gradient(145deg,#1a1040 0%,#2d1b6e 55%,#0f2460 100%)" },
  },
  { timestamps: true }
);

propertySchema.index({ ownerId: 1 });
propertySchema.index({ city: 1 });
propertySchema.index({ available: 1 });

export const Property = mongoose.model<IProperty>("Property", propertySchema);
