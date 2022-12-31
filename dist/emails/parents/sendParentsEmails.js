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
const transporter_1 = __importDefault(require("../transporter"));
const sendParentsReqEmail = (email, name) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: "guident.team@gmail.com",
        to: email,
        subject: "Ayoscript from guident",
        text: `Hello ${name} your registration  with this ${email} was createdfully successfully`,
        html: `
        <div style"display:'block',width:'100%'">
             <div>
                 <h1>Welcome to guident</h1>
                 <p>Hello ${name} your school account with this ${email} was createdfully successfully</p>
             </div>
        </div>
    `,
    };
    // send email after successful signup
    yield (yield (0, transporter_1.default)()).sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error.message);
        }
        else {
            console.log("Email sent: " + info.response);
        }
    });
    //
});
exports.default = sendParentsReqEmail;
