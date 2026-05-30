import { Router } from "express";
import { auth } from "../middleware/auth";
import {
  getProperties,
  getMyProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyController";

const router = Router();

router.get("/", getProperties);
router.get("/my-properties", auth, getMyProperties);
router.get("/:id", getPropertyById);
router.post("/", auth, createProperty);
router.put("/:id", auth, updateProperty);
router.delete("/:id", auth, deleteProperty);

export default router;
