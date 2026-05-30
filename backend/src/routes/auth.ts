import { Router } from "express";
import { auth } from "../middleware/auth";
import { signup, login, verifyToken } from "../controllers/authController";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify", auth, verifyToken);

export default router;
