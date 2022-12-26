import mongoose from "mongoose";
import { ParentSchema } from "../../ts-interface--models/models-interfaces";

const parentSchema = new mongoose.Schema<ParentSchema>(
  {
    parent_email: {
      type: String,
    },
    parent_name: {
      type: String,
    },
    parent_phone_number: {
      type: Number,
    },
    parent_address: {
      type: String,
    },
    school_ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "school",
    },
    parent_password: {
      type: String,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "student",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("parents", parentSchema);
