"use server";
import nodemailer from "nodemailer";

const Notification = {
  WELCOME: "WELCOME",
  CHANGE_OF_STOCK: "CHANGE_OF_STOCK",
  LOWEST_PRICE: "LOWEST_PRICE",
  THRESHOLD_MET: "THRESHOLD_MET",
  NEW_PRODUCT_NOTIFY: "NEW_PRODUCT_NOTIFY",
  RESET_PASSWORD: "RESET_PASSWORD",
};

export async function generateEmailBody(type, email, data = "", product) {
  const THRESHOLD_PERCENTAGE = 40;
  // Shorten the product title
  let subject = "";
  let body = "";
  let shortenedTitle = "";
  if (product) {
    shortenedTitle =
      product.title.length > 20
        ? `${product.title.substring(0, 20)}...`
        : product.title;
  }

  switch (type) {
    case Notification.WELCOME:
      subject = `Welcome to BestProducts `;
      body = `
      <div style="font-family: 'Arial', sans-serif; text-align: center; background-color: #f5f5f5; padding: 20px; border-radius: 10px;">
      <h2 style="color: #333; margin-bottom: 10px;">🌟 Welcome to BestProducts! 🌟</h2>
      <p style="font-size: 16px; color: #555;">You've just unlocked a world of exclusive updates on the best products across different stores! 🚀</p>
      <p style="font-size: 16px; color: #555;">Here's a glimpse of what's in store for you:</p>
      
      <div style="border: 1px solid #ccc; padding: 20px; background-color: #ffffff; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333;">🎉 When Products are Back in Stock!</h3>
          <p style="font-size: 16px; color: #555;">Exciting news! We've just restocked {productDetails}. 🛍️</p>
          <p style="font-size: 16px; color: #555;">Don't miss out - <a href="http://localhost/3000" style="color: #007bff; text-decoration: none;" target="_blank" rel="noopener noreferrer">buy it now</a>!</p>
          <img src="https://i.ibb.co/pwFBRMC/Screenshot-2023-09-26-at-1-47-50-AM.png" alt="Product Image" style="max-width: 100%; border-radius: 8px; margin-top: 10px;" />
      </div>
  
      <p style="font-size: 16px; color: #555;">But that's not all! Here's what else you can look forward to:</p>
      <ul style="list-style: none; padding: 0; margin: 10px 0;">
          <li style="font-size: 16px; color: #555;">📬 Regular newsletters with the latest product updates.</li>
          <li style="font-size: 16px; color: #555;">🎁 Exclusive offers and discounts on your favorite products.</li>
          <li style="font-size: 16px; color: #555;">🔥 Hot deals and trending products handpicked just for you.</li>
      </ul>
      
      <p style="font-size: 16px; color: #555;">Stay tuned for more updates on products you're interested in!</p>
      <p style="font-size: 16px; color: #555;">Happy shopping! 🛒</p>
      <a href="http://localhost:3000/unsubscribe?email=${email}" style="display: block; margin: 5px;">Unsubscribe</a>
  </div>  
      `;
      break;
    case Notification.NEW_PRODUCT_NOTIFY:
      subject = `🚀 New Arrival Alert: Best ${Category} Product Unveiled!`;
      body = `
       <div style="font-family: 'Arial', sans-serif; text-align: center; background-color: #f5f5f5; padding: 20px; border-radius: 10px;">
       <h2 style="color: #333; margin-bottom: 10px;">🌟 Exciting News! New Best Product Found! 🌟</h2>
        <p style="font-size: 16px; color: #555;">We're thrilled to share that we've discovered an incredible new product in the <a href="{categoryLink}" style="color: #007bff; text-decoration: none;" target="_blank" rel="noopener noreferrer">Best {category} Products</a> category!</p>
  
        <div style="border: 1px solid #ccc; padding: 20px; background-color: #ffffff; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333;">🌟 Introducing: {newProductTitle}!</h3>
          <p style="font-size: 16px; color: #555;">Check out this amazing product that we believe is the best in its category:</p>
          <a href="{newProductLink}" target="_blank" rel="noopener noreferrer">
              <img src="{newProductImage}" alt="{newProductTitle}" style="max-width: 100%; border-radius: 8px; margin-top: 10px;" />
          </a>
          <p style="font-size: 16px; color: #555;">Hurry, get yours now! <a href="{newProductLink}" style="color: #007bff; text-decoration: none;" target="_blank" rel="noopener noreferrer">Check it out</a>!</p>
        </div>
  
      <p style="font-size: 16px; color: #555;">Looking for more options? Explore similar products in the {category} category:</p>
      <a href="{categoryLink}" style="display: inline-block; margin: 10px 0; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;" target="_blank" rel="noopener noreferrer">Checkout Similar Products</a>
  
      <p style="font-size: 16px; color: #555;">Stay tuned for more exciting discoveries and exclusive updates in your inbox!</p>
      <p style="font-size: 16px; color: #555;">Happy shopping! 🛒</p>
  </div>`;
      break;

    case Notification.CHANGE_OF_STOCK:
      subject = `${shortenedTitle} is now back in stock!`;
      body = `
        <div>
          <h4>Hey, ${product.title} is now restocked! Grab yours before they run out again!</h4>
          <p>See the product <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a>.</p>
        </div>
      `;
      break;

    case Notification.LOWEST_PRICE:
      subject = `Lowest Price Alert for ${shortenedTitle}`;
      body = `
        <div>
          <h4>Hey, ${product.title} has reached its lowest price ever!!</h4>
          <p>Grab the product <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a> now.</p>
        </div>
      `;
      break;

    case Notification.THRESHOLD_MET:
      subject = `Discount Alert for ${shortenedTitle}`;
      body = `
        <div>
          <h4>Hey, ${product.title} is now available at a discount more than ${THRESHOLD_PERCENTAGE}%!</h4>
          <p>Grab it right away from <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a>.</p>
        </div>
      `;
      break;
    case Notification.RESET_PASSWORD:
      subject = `Reset your account password!`;
      body = `
      <div style="font-family: 'Arial', sans-serif; text-align: center; background-color: #f5f5f5; padding: 20px; border-radius: 10px;">
      <h2 style="color: #333; margin-bottom: 10px;">🔐 Password Reset Request 🔐</h2>
      <p style="font-size: 16px; color: #555;">We received a request to reset the password associated with this email address.</p>
      <p style="font-size: 16px; color: #555;">If you did not make this request, you can safely ignore this email.</p>
      <p style="font-size: 16px; color: #555;">To reset your password, click the following link:</p>
      <a href="http://localhost:3000/admin/generatePassword/${data}" style="display: inline-block; margin: 10px 0; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;" target="_blank" rel="noopener noreferrer">Reset Password</a>
      <p style="font-size: 16px; color: #555;">This link will expire in 1 hour for security reasons.</p>
      <p style="font-size: 16px; color: #555;">If you're having trouble with the button above, you can also copy and paste the following link into your browser:</p>
      <p style="font-size: 16px; color: #555;">http://localhost:3000/admin/generatePassword/${data}</p>
      <p style="font-size: 16px; color: #555;">If you have any questions, feel free to contact us.</p>
    </div>
      `;
      break;

    default:
      throw new Error("Invalid notification type.");
  }

  return { subject, body };
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vishalgupta.exe@gmail.com",
    pass: "bron weqw ifwu znfp",
  },
});

export const sendEmail = async (emailContent, sendTo) => {
  const mailOptions = {
    from: "vishalgupta.exe@gmail.com <BestProducts@gmail.com>",
    to: sendTo,
    html: emailContent.body,
    subject: emailContent.subject,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return console.log(error);

    console.log("Email sent: ", info);
  });
};
