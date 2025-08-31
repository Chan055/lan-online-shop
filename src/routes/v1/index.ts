import express from "express";
import authRoutes from "./auth";
import adminRoutes from "./admin";
import userRoutes from "./api";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.use("/api/v1", authRoutes);
router.use("/api/v1/users", userRoutes);
router.use("/api/v1/admins", auth, adminRoutes);

export default router;
