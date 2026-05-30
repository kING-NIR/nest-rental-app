import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  contact: string;
  email?: string;
  password: string;
  role: "owner" | "tenant";
  initials: string;
  color: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    contact: { type: String, required: true, unique: true },
    email: { type: String, lowercase: true, sparse: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["owner", "tenant"], required: true },
    initials: { type: String, required: true },
    color: { type: String, default: "#C9A84C" },
    verified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);
