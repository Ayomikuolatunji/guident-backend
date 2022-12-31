import { throwError } from "../../middleware/ControllerError";
import transporter from "../transporter";

const sendParentsReqEmail = async (email: string, name: string) => {
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
  (await transporter()).sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      throwError(error.message, 400);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  //
};

export default sendParentsReqEmail;
