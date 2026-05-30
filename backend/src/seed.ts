// Seed database with demo data
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/nest-rental");
    console.log("Connected to MongoDB");

    // Import models
    const { User, Property, Rental, Task, Appointment, Payment, Message } = require("./models/index");

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Property.deleteMany({}),
      Rental.deleteMany({}),
      Task.deleteMany({}),
      Appointment.deleteMany({}),
      Payment.deleteMany({}),
      Message.deleteMany({}),
    ]);

    // Create users
    const ownerPassword = await bcrypt.hash("password123", 12);
    const tenantPassword = await bcrypt.hash("password123", 12);

    const owner = await User.create({
      contact: "9999999991",
      password: ownerPassword,
      role: "owner",
    });

    const tenant = await User.create({
      contact: "9999999993",
      password: tenantPassword,
      role: "tenant",
    });

    console.log("✓ Users created");

    // Create properties
    const properties = await Property.insertMany([
      {
        name: "Luxury Penthouse Downtown",
        address: "123 Main St, Suite 2001",
        city: "Hyderabad",
        price: 150000,
        type: "Penthouse",
        bedrooms: 3,
        bathrooms: 2.5,
        description: "Stunning penthouse with city views and modern amenities",
        ownerId: owner._id,
        available: true,
        images: [],
      },
      {
        name: "Cozy 1BHK Apartment",
        address: "456 Oak Ave, Unit 5B",
        city: "Hyderabad",
        price: 35000,
        type: "Apartment",
        bedrooms: 1,
        bathrooms: 1,
        description: "Perfect starter apartment in prime location",
        ownerId: owner._id,
        available: true,
        images: [],
      },
      {
        name: "Villa with Pool",
        address: "789 Garden Lane",
        city: "Bangalore",
        price: 200000,
        type: "Villa",
        bedrooms: 4,
        bathrooms: 3,
        description: "Spacious villa with private pool and garden",
        ownerId: owner._id,
        available: false,
        images: [],
      },
      {
        name: "Modern Studio",
        address: "321 Tech Park",
        city: "Hyderabad",
        price: 25000,
        type: "Studio",
        bedrooms: 0,
        bathrooms: 1,
        description: "Efficient modern studio for professionals",
        ownerId: owner._id,
        available: true,
        images: [],
      },
    ]);

    console.log("✓ Properties created");

    // Create rental
    const rental = await Rental.create({
      propertyId: properties[0]._id,
      tenantId: tenant._id,
      ownerId: owner._id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      price: properties[0].price,
      status: "active",
    });

    console.log("✓ Rental created");

    // Create tasks
    const tasks = await Task.insertMany([
      {
        title: "Fix water tap in kitchen",
        description: "Kitchen tap is leaking, needs replacement",
        propertyId: properties[0]._id,
        tenantId: tenant._id,
        ownerId: owner._id,
        status: "pending",
        priority: "high",
      },
      {
        title: "Deep cleaning required",
        description: "Property needs complete cleaning before next tenant",
        propertyId: properties[1]._id,
        tenantId: tenant._id,
        ownerId: owner._id,
        status: "in-progress",
        priority: "medium",
      },
    ]);

    console.log("✓ Tasks created");

    // Create appointments
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const appointments = await Appointment.insertMany([
      {
        propertyId: properties[1]._id,
        tenantId: tenant._id,
        ownerId: owner._id,
        date: nextWeek,
        time: "14:30",
        message: "Property viewing for potential tenant",
        status: "pending",
      },
      {
        propertyId: properties[3]._id,
        tenantId: tenant._id,
        ownerId: owner._id,
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        time: "10:00",
        message: "Maintenance inspection",
        status: "accepted",
      },
    ]);

    console.log("✓ Appointments created");

    // Create payments
    const payments = await Payment.insertMany([
      {
        rentalId: rental._id,
        amount: properties[0].price,
        paymentDate: new Date(),
        method: "bank-transfer",
        transactionId: "TXN123456789",
        status: "completed",
      },
      {
        rentalId: rental._id,
        amount: properties[0].price,
        paymentDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        method: "card",
        transactionId: "TXN987654321",
        status: "completed",
      },
    ]);

    console.log("✓ Payments created");

    // Create messages
    const messages = await Message.insertMany([
      {
        propertyId: properties[0]._id,
        senderId: owner._id,
        receiverId: tenant._id,
        content: "Hi, just checking if everything is fine with the property",
        read: true,
      },
      {
        propertyId: properties[0]._id,
        senderId: tenant._id,
        receiverId: owner._id,
        content: "Yes, everything is great! Thanks for checking.",
        read: false,
      },
    ]);

    console.log("✓ Messages created");

    console.log("\n✅ Database seeded successfully!");
    console.log("\nDemo Credentials:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Owner:");
    console.log("  Contact: 9999999991");
    console.log("  Password: password123");
    console.log("\nTenant:");
    console.log("  Contact: 9999999993");
    console.log("  Password: password123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
