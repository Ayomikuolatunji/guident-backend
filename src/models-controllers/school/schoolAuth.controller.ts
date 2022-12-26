import expressAsyncHandler from "express-async-handler";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import { HydratedDocument } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { throwError } from "../../middleware/ControllerError";
import schoolSchema from "./school.model";
import { SchoolSchema } from "../../ts-interface--models/models-interfaces";
import sendSchoolReqEmail from "../../emails/schools/SchoolRegEmail";
import {
  diff_minutes,
  getMutatedMongooseField,
  salt,
} from "../../helpers/utils";
import resetSchoolPassword from "../../emails/schools/ResetPasswordEmail";
import { generateOTP } from "../../helpers/opt-generator";

dotenv.config();

export const createSchoolAccount = expressAsyncHandler(
  async (req, res, next) => {
    const password = req.body.admin_password as string;
    const IfSchoolExits = await schoolSchema
      .findOne<SchoolSchema>({
        school_email: req.body.school_email,
      })
      .exec();
    if (IfSchoolExits) {
      throwError("School already exist", StatusCodes.UNPROCESSABLE_ENTITY);
    } else if (password === "") {
      throwError("password is required", StatusCodes.UNPROCESSABLE_ENTITY);
    } else if (password.length < 8) {
      throwError(
        "Password must be 8 characters long",
        StatusCodes.UNPROCESSABLE_ENTITY
      );
    }
    const hashPassword = await bcrypt.hash(password, await salt());
    const school = new schoolSchema({
      school_email: req.body.school_email,
      admin_password: hashPassword,
    });
    const result = await school.save();
    sendSchoolReqEmail(result.school_email!!, result.school_name!!);
    res.status(StatusCodes.OK).json({
      message: "Account created successfully, please verify your email address",
    });
  }
);

export const createSchoolProfile = expressAsyncHandler(async (req, res) => {
  const school_id = req.query.school_id;
  const IfSchoolExits = await schoolSchema.findOne({ _id: school_id });
  if (!IfSchoolExits)
    throwError(
      "Invalid school id was provide",
      StatusCodes.UNPROCESSABLE_ENTITY
    );
  else if (IfSchoolExits?._id.toString() !== req.id?.toString())
    throwError("You are not authorized", StatusCodes.UNPROCESSABLE_ENTITY);
  if (!req.body.school_name)
    throwError("school_name", StatusCodes.UNPROCESSABLE_ENTITY);
  else if (!req.body.rc_number)
    throwError("RC number required", StatusCodes.UNPROCESSABLE_ENTITY);
  else if (!req.body.school_logo)
    throwError("School logo is required", StatusCodes.UNPROCESSABLE_ENTITY);
  else if (!req.body.admin_first_name)
    throwError("Admin first name", StatusCodes.UNPROCESSABLE_ENTITY);
  else if (!req.body.phone_number)
    throwError("Admin phone number", StatusCodes.UNPROCESSABLE_ENTITY);
  else if (!req.body.admin_position)
    throwError("Admin position required", StatusCodes.UNPROCESSABLE_ENTITY);
  else if (!IfSchoolExits?.emailVerification)
    throwError(
      "Please verify your email address, or you contact guident customer care",
      StatusCodes.UNPROCESSABLE_ENTITY
    );
  await schoolSchema.updateOne(
    { _id: school_id },
    {
      school_name: req.body.school_name,
      school_address: req.body.school_address,
      rc_number: req.body.rc_number,
      school_logo: req.body.school_logo,
      admin_first_name: req.body.admin_first_name,
      admin_last_name: req.body.admin_last_name,
      phone_number: parseInt(req.body.phone_number),
      admin_position: req.body.admin_position,
      profile_completed: true,
      emailVerification: true,
    },
    {
      upsert: true,
    }
  );
  res.status(200).json({
    message: "Profile updated successfully",
  });
});

