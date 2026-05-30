import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/nest-rental";
    
    // Enhanced connection options for MongoDB Atlas
    const connectionOptions = {
      retryWrites: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(mongoUri, connectionOptions);
    console.log("✓ MongoDB connected successfully");
  } catch (error) {
    console.error("✗ MongoDB connection failed:", error);
    // Don't exit - allow graceful degradation
    console.log("ℹ Server continuing without database (health check available)");
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log("✓ MongoDB disconnected");
  } catch (error) {
    console.error("✗ MongoDB disconnection failed:", error);
  }
};
