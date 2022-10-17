import expressAsyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import {
  ParentSchema,
  SchoolSchema,
} from "../../ts-interface--models/models-interfaces";
import parentSchema from "./parents.model";
import schoolSchema from "../school/school.model";
import { throwError } from "../../middleware/ControllerError";

export const createParentStudentAccount = expressAsyncHandler(
  async (req, res, next) => {
    const schoolId = req.query.school_id as string;
    // check if school exits for this particular parents(child)
    const findSchool: any = await schoolSchema.findById<SchoolSchema>({
      _id: schoolId,
    });
    if (!findSchool) {
      throwError("You need to provide the school _id", 404);
    }
    let _id: string = "";
    const createParentStudentAccount = new parentSchema<ParentSchema>({
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
      students_intended_class: (req.body as { students_intended_class: string })
        .students_intended_class,
      school_ref: schoolId,
    });
    if (createParentStudentAccount)
      _id = createParentStudentAccount._id as unknown as string;
    // check if student already exits
    if (findSchool?.school_students_parents.includes(_id)) {
      throwError("Student already exits", 409);
    } else {
      await createParentStudentAccount.save();
    }
    // update employee id to school students  array
    findSchool?.school_students_parents.push(_id);
    await findSchool!.save();
    // add to a particular school
    res
      .status(StatusCodes.OK)
      .json({ Message: "student admitted successfully" });
  }
);

export const loginParents = expressAsyncHandler(async (req, res, next) => {});
