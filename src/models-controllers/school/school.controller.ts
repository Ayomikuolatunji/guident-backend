import expressAsyncHandler from "express-async-handler";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { throwError } from "../../middleware/ControllerError";
import schoolSchema from "./school.model";
import { SchoolSchema } from "../../ts-interface--models/models-interfaces";
import sendSchoolReqEmail from "../../emails/schools/SchoolRegEmail";

dotenv.config();

export const createSchoolAccount = expressAsyncHandler(async (req, res) => {
  const IfSchoolExits = await schoolSchema.findOne<SchoolSchema>({
    school_email: req.body.school_email,
  });
  if (IfSchoolExits) {
    throwError("School already created with the email provided", 409);
  }
  const salt = await bcrypt.genSalt(15);
  const hashPassword = bcrypt.hashSync(req.body.admin_password, salt);
  const school = new schoolSchema<SchoolSchema>({
    ...(req.body as SchoolSchema),
    admin_password: hashPassword,
  });
  const result = await school.save();
  if (result) {
    const result = await school.save();
    sendSchoolReqEmail(result.school_email!, result.school_name!);
  }
  res.status(StatusCodes.OK).json({ message: "Account created successfully" });
});

export const loginSchoolAccount = expressAsyncHandler(
  async (req, res, next) => {
    const email = req.body.school_email;
    const admin_password = req.body.admin_password;
    const loginSchool = await schoolSchema.findOne<SchoolSchema>({
      email: email,
    });
    const comparePassword = bcrypt.compareSync(
      admin_password,
      loginSchool?.admin_password!
    );
    if (!comparePassword) {
      throwError("Invalid email or password", StatusCodes.BAD_REQUEST);
    }
    const token = jwt.sign(
      {
        school_email: loginSchool?.school_email,
        id: loginSchool?._id!.toString(),
      },
      `${process.env.JWT_SECRET_KEY}`,
      { expiresIn: "30d" }
    );
    res.status(StatusCodes.OK).json({
      message: "Login successfully",
      school_credentials: { token: token, school_id: loginSchool?._id },
    });
  }
);

export const all_createdSchools = expressAsyncHandler(
  async (req, res, next) => {
    const all_schools = await schoolSchema.find({});
    res
      .status(StatusCodes.OK)
      .json({ message: "All created school data", all_schools });
  }
);

export const resetSchoolAccountPassword = expressAsyncHandler(
  (req, res, next) => {}
);

export const updatePassword = expressAsyncHandler(async (req, res, next) => {});

export const updateSchoolEmail = expressAsyncHandler(
  async (req, res, next) => {}
);
