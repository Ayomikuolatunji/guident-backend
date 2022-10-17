import mongoose from "mongoose";

const ParentSchema = new mongoose.Schema({
  student_name: {
    type: String,
    require:[true, "student name is required"]
  },
  date_of_birth: {
    type: Date,
    require:[true, "student date "]
  }
});
