import express from "express";
import { auth } from "../../../middlewares/auth";
import {
  updateProfile,
  getProfile,
} from "../../../controllers/api/profileController";
import upload from "../../../middlewares/upload";
const router = express.Router();

router.post("/profile", auth, upload.single("image"), updateProfile);
router.get("/profile", auth, getProfile);

export default router;
