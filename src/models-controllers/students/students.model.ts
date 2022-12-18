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
    parent_email: {
      type: String,
      require: [true, "Student profile picture is required"],
    },
    parent_name: {
      type: String,
      require: [true, "Guardian name is required"],
    },
    parent_phone_number: {
      type: Number,
      require: [true, "Guardian phone number is required"],
    },
    parent_address: {
      type: String,
      require: [true, "Guardian address is required"],
    },
    student_intended_class: {
      type: String,
      require: [true, "students intended class is required"],
    },
    school_ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "school",
    },
    user_name: {
      type: String,
      require: [true, "students intended class is required"],
    },
    parent_password: {
      type: String,
      require: [true, "Guardian address is required"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("student", studentSchema);
