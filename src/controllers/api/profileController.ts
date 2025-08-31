import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { createError } from "../../utils/error";
import { errorCode } from "../../../config/errorCode";
import { unlink } from "node:fs/promises";
import path from "path";
import { getUserById, updateUser } from "../../services/authService";

const removeFiles = async (originalFile: string) => {
  try {
    const originalFilePath = path.join(
      __dirname,
      "../../..",
      "/uploads/images",
      originalFile
    );

    // await safeUnlink(originalFilePath);  // Use this For windows error - 'EPERM' or 'EBUSY'
    await unlink(originalFilePath);
  } catch (error) {
    console.log(error);
  }
};
interface CustomRequest extends Request {
  userId?: number;
}
export const updateProfile = [
  body("name", "Name is too long").optional().isString().isLength({ max: 52 }),
  body("birthDate", "Birth date must be a valid ISO8601 date (YYYY-MM-DD)")
    .optional()
    .isISO8601()
    .toDate(),
  body("address", "Address must be a string with a maximum of 255 characters")
    .optional()
    .isString()
    .isLength({ max: 255 }),
  body(
    "gender",
    "Gender must be one of MALE, FEMALE, OTHER, or PREFER_NOT_TO_SAY"
  )
    .optional()
    .isIn(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]),

  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    // If validation error occurs
    if (errors.length > 0) {
      if (req.file) {
        await removeFiles(req.file.filename);
      }
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const { name, birthDate, address, gender } = req.body;
    const userId = req.userId;

    const user = await getUserById(userId!);
    if (!user) {
      if (req.file) {
        await removeFiles(req.file.filename);
      }
      return next(
        createError("User not found.", 404, errorCode.unauthenticated)
      );
    }

    let updatedData: any = {};
    if (name) updatedData.name = name;
    if (birthDate) updatedData.birthDate = birthDate;
    if (address) updatedData.address = address;
    if (gender) updatedData.gender = gender;
    if (req.file) {
      updatedData.image = req.file.filename;
      if (user.image) {
        await removeFiles(user.image);
      }
    }
    const updatedUser = await updateUser(userId!, updatedData);

    res.status(200).json({
      message: "Profile updated successfully",
      userId: updatedUser.id,
    });
  },
];

export const getProfile = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;

  const user = await getUserById(userId!);
  if (!user) {
    return next(createError("User not found.", 404, errorCode.unauthenticated));
  }

  res.status(200).json({
    id: user.id,
    name: user.name,
    email: user.email,
    birthDate: user.birthDate,
    address: user.address,
    image: user.image,
  });
};

/*
name
 birthDate
 address
 image    
 gender 
 */
