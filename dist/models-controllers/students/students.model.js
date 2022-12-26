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
    student_intended_class: {
        type: String,
        require: [true, "students intended class is required"],
    },
    user_name: {
        type: String,
    },
    parent_ref: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "parents",
    },
    school_ref: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "parents",
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("student", studentSchema);
