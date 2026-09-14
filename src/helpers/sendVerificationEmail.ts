import { resend } from "../lib/resend";
import VerificationEmail from "@/emails/VerificationEmail";
import { Apiresponse } from "../types/Apiresponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<Apiresponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: "Mystry message | Verification code",
            react: VerificationEmail({username, otp: verifyCode})
        });
        return {success: true, message: 'Failed to send verification email send successfully'}
    } catch (emailError) {
        console.log("Error sending verifiaction email", emailError)
        return {success: false, message: 'Failed to send verification email'}
    }
}