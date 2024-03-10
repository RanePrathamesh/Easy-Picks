import { NextResponse } from "next/server";
import crypto from "node:crypto";
import User from "@/models/user"; 

export async function POST(req) {
  try {
    const { token, password } = await req.json();
    const generatepasswordtoken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      createPasswordToken: generatepasswordtoken,
      createPasswordExpiry: { $gt: Date.now() }, 
    });

    if (!user) {
      throw new Error('Invalid or expired token');
    }

    user.password = password;
    user.status = "Active";
    user.createPasswordToken = null;
    user.createPasswordExpiry = null;

    await user.save();

    return NextResponse.json({ message: "Password Setting Operation Success." }, { status: 201 });
  } catch (error) {
    console.error('Password Setting Issue - ', error);
    return NextResponse.json({ message: "Password Setting Operation Failure." }, { status: 400 });
  }
}
