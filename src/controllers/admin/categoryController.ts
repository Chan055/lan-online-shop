import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { createError } from "../../utils/error";
import { errorCode } from "../../../config/errorCode";
import {
  createOneCategory,
  getCategoryById,
  getCategoryByName,
  updateOneCategory,
} from "../../services/categoryService";
interface CustomRequest extends Request {
  userId?: number;
  user?: any;
}
export const getAllCategories = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json({
    message: "Successfully get all categories",
  });
};

export const createCategory = [
  body("name", "Name is Required")
    .isString()
    .trim()
    .notEmpty()
    .escape()
    .isLength({ max: 52 }),
  body(
    "description",
    "description is required and should be less than 255 characters"
  )
    .isString()
    .trim()
    .notEmpty()
    .escape()
    .isLength({ max: 255 }),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    // If validation error occurs
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const { name, description } = req.body;
    const Cat = await getCategoryByName(name);
    if (Cat) {
      return next(
        createError("Category name already exists", 400, errorCode.invalid)
      );
    }

    const categoryData = { name, description };
    const category = await createOneCategory(categoryData);
    if (!category) {
      return next(
        createError("Failed to create category", 500, errorCode.severError)
      );
    }
    res.status(201).json({
      message: "Successfully create a category",
      categoryId: category.id,
    });
  },
];

export const updateCategory = [
  body("categoryId", "Invalid category ID").isInt({ gt: 0 }),
  body("name", "Name must be less than 52 characters")
    .isString()
    .trim()
    .notEmpty()
    .escape()
    .isLength({ max: 52 })
    .optional(),
  body("description", "description msut be less than 255 characters")
    .isString()
    .trim()
    .notEmpty()
    .escape()
    .isLength({ max: 255 })
    .optional(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    // If validation error occurs
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    const { categoryId, name, description } = req.body;
    let updatedData: any = {};
    const category = await getCategoryById(+categoryId);
    if (!category) {
      return next(createError("Category not found", 404, errorCode.invalid));
    }
    if (name) {
      const existingCategory = await getCategoryByName(name);
      if (existingCategory && existingCategory.id !== category.id) {
        return next(
          createError("Category name already exists", 400, errorCode.invalid)
        );
      }
      updatedData.name = name;
    }
    if (description) updatedData.description = description;

    const updatedCategory = await updateOneCategory(category.id, updatedData);
    if (!updatedCategory) {
      return next(
        createError("Failed to update category", 500, errorCode.severError)
      );
    }

    res.status(200).json({
      message: "Successfully update the category",
      categoryId: updatedCategory.id,
    });
  },
];

export const deleteCategory = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json({
    message: "Successfully get all categories",
  });
};
