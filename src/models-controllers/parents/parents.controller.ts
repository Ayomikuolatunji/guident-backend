import expressAsyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
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
    // check if school exits for this particular parents(child)
    const findSchool: any = await schoolSchema.findById<SchoolSchema>({
      _id: school_id,
    });
    if (!findSchool) {
      throwError("You need to provide valid the school _id", 404);
    }
    let _id: string = "";
    const parentStudentAccount = new parentSchema<ParentSchema>({
      ...req.body,
    });
    if (parentStudentAccount)
      _id = parentStudentAccount._id! as unknown as string;
    // check if student already exits
    if (
      await parentSchema.findOne({
        school_ref: parentStudentAccount.school_ref,
      })
    ) {
      throwError("Student already exits", 409);
    }
    await parentStudentAccount.save();
    // update employee id to school students  array
    findSchool?.school_students_parents.push(_id);
    await findSchool!.save();
    // send email to the student parent
    sendParentsReqEmail(
      parentStudentAccount?.parents_email!,
      parentStudentAccount?.student_name!
    );
    res
      .status(StatusCodes.OK)
      .json({ Message: "student admitted successfully" });
  }
);


export const getSchoolStudents=expressAsyncHandler(async()=>{

})

export const loginParents = expressAsyncHandler(async (req, res, next) => {
      const fullname = req.body.fullname
});
