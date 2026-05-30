import logger from "../utils/logger";

interface Config {
  port: number;
  nodeEnv: string;
  mongodbUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  corsOrigin: string;
  emailService: string;
  emailUser?: string;
  emailPassword?: string;
  smtpHost?: string;
  smtpPort?: number;
  uploadPath: string;
  maxFileSize: number;
}

// Validate required environment variables
const validateEnv = (): void => {
  const required = [
    "PORT",
    "NODE_ENV",
    "MONGODB_URI",
    "JWT_SECRET",
    "JWT_EXPIRES_IN",
    "CORS_ORIGIN",
  ];

  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
};

// Load and validate configuration
const loadConfig = (): Config => {
  try {
    validateEnv();

    const config: Config = {
      port: parseInt(process.env.PORT || "5000", 10),
      nodeEnv: process.env.NODE_ENV || "development",
      mongodbUri: process.env.MONGODB_URI!,
      jwtSecret: process.env.JWT_SECRET!,
      jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
      corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
      emailService: process.env.EMAIL_SERVICE || "smtp",
      emailUser: process.env.EMAIL_USER,
      emailPassword: process.env.EMAIL_PASSWORD,
      smtpHost: process.env.SMTP_HOST,
      smtpPort: parseInt(process.env.SMTP_PORT || "587", 10),
      uploadPath: process.env.UPLOAD_PATH || "./uploads",
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "5242880", 10), // 5MB default
    };

    logger.info("Configuration loaded successfully", {
      nodeEnv: config.nodeEnv,
      port: config.port,
      corsOrigin: config.corsOrigin,
    });

    return config;
  } catch (error) {
    logger.error("Failed to load configuration", error);
    throw error;
  }
};

export const config: Config = loadConfig();

export default config;
