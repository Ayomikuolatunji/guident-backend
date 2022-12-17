"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const parentSchema = new mongoose_1.default.Schema({
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
        ref: "Companies",
    },
    parent_password: {
        type: String,
    },
}, { timestamps: true });
parentSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcrypt_1.default.genSalt(12);
        this.parent_password = bcrypt_1.default.hashSync(this.parent_password, salt);
    });
});
// parentSchema.path("parent_password").validate(function (this: any) {
//   const value = this.parent_password!;
//   if (value === "") {
//     throwError("Password should not be empty", 409);
//   }
//   return true;
// });
exports.default = mongoose_1.default.model("parentSchema", parentSchema);
