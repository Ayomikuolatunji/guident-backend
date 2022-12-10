import expressAsyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  ParentSchema,
  SchoolSchema,
} from "../../ts-interface--models/models-interfaces";
import parentSchema from "./parents.model";
import schoolSchema from "../school/school.model";
import { throwError } from "../../middleware/ControllerError";
import sendParentsReqEmail from "../../emails/parents/sendParentsEmails";

export const createParentStudentAccount = expressAsyncHandler(
  async (req, res, next) => {
    const { school_id } = req.query;
    const findSchool = await schoolSchema.findById({
      _id: school_id,
    });
    if (!findSchool) {
      throwError("You need to provide valid the school _id", 404);
      next();
    }
    let _id: string = "";
    const parentStudentAccount = new parentSchema<ParentSchema>({
      ...req.body,
    });
    if (parentStudentAccount)
      _id = parentStudentAccount._id! as unknown as string;
    await parentStudentAccount.save();
    findSchool?.school_students_parents.push(_id);
    await findSchool!.save();
    sendParentsReqEmail(
      parentStudentAccount?.parent_email!,
      parentStudentAccount?.student_name!
    );
    res
      .status(StatusCodes.OK)
      .json({ Message: "student admitted successfully" });
  }
);

export const getSchoolStudents = expressAsyncHandler(async () => {});

export const loginParents = expressAsyncHandler(async (req, res, next) => {
  const parents_name = req.body.parents_email;
  const password = req.body.parent_password;
  if (!parents_name) {
    throwError("No body field must be empty", 422);
  }
  const findOne = await parentSchema.findById<ParentSchema>({
    parents_name: parents_name,
  });
  const comparePassword = bcrypt.compareSync(password, findOne?.parent_name!);
  if (!comparePassword) {
    throwError("Invalid email or password", StatusCodes.BAD_REQUEST);
  }
  const token = jwt.sign(
    {
      parent_email: findOne?.parent_name,
      id: findOne?._id!.toString(),
    },
    `${process.env.JWT_SECRET_KEY}`,
    { expiresIn: "30d" }
  );
  res.status(StatusCodes.OK).json({
    message: "Login successfully",
    school_credentials: { token: token, parent_id: findOne?._id },
  });
});
