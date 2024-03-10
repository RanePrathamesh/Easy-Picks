import User from "@/models/user";
import { generateEmailBody, sendEmail } from "@/utils/nodemailer";
import { connectToDB } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToDB();
    const { email } = await req.json();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success:false,message:"user not exists" });
    }
    const passwordToken = await user.generatePasswordToken();
    await user.save();
    const emailContent = await generateEmailBody("RESET_PASSWORD", email, passwordToken);
      await sendEmail(emailContent, email);
    return NextResponse.json({ success: true, message:"Reset Link Sent Succesfully!" });
  } catch (error) {
    console.log(error);
  }
}
