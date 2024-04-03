
import { connectToDB } from "@/utils/db";
import { NextResponse } from "next/server";

connectToDB()
export async function GET(){
    try {
        let users=await User.find();      
       return NextResponse.json({
            users,
            success: true
        })
    } catch (error) {
        console.log("Error "+ error);
      return  NextResponse.json({
            message: error.message,
            success: true
        })
    }
}

export async function POST() {
    try {
      const adminUser = await User.findOne({ email: "developer@perfectlyokay.com" });
  
      if (!adminUser) {
  
        const defaultAdmin = new User({
          name: "Super Admin",
          email: "developer@perfectlyokay.com",
          password: "developer@pokay",
          role: "Admin",
          status: "Active",
        });
  
        await defaultAdmin.save();
        console.log("Default admin user created.");
      }
      return NextResponse.json({
        message: "Default admin user already there.",
        success: true,
      });
    } catch (error) {
      console.error("Error creating default admin user:", error.message);
      return NextResponse.json({
        message: "Error creating default admin user",
        success: false,
      });
    }
  }