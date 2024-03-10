import mongoose, { Schema, models } from "mongoose";

const newsletterSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    interest: {
      type: String,
      required: true,
    },
    pathname: {
      type: String,
      required: true,
    },
    isSubscribed: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);


const Newsletter = models.Newsletter || mongoose.model("Newsletter", newsletterSchema);
export default Newsletter;