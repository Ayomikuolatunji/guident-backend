"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const studentSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, { timestamps: true });
exports.default = mongoose_1.default.model("student", studentSchema);