export const loginSchoolAccount = expressAsyncHandler(
  async (req, res, next) => {
    const email = req.body.school_email;
    const admin_password = req.body.admin_password;
    if (!email || !admin_password)
      throwError("Password and email is required", StatusCodes.BAD_REQUEST);
    const findSchool = await schoolSchema.findOne({
      school_email: email,
    });
    if (!findSchool)
      throwError("Account does not exits", StatusCodes.UNPROCESSABLE_ENTITY);
    else if (!findSchool?.emailVerification) {
      throwError("Please verify your email address", StatusCodes.FORBIDDEN);
    }
    const comparePassword = await bcrypt.compare(
      admin_password,
      findSchool?.admin_password!
    );
    if (!comparePassword) {
      throwError("Invalid password", StatusCodes.BAD_REQUEST);
    }
    const token = jwt.sign(
      {
        email: findSchool?.school_email,
        id: findSchool?._id!.toString(),
        emailVerify: true,
      },
      `${process.env.JWT_SECRET_KEY}`,
      { expiresIn: "30d" }
    );
    res.status(StatusCodes.OK).json({
      message: "Login successfully",
      school_credentials: {
        token: token,
        school_id: findSchool?._id,
        is_profile_completed: findSchool?.profile_completed,
      },
    });
  }
);

export const profileUpdate = expressAsyncHandler(async (req, res, next) => {
  const school_id = req.query.school_id;
  const IfSchoolExits: HydratedDocument<SchoolSchema, any, {}> =
    await schoolSchema.findOne({
      _id: school_id,
    });
  if (!IfSchoolExits)
    throwError(
      "Invalid query id was provide",
      StatusCodes.UNPROCESSABLE_ENTITY
    );
  res.status(200).json({
    message: "School status fetched",
    data: {
      profileUpdate: IfSchoolExits.profile_completed,
    },
  });
});

export const all_createdSchools = expressAsyncHandler(
  async (req, res, next) => {
    const all_schools = await schoolSchema.find({});
    const schoolArrays: SchoolSchema[] = [];
    all_schools.forEach((ele) => {
      const newObj = getMutatedMongooseField({
        field: ele._doc!,
        item: "admin_password",
      });
      schoolArrays.push(newObj as any);
    });
    res
      .status(StatusCodes.OK)
      .json({ message: "All created school data", data: schoolArrays });
  }
);

export const resetSchoolAccountPassword = expressAsyncHandler(
  async (req, res, next) => {
    const schoolEmail = req.body.school_email;
    if (!schoolEmail)
      throwError(
        "school email is not provided",
        StatusCodes.UNPROCESSABLE_ENTITY
      );
    const findSchool = await schoolSchema.findOne({
      school_email: schoolEmail,
    });
    if (!findSchool)
      throwError(
        "School does not exist with the email provided",
        StatusCodes.UNPROCESSABLE_ENTITY
      );
    const otp = generateOTP();
    await schoolSchema.updateOne({ school_email: schoolEmail }, { otp: otp });
    resetSchoolPassword(
      findSchool?.school_email!,
      findSchool?.school_name!,
      otp
    );
    res.status(StatusCodes.OK).json({ message: "Opt sent successfully" });
  }
);

export const requestVerificationOtp = expressAsyncHandler(
  async (req, res, next) => {
    const schoolEmail = req.body.school_email;
    if (!schoolEmail)
      throwError(
        "school email is not provided",
        StatusCodes.UNPROCESSABLE_ENTITY
      );
    const findSchool = await schoolSchema.findOne({
      school_email: schoolEmail,
    });
    if (!findSchool)
      throwError(
        "School does not exist with the email provided",
        StatusCodes.UNPROCESSABLE_ENTITY
      );
    const otp = generateOTP();
    await schoolSchema.updateOne({ _id: findSchool?._id }, { otp: otp });
    resetSchoolPassword(
      findSchool?.school_email!,
      findSchool?.school_name!,
      otp
    );
    res.status(StatusCodes.OK).json({ message: "Opt sent successfully" });
  }
);

