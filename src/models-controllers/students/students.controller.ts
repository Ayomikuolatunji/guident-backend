import expressAsyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  StudentSchema,
  SchoolSchema,
  ParentSchema,
} from "../../ts-interface--models/models-interfaces";
import studentSchema from "./students.model";
import schoolSchema from "../school/school.model";
import parentSchema from "../parents/parents.model";
import { throwError } from "../../middleware/ControllerError";
import sendParentsReqEmail from "../../emails/parents/sendParentsEmails";
import { getUniqueName, salt } from "../../helpers/utils";

export const admitStudentBySchool = expressAsyncHandler(
  async (req, res, next) => {
    const { school_id } = req.query;
    const body = { ...req.body } as StudentSchema & ParentSchema;
    const findSchool = await schoolSchema
      .findOne({
        _id: school_id,
      })
      .populate("school_students school_parents")
      .select("school_students");

    console.log(findSchool);

    if (!findSchool) {
      throwError("You need to provide valid the school _id", 404);
    }
    if (findSchool?._id.toString() !== req.id?.toString())
      throwError("You are not authorized", StatusCodes.UNPROCESSABLE_ENTITY);
    const findStudent = await studentSchema.findOne({
      student_name: body.student_name,
    });
    const findParent = await parentSchema.findOne({
      parent_phone_number: body.parent_password,
      parent_email: body.parent_email,
      parent_name: body.parent_name,
    });
    const studentExit = findSchool?.school_students!.find(
      (id: StudentSchema) =>
        id?._id!.toString() === findStudent?._id!.toString()
    );
    const parentExit = findSchool?.school_parents!.find(
      (id: StudentSchema) => id?._id!.toString() === findParent?._id!.toString()
    );
    if ((findStudent && findParent) || studentExit) {
      throwError("Student is already admitted", StatusCodes.CONFLICT);
    } else {
      if (!body?.parent_password!)
        throwError("Password required", StatusCodes.UNPROCESSABLE_ENTITY);
      const hashPassword = await bcrypt.hash(
        body?.parent_password!,
        await salt()
      );
      if (!hashPassword)
        throwError(
          "Cant set password, try again",
          StatusCodes.UNPROCESSABLE_ENTITY
        );
      const studentAccount = new studentSchema({
        user_name: getUniqueName(body.student_name).split(" ")[1],
        student_name: body.student_name,
        date_of_birth: body.date_of_birth,
        nationality: body.nationality,
        state_of_origin: body.state_of_origin,
        local_government_area: body.local_government_area,
        profile_picture: body.profile_picture,
        student_intended_class: body.student_intended_class,
      });

      await studentAccount.save();
      if (!parentExit) {
        const createParentAccount = new parentSchema({
          parent_email: body.parent_email,
          parent_name: body.parent_name,
          parent_password: hashPassword,
          parent_phone_number: body.parent_phone_number,
          parent_address: body.parent_address,
          school_ref: findSchool?.id,
        });
        await createParentAccount.save();
        await createParentAccount?.students.push(studentAccount._id!);
        await createParentAccount.save();
        findSchool?.school_students!.push(studentAccount._id!);
        findSchool?.school_parents!.push(createParentAccount?._id as string);
        await findSchool?.save();
        await studentSchema?.updateOne(
          { _id: studentAccount._id },
          {
            school_ref: findSchool?._id,
            parent_ref: createParentAccount?._id,
          }
        );
      } else {
        findParent?.students?.push(studentAccount._id);
        await findParent?.save();
        findSchool?.school_students!.push(studentAccount._id!);
        await findSchool!.save();
        await studentSchema?.updateOne(
          { _id: studentAccount._id },
          {
            school_ref: findSchool?._id,
            parent_ref: findParent?._id,
          }
        );
      }
      sendParentsReqEmail(
        findParent?.parent_email!,
        studentAccount?.student_name!
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
    .populate("school_students")
    .select("school_students");
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
  const findOne = await parentSchema.findById({
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
