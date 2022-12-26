import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { throwError } from "../../middleware/ControllerError";
import { StudentSchema } from "../../ts-interface--models/models-interfaces";

const studentSchema = new mongoose.Schema<StudentSchema>(
  {
    student_name: {
      type: String,
      require: [true, "student name is required"],
    },
    date_of_birth: {
      type: Date,
      require: [true, "student date of birth is required "],
    },
    nationality: {
      type: String,
      require: [true, "student nationality is required"],
    },
    state_of_origin: {
      type: String,
      require: [true, "student state of origin is required"],
    },
    local_government_area: {
      type: String,
      require: [true, "student nationality is required"],
    },
    profile_picture: {
      type: String,
      require: [true, "Student profile picture is required"],
    },
    student_intended_class: {
      type: String,
      require: [true, "students intended class is required"],
    },
    user_name: {
      type: String,
    },
    parent_ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "parents",
    },
    school_ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "parents",
    },
  },
  { timestamps: true }
);

export default mongoose.model("student", studentSchema);
