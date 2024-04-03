
import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
import { connectToDB } from "@/utils/db";
import sendEmail from "@/utils/mailer";

export async function POST(req) {
  try {
    const { name, email, userType } = await req.json();

    // const hashedPassword = await bcrypt.hash(password, 10);
   const user=await User.create({ name, email, password: 'default', role: userType, status: 'Setup' });
  

   const passwordToken = await user.generatePasswordToken();
   await user.save()
   const resetPasswordUrl=`http://localhost:3000/admin/generatePassword/${passwordToken}`
   const message=`User password generation link is : ${resetPasswordUrl}`

   await sendEmail({
    message,
    email
   })
    
    return NextResponse.json({ message: "User registered." }, { status: 201 });
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      { message: "An error occurred while registering the user." },
      { status: 500 }
    );
  }
}