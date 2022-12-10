import otpGenerator from "otp-generator";

export function generateOTP(): string {
  const OTP = otpGenerator.generate(5, {
    upperCaseAlphabets: false,
    specialChars: false,
    digits:true
  });
  return OTP;
}
