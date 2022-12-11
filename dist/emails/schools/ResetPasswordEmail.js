"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transporter_1 = __importDefault(require("../transporter"));
const resetSchoolPassword = (email, name, otp) => {
    const mailOptions = {
        from: "guident.team@gmail.com",
        to: email,
        subject: "Ayoscript from guident",
        text: `Reset Account Password`,
        html: `
        <div style"display:'block',width:'100%'">
             <div>
                 <h1>Your one time OTP</h1>
                 <h3>Hello ${name}  </h3>
                 <h1>One time otp is <span style="font-size:40px">${otp}</span> </h1>
             </div>
        </div>
    `,
    };
    // send email after successful signup
    transporter_1.default.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error.message);
        }
        else {
            console.log("Email sent: " + info.response);
        }
    });
    //
};
exports.default = resetSchoolPassword;
