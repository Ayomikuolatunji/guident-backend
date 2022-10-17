import mongoose from "mongoose";

const parentSchema = new mongoose.Schema({
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
});

export default mongoose.model("parentSchema", parentSchema);
