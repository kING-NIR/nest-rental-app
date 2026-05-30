import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDB } from "./utils/database";
import { errorHandler } from "./middleware/errorHandler";

// Routes
import authRoutes from "./routes/auth";
import propertyRoutes from "./routes/properties";
import operationRoutes from "./routes/operations";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Validate required environment variables
const requiredEnvVars = ["JWT_SECRET", "MONGODB_URI"];
const missingEnvVars = requiredEnvVars.filter(
  (envVar) => !process.env[envVar]
);
if (missingEnvVars.length > 0) {
  console.error(`✗ Missing required environment variables: ${missingEnvVars.join(", ")}`);
  process.exit(1);
}

// Security Middleware
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// CORS Configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limit to all routes
app.use("/api", limiter);

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`
    );
  });
  next();
});

// Initialize DB
let dbConnected = false;
connectDB()
  .then(() => {
    dbConnected = true;
    console.log("✓ MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("✗ MongoDB connection failed:", error);
    dbConnected = false;
  });

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: dbConnected ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    database: dbConnected ? "connected" : "disconnected",
    uptime: process.uptime(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/operations", operationRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found", path: req.path });
});

// Error handler
app.use(errorHandler);

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("✓ SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("✓ HTTP server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("✓ SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("✓ HTTP server closed");
    process.exit(0);
  });
});

const server = app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`✓ CORS Origin: ${process.env.CORS_ORIGIN}`);
});
