import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { throwError } from "../../middleware/ControllerError";
import schoolSchema from "./school.model";
import { SchoolSchema } from "../../ts-interface--models/models-interfaces";
import sendSchoolReqEmail from "../../emails/schools/SchoolRegEmail";

dotenv.config();

export const createSchoolAccount = asyncHandler(async (req, res, next) => {
  const IfSchoolExits = await schoolSchema.findOne<SchoolSchema>({
    school_email: req.body.school_email,
  });
  if (IfSchoolExits) {
    throwError("School already created with the email provided", 409);
  }
  const school = new schoolSchema<SchoolSchema>({
    school_name: (req.body as { school_name: string }).school_name,
    school_adress: (req.body as { school_adress: string }).school_adress,
    rc_number: (req.body as { rc_number: number }).rc_number,
    school_logo: (req.body as { school_logo: string }).school_logo,
    admin_firstname: (req.body as { admin_firstname: string }).admin_firstname,
    admin_lastname:( req.body as {admin_lastname:string}).admin_lastname,
    phone_number: parseInt(req.body.phone_number),
    school_email: (req.body as { school_email: string }).school_email,
    admin_position: (req.body as { school_location: string }).school_location,
    admin_password: (req.body as { admin_password: string }).admin_password,
  });
  const result = await school.save();
  if (result) {
    const result = await school.save();
    sendSchoolReqEmail(result.school_email!, result.school_name!);
  }
  res.status(StatusCodes.OK).json({ message: "Account created successfully" });
});

export const loginSchoolAccount = asyncHandler(async (req, res, next) => {
  const email = (req.body as { school_email: string }).school_email;
  const password = (req.body as { admin_password: string }).admin_password;
  const loginSchool = await schoolSchema.findOne<SchoolSchema>({
    email: email,
  });
  const isEqual = await bcrypt.compare(password, loginSchool!.admin_password);
  if (!isEqual) {
    throwError("Invalid email or password", StatusCodes.BAD_REQUEST);
  }
  const token = jwt.sign(
    {
      email: loginSchool?.school_email,
      id: loginSchool?._id!.toString(),
    },
    `${process.env.JWT_SECRET_KEY?.toString()}`,
    { expiresIn: "30d" }
  );
  res.status(StatusCodes.OK).json({
    message: "Login successful",
    school_credentials: { token: token, school_id: loginSchool?._id },
  });
});

export const all_createdSchools = asyncHandler(async (req, res, next) => {
  const all_schools = await schoolSchema.find({});
  res
    .status(StatusCodes.OK)
    .json({ message: "All created school data", all_schools });
});

export const resetSchoolAccountPassword = asyncHandler((req, res, next) => {});

export const updatePassword = asyncHandler(async (req, res, next) => {});

export const updateOtherInfomation = asyncHandler((req, res, next) => {});
