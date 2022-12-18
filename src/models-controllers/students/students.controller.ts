import expressAsyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  StudentSchema,
  SchoolSchema,
} from "../../ts-interface--models/models-interfaces";
import studentSchema from "./students.model";
import schoolSchema from "../school/school.model";
import { throwError } from "../../middleware/ControllerError";
import sendParentsReqEmail from "../../emails/parents/sendParentsEmails";
import { getUniqueName, salt } from "../../helpers/utils";

export const admitStudentBySchool = expressAsyncHandler(
  async (req, res, next) => {
    const { school_id } = req.query;
    const body = { ...req.body } as StudentSchema;
    const findSchool = await schoolSchema
      .findOne({
        _id: school_id,
      })
      .populate("school_students_parents")
      .select("school_students_parents");

    if (!findSchool) {
      throwError("You need to provide valid the school _id", 404);
    }
    if (findSchool?._id.toString() !== req.id?.toString())
      throwError("You are not authorized", StatusCodes.UNPROCESSABLE_ENTITY);
    const findStudent = await studentSchema.findOne({
      parent_email: body.parent_email,
      student_name: body.student_name,
      parent_phone_number: body.parent_phone_number,
    });
    const studentExit = findSchool?.school_students_parents!.find(
      (id: StudentSchema) =>
        id?._id!.toString() === findStudent?._id!.toString()
    );

    if (findStudent || studentExit) {
      throwError("Student is already admitted", StatusCodes.CONFLICT);
    } else {
      let _id: string = "";
      if (!body?.parent_password!)
        throwError("Password required", StatusCodes.UNPROCESSABLE_ENTITY);
      const hashPassword = await bcrypt.hash(
        body?.parent_password!,
        await salt()
      );
      if (!hashPassword)
        throwError(
          "Password cant be hashed, try again",
          StatusCodes.UNPROCESSABLE_ENTITY
        );
      const parentStudentAccount = new studentSchema({
        ...req.body,
        parent_password: hashPassword,
        user_name: getUniqueName(body.student_name).split(" ")[1],
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
        message: "Student admitted successfully",
        userName: getUniqueName(body.student_name).split(" ")[1],
        password: body.parent_password,
      });
    }
  }
);

export const getSchoolStudents = expressAsyncHandler(async (req, res, next) => {
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

  if (findSchool?._id.toString() !== req.id?.toString())
    throwError("You are not authorized", StatusCodes.UNPROCESSABLE_ENTITY);
  let _id: string = "";
  res
    .status(StatusCodes.OK)
    .json({ message: "Fetched successfully", data: findSchool });
});

export const loginParents = expressAsyncHandler(async (req, res, next) => {
  const parents_name = req.body.parents_email;
  const password = req.body.parent_password;
  if (!parents_name) {
    throwError("No body field must be empty", 422);
  }
  const findOne = await studentSchema.findById<StudentSchema>({
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
