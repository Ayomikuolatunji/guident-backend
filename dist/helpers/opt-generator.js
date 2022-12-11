"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = void 0;
const otp_generator_1 = __importDefault(require("otp-generator"));
function generateOTP() {
    const OTP = otp_generator_1.default.generate(5, {
        upperCaseAlphabets: false,
        specialChars: false,
        digits: true
    });
    return OTP;
}
exports.generateOTP = generateOTP;