export const verifyEmailAccount = expressAsyncHandler(
  async (req, res, next) => {
    const otp = req.body.otp;
    const schoolEmail = req.body.school_email;
    const findAccountByOtp = await schoolSchema
      .findOne<SchoolSchema>({
        otp: otp,
        school_email: schoolEmail,
      })
      .exec();
    if (!otp || !schoolEmail)
      throwError(
        "Token or School email address are not provided",
        StatusCodes.UNPROCESSABLE_ENTITY
      );
    if (!findAccountByOtp)
      throwError("Request a new token", StatusCodes.UNPROCESSABLE_ENTITY);
    const dateElapseTime = diff_minutes(
      findAccountByOtp?.updatedAt!,
      new Date()
    );
    if (dateElapseTime > 3) {
      throwError("Token expired, try again", StatusCodes.UNPROCESSABLE_ENTITY);
    } else {
      await schoolSchema.updateOne(
        { _id: findAccountByOtp?._id! },
        { emailVerification: true, otp: "" }
      );
    }
    res
      .status(StatusCodes.OK)
      .json({ message: "Email verified successfully", otp });
  }
);
export const requestOtp = expressAsyncHandler(async (req, res, next) => {
  const schoolEmail = req.body.school_email;
  if (!schoolEmail)
    throwError(
      "school email is not provided",
      StatusCodes.UNPROCESSABLE_ENTITY
    );
  const findSchool = await schoolSchema.findOne({
    school_email: schoolEmail,
  });
  if (!findSchool)
    throwError(
      "School does not exist with the email provided",
      StatusCodes.UNPROCESSABLE_ENTITY
    );
  const otp = generateOTP();
  await schoolSchema.updateOne({ _id: findSchool?._id }, { otp: otp });
  resetSchoolPassword(findSchool?.school_email!, findSchool?.school_name!, otp);
  res.status(StatusCodes.OK).json({ message: "Opt sent successfully" });
});

export const verifyForgetPasswordOTp = expressAsyncHandler(
  async (req, res, next) => {
    const otp = req.body.otp;
    const findAccountByOtp = await schoolSchema
      .findOne<SchoolSchema>({
        otp: otp,
      })
      .exec();
    if (!otp)
      throwError(
        "Token not provided or invalid token",
        StatusCodes.UNPROCESSABLE_ENTITY
      );
    if (!findAccountByOtp)
      throwError("Request a new token", StatusCodes.UNPROCESSABLE_ENTITY);
    const dateElapseTime = diff_minutes(
      findAccountByOtp?.updatedAt!,
      new Date()
    );
    if (dateElapseTime > 2) {
      throwError("Token expired, try again", StatusCodes.UNPROCESSABLE_ENTITY);
    } else {
      await schoolSchema
        .updateOne({ _id: findAccountByOtp?._id }, { tokenVerification: true })
        .exec();
    }
    res
      .status(StatusCodes.OK)
      .json({ message: "You are verified to reset password", otp });
  }
);

export const updateSchoolPassword = expressAsyncHandler(
  async (req, res, next) => {
    const otp = req.query.otp;
    const newSchoolPassword = req.body.admin_password;
    const findbyOtp = await schoolSchema.findOne({
      otp: otp,
      tokenVerification: true,
    });
    if (!newSchoolPassword)
      throwError("Password not provided", StatusCodes.NOT_ACCEPTABLE);
    if (!findbyOtp)
      throwError(
        "Not allowed to update password, request new token",
        StatusCodes.NOT_ACCEPTABLE
      );
    const hashPassword = bcrypt.hashSync(newSchoolPassword, await salt());
    await schoolSchema.updateOne(
      { otp: otp },
      { tokenVerification: false, otp: "", admin_password: hashPassword },
      {
        upsert: true,
      }
    );
    res.status(200).json({ message: "Password updated successfully" });
  }
);
