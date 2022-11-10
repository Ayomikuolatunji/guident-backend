import expressAsyncHandler from "express-async-handler";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { throwError } from "../../middleware/ControllerError";
import schoolSchema from "./school.model";
import { SchoolSchema } from "../../ts-interface--models/models-interfaces";
import sendSchoolReqEmail from "../../emails/schools/SchoolRegEmail";
import { getMutatedMomgooseField } from "../../helpers/utils";

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
  const school = new schoolSchema({
    school_email: req.body.school_email,
    admin_password: hashPassword,
  });
  const result = await school.save();
  if (result) {
    sendSchoolReqEmail(result.school_email!, result.school_name!);
    res.status(StatusCodes.OK).json({
      message: "Account created successfully",
      data: getMutatedMomgooseField(result._doc, "admin_password"),
    });
  }
});

export const createSchoolProfile = expressAsyncHandler(async (req, res) => {
  const school_id = req.query.school_id;
  // check if school exits with the query id
  const IfSchoolExits = await schoolSchema.findOne({ _id: school_id });
  if (!IfSchoolExits)
    throwError(
      "Invalid query id was provide",
      StatusCodes.UNPROCESSABLE_ENTITY
    );
  const updateSchoolProfile = await schoolSchema.updateOne(
    { _id: school_id },
    {
      school_name: req.body.school_name,
      school_adress: req.body.school_adress,
      rc_number: req.body.rc_number,
      school_logo: req.body.school_logo,
      admin_firstname: req.body.admin_firstname,
      admin_lastname: req.body.admin_lastname,
      phone_number: parseInt(req.body.phone_number),
      admin_position: req.body.school_location,
    },
    {
      upsert: true,
    }
  );
  res.status(200).json({
    message: "Updates profile successfully",
    data: updateSchoolProfile,
  });
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
    const schoolArrays = <SchoolSchema>(<unknown>[]);
    all_schools.forEach((ele) => {
      const newObj = <SchoolSchema>(
        getMutatedMomgooseField(ele._doc, "admin_password")
      );
      schoolArrays.push(newObj);
    });
    res
      .status(StatusCodes.OK)
      .json({ message: "All created school data", data: schoolArrays });
  }
);

export const resetSchoolAccountPassword = expressAsyncHandler(
  (req, res, next) => {}
);

export const updatePassword = expressAsyncHandler(async (req, res, next) => {});

export const updateSchoolEmail = expressAsyncHandler(
  async (req, res, next) => {}
);
