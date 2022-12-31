import transporter from "../transporter";

const resetSchoolPassword = async (
  email: string,
  name: string,
  otp: string
) => {
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
  (await transporter()).sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error.message);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  //
};

export default resetSchoolPassword;
