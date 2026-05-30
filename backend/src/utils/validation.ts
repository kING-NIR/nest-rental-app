import { validationResult, ValidationChain } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Validate request body against specific rules
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: "Validation failed",
      details: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
    return;
  }
  next();
};

// Validation rules for authentication
export const authValidationRules = {
  signup: (): ValidationChain[] => [
    require("express-validator").body("contact")
      .trim()
      .matches(/^[0-9]{10}$/)
      .withMessage("Contact must be a valid 10-digit phone number"),
    require("express-validator").body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage("Password must contain uppercase, lowercase, and numbers"),
    require("express-validator").body("role")
      .isIn(["owner", "tenant"])
      .withMessage("Role must be either owner or tenant"),
  ],

  login: (): ValidationChain[] => [
    require("express-validator").body("contact")
      .trim()
      .matches(/^[0-9]{10}$/)
      .withMessage("Contact must be a valid 10-digit phone number"),
    require("express-validator").body("password")
      .notEmpty()
      .withMessage("Password is required"),
  ],
};

// Validation rules for properties
export const propertyValidationRules = {
  create: (): ValidationChain[] => [
    require("express-validator").body("name")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Property name must be at least 3 characters"),
    require("express-validator").body("address")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Address must be at least 5 characters"),
    require("express-validator").body("city")
      .trim()
      .isLength({ min: 2 })
      .withMessage("City must be at least 2 characters"),
    require("express-validator").body("price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),
    require("express-validator").body("type")
      .isIn(["Studio", "Apartment", "Villa", "Penthouse", "Independent House"])
      .withMessage("Invalid property type"),
    require("express-validator").body("bedrooms")
      .isInt({ min: 0 })
      .withMessage("Bedrooms must be a non-negative number"),
    require("express-validator").body("bathrooms")
      .isFloat({ min: 0 })
      .withMessage("Bathrooms must be a non-negative number"),
  ],

  update: (): ValidationChain[] => [
    require("express-validator").body("name")
      .optional()
      .trim()
      .isLength({ min: 3 })
      .withMessage("Property name must be at least 3 characters"),
    require("express-validator").body("price")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),
  ],
};

// Validation rules for operations
export const operationValidationRules = {
  task: (): ValidationChain[] => [
    require("express-validator").body("title")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters"),
    require("express-validator").body("propertyId")
      .notEmpty()
      .withMessage("Property ID is required"),
  ],

  appointment: (): ValidationChain[] => [
    require("express-validator").body("propertyId")
      .notEmpty()
      .withMessage("Property ID is required"),
    require("express-validator").body("date")
      .isISO8601()
      .withMessage("Date must be a valid ISO8601 date"),
    require("express-validator").body("time")
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage("Time must be in HH:MM format"),
  ],

  payment: (): ValidationChain[] => [
    require("express-validator").body("rentalId")
      .notEmpty()
      .withMessage("Rental ID is required"),
    require("express-validator").body("amount")
      .isFloat({ min: 0 })
      .withMessage("Amount must be a positive number"),
  ],
};

// Sanitization helpers
export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

export const sanitizePhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, "");
};

// Type-safe validation helpers
export const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-f]{24}$/.test(id.toLowerCase());
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, "");
  return cleanPhone.length === 10;
};

export const isValidPrice = (price: number | string): boolean => {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return !isNaN(num) && num >= 0;
};
