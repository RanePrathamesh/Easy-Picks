import { NextResponse } from "next/server";
import Newsletter from "@/models/newsletter";
import Category from "@/models/category";
import { generateEmailBody, sendEmail } from "@/utils/nodemailer";

export async function PUT(req) {
  try {
    const { email } = await req.json();
    if (email) {
      const existingSubscriber = await Newsletter.findOne({ email });
      if (existingSubscriber && existingSubscriber.isSubscribed) {
        await Newsletter.updateOne(
          { email },
          { $set: { isSubscribed: false } }
        );
        return new NextResponse({
          status: 200,
          body: { success: true, message: "Subscription updated successfully" },
        });
      } else {
        return new NextResponse({
          status: 400,
          body: {
            success: false,
            message: "Email not found or not subscribed",
          },
        });
      }
    } else {
      return new NextResponse({
        status: 400,
        body: { success: false, message: "Invalid request" },
      });
    }
  } catch (error) {
    console.error("Error in PUT request:", error);
    return new NextResponse({
      status: 500,
      body: { success: false, message: "Internal server error" },
    });
  }
}

export async function POST(req) {
  try {
    let { email, interest, pathname } = await req.json();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      console.error("Invalid email address");
      return NextResponse.json(
        { message: "Invalid email address." },
        { status: 400 }
      );
    }
    if (interest && interest.length === 24) {
      try {
        const category = await Category.findById(interest);
        interest = category ? category.categoryName : "Unknown Category";
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    }
    await Newsletter.create({ email, interest, pathname });
    const emailContent = await generateEmailBody("WELCOME", email);
    sendEmail(emailContent, email);
    return NextResponse.json(
      { message: "User Subscribed Successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error(error.message);
    return NextResponse.json(
      { message: "An error occurred while subscribing the user." },
      { status: 500 }
    );
  }
}
