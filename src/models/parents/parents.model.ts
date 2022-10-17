import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { throwError } from "../../middleware/ControllerError";

const parentSchema = new mongoose.Schema(
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
    parents_name: {
      type: String,
      require: [true, "Guardian name is required"],
    },
    parents_phone_number: {
      type: Number,
      require: [true, "Guardian phone number is required"],
    },
    parents_address: {
      type: String,
      require: [true, "Guardian address is required"],
    },
    students_intended_class: {
      type: String,
      require: [true, "students intended class is required"],
    },
    school_ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Companies",
    },
    parent_password: {
      type: String,
    },
  },
  { timestamps: true }
);

parentSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(12);
  this.parent_password = bcrypt.hashSync(this.parent_password!, salt);
});

parentSchema.path("admin_password").validate(function (this: any) {
  const value = this.admin_password!;
  if (value === "") {
    throwError("Password should not be empty", 409);
  }
  return true;
});

export default mongoose.model("parentSchema", parentSchema);
