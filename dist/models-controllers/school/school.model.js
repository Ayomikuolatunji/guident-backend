"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schoolSchema = new mongoose_1.default.Schema({
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
    },
    tokenVerification: {
        type: Boolean,
        default: false,
    },
    admin_password: {
        type: String,
        require: [true, "password field is empty"],
        unique: true,
    },
    school_students_parents: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Users",
        },
    ],
    profile_completed: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("school", schoolSchema);
