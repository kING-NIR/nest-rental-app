// Test setup file for Jest
import dotenv from "dotenv";

// Load environment variables for tests
dotenv.config({ path: ".env.test" });

// Set NODE_ENV for tests
process.env.NODE_ENV = "test";

// Mock console methods to reduce test output clutter
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Set reasonable timeouts for tests
jest.setTimeout(10000);
