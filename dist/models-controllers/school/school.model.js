"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// import jsonwebtoken from "jsonwebtoken"
const ControllerError_1 = require("../../middleware/ControllerError");
const schoolSchema = new mongoose_1.default.Schema({
    school_name: {
        type: String,
        require: [true, "school_name is required"],
    },
    school_address: {
        type: String,
        require: [true, "school address is required"],
    },
    rc_number: {
        type: Number,
        require: [true, "rc number is required"],
    },
    school_logo: {
        type: String,
        require: [true, "school logo is required"],
    },
    admin_first_name: {
        type: String,
        require: [true, "admin firstname is required"],
    },
    admin_last_name: {
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
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Users",
        },
    ],
}, { timestamps: true });
schoolSchema.path("admin_password").validate(function () {
    const value = this.admin_password;
    if (value === "") {
        (0, ControllerError_1.throwError)("Password should not be empty", 409);
    }
    return true;
});
schoolSchema.path("phone_number").validate(function () {
    const value = this.phone_number;
    if (value === "") {
        (0, ControllerError_1.throwError)("phone_number should not be empty", 409);
    }
    return true;
});
schoolSchema.path("admin_last_name").validate(function () {
    const value = this.admin_last_name;
    if (value === "") {
        (0, ControllerError_1.throwError)("admin last name is required", 409);
    }
    return true;
});
schoolSchema.path("school_address").validate(function () {
    const value = this.school_address;
    if (value === "") {
        (0, ControllerError_1.throwError)("school address is required", 409);
    }
    return true;
});
schoolSchema.path("admin_first_name").validate(function () {
    const value = this.admin_first_name;
    if (value === "") {
        (0, ControllerError_1.throwError)("admin first name is required", 409);
    }
    return true;
});
schoolSchema.path("school_name").validate(function () {
    const value = this.school_name;
    if (value === "") {
        (0, ControllerError_1.throwError)("admin first name is required", 409);
    }
    return true;
});
exports.default = mongoose_1.default.model("school", schoolSchema);
