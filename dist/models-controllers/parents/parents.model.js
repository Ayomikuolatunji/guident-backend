"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const parentSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "school",
    },
    parent_password: {
        type: String,
    },
    students: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "student",
        },
    ],
}, { timestamps: true });
exports.default = mongoose_1.default.model("parents", parentSchema);
