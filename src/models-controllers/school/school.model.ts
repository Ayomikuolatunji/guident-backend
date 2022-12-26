import mongoose from "mongoose";
import bcrypt from "bcrypt";
// import jsonwebtoken from "jsonwebtoken"
import { SchoolSchema } from "../../ts-interface--models/models-interfaces";

const schoolSchema = new mongoose.Schema<SchoolSchema>(
  {
    school_name: {
      type: String,
      default: "",
      require: [true, "school_name is required"],
    },
    school_address: {
      type: String,
      default: "",
      require: [true, "school address is required"],
    },
    rc_number: {
      type: Number,
      default: "",
      require: [true, "rc number is required"],
    },
    school_logo: {
      type: String,
      default: "",
      require: [true, "school logo is required"],
    },
    admin_first_name: {
      type: String,
      default: "",
      require: [true, "admin firstname is required"],
    },
    admin_last_name: {
      type: String,
      default: "",
      require: [true, "admin lastname is required"],
    },
    phone_number: {
      type: Number,
      default: "",
      require: [true, "phone number is required"],
    },
    school_email: {
      type: String,
      require: [true, "rc number is required"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
      index: true,
    },
    admin_position: {
      type: String,
      default: "",
      require: [true, "rc number is required"],
    },
    otp: {
      type: String,
      default: "",
      require: [true, "rc number is required"],
      index: true,
    },
    tokenVerification: {
      type: Boolean,
      default: false,
    },
    emailVerification: {
      type: Boolean,
      default: false,
    },
    admin_password: {
      type: String,
      require: [true, "password field is empty"],
      unique: true,
    },
    school_students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "student",
      },
    ],
    profile_completed: {
      type: Boolean,
      default: false,
    },
    school_parents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "parents",
      },
    ],
  },
  { timestamps: true }
);

schoolSchema.set("autoIndex", true);

export default mongoose.model("school", schoolSchema);
