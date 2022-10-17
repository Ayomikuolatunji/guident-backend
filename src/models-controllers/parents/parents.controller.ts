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
    const { school_id } = req.params;
    // check if school exits for this particular parents(child)
    const findSchool: any = await schoolSchema.findById<SchoolSchema>({
      _id: school_id,
    });
    if (!findSchool) {
      throwError("You need to provide the school _id", 404);
    }
    let _id: string = "";
    const parentStudentAccount = new parentSchema<ParentSchema>({
      student_name: (req.body as { student_name: string }).student_name,
      date_of_birth: (req.body as { date_of_birth: Date }).date_of_birth,
      nationality: (req.body as { nationality: string }).nationality,
      state_of_origin: (req.body as { state_of_origin: string })
        .state_of_origin,
      local_government_area: (req.body as { local_government_area: string })
        .local_government_area,
      profile_picture: (req.body as { profile_picture: string })
        .profile_picture,
      parents_name: (req.body as { student_name: string }).student_name,
      parents_phone_number: (req.body as { parents_phone_number: number })
        .parents_phone_number,
      parents_address: (req.body as { parents_address: string })
        .parents_address,
      parents_email: (req.body as { parents_email: string }).parents_email,
      students_intended_class: (req.body as { students_intended_class: string })
        .students_intended_class,
      school_ref: school_id,
      parent_password: (req.body as { parent_password: string })
        .parent_password,
    });
    if (parentStudentAccount)
      _id = parentStudentAccount._id! as unknown as string;
    // check if student already exits
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

export const loginParents = expressAsyncHandler(async (req, res, next) => {});
