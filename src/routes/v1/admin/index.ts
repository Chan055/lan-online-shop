import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../../../controllers/admin/categoryController";
const router = express.Router();

//categories CRUD
router.get("/categories", getAllCategories);
router.post("/categories", createCategory);
router.patch("/categories", updateCategory);
router.delete("/categories", deleteCategory);

export default router;
