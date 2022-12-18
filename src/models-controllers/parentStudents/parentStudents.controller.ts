import expressAsyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  ParentSchema,
  SchoolSchema,
} from "../../ts-interface--models/models-interfaces";
import parentSchema from "./parentStudents.model";
import schoolSchema from "../school/school.model";
import { throwError } from "../../middleware/ControllerError";
import sendParentsReqEmail from "../../emails/parents/sendParentsEmails";

export const admitStudentBySchool = expressAsyncHandler(
  async (req, res, next) => {
    const { school_id } = req.query;
    const findSchool = await schoolSchema
      .findOne({
        _id: school_id,
      })
      .populate("school_students_parents")
      .select("school_students_parents");

    if (!findSchool) {
      throwError("You need to provide valid the school _id", 404);
    }

    findSchool?.school_students_parents.forEach((child: ParentSchema) => {
      if (
        req.body.student_name === child.student_name &&
        req.body.parent_name === child.parent_name &&
        req.body.parent_email === child.parent_email
      ) {
        throwError(
          "This student is already admitted",
          StatusCodes.UNPROCESSABLE_ENTITY
        );
      }
    });
    if (findSchool?._id.toString() !== req.id?.toString())
      throwError("You are not authorized", StatusCodes.UNPROCESSABLE_ENTITY);
    let _id: string = "";
    const parentStudentAccount = new parentSchema({
      ...req.body,
    });
    if (parentStudentAccount) _id = parentStudentAccount._id! as string;
    await parentStudentAccount.save();
    findSchool?.school_students_parents.push(_id);
    await findSchool!.save();
    sendParentsReqEmail(
      parentStudentAccount?.parent_email!,
      parentStudentAccount?.student_name!
    );
    res.status(StatusCodes.OK).json({
      Message: "student admitted successfully",
      findSchool: findSchool?.school_students_parents,
    });
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
      email: findOne?.parent_name,
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
