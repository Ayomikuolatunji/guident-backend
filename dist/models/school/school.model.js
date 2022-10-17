"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schoolSchema = new mongoose_1.default.Schema({
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
    },
    admin_position: {
        type: String,
        require: [true, "rc number is required"],
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("schoolSchemaData", schoolSchema);
