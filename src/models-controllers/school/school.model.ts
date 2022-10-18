import mongoose from "mongoose";
import bcrypt from "bcrypt";
// import jsonwebtoken from "jsonwebtoken"
import { throwError } from "../../middleware/ControllerError";
import { SchoolSchema } from "../../ts-interface--models/models-interfaces";

const schoolSchema = new mongoose.Schema<SchoolSchema>(
  {
    school_name: {
      type: String,
      require: [true, "school_name is required"],
    },
    school_adress: {
      type: String,
      require: [true, "school adress is required"],
    },
    rc_number: {
      type: Number,
      require: [true, "rc number is required"],
    },
    school_logo: {
      type: String,
      require: [true, "school logo is required"],
    },
    admin_firstname: {
      type: String,
      require: [true, "admin firstname is required"],
    },
    admin_lastname: {
      type: String,
      require: [true, "admin lastname is required"],
    },
    phone_number: {
      type: Number,
      require: [true, "phone number is required"],
    },
    school_email: {
      type: String,
      require: [true, "rc number is required"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
    },
    admin_position: {
      type: String,
      require: [true, "rc number is required"],
    },
    admin_password: {
      type: String,
      require: [true, "password field is empty"],
      unique: true,
    },
    school_students_parents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
  },
  { timestamps: true }
);

schoolSchema.path("admin_password").validate(function (this: any) {
  const value = this.admin_password!;
  if (value === "") {
    throwError("Password should not be empty", 409);
  }
  return true;
});

schoolSchema.path("phone_number").validate(function (this: any) {
  const value = this.phone_number!;
  if (value === "") {
    throwError("phone_number should not be empty", 409);
  }
  return true;
});

schoolSchema.path("admin_lastname").validate(function (this: any) {
  const value = this.admin_lastname!;
  if (value === "") {
    throwError("admin last name is required", 409);
  }
  return true;
});

schoolSchema.path("school_adress").validate(function (this: any) {
  const value = this.school_adress!;
  if (value === "") {
    throwError("school address is required", 409);
  }
  return true;
});

schoolSchema.path("admin_firstname").validate(function (this: any) {
  const value = this.admin_firstname!;
  if (value === "") {
    throwError("admin first name is required", 409);
  }
  return true;
});

schoolSchema.path("school_name").validate(function (this: any) {
  const value = this.school_name!;
  if (value === "") {
    throwError("admin first name is required", 409);
  }
  return true;
});

export default mongoose.model("school", schoolSchema);
