import mongoose, { Schema, models } from "mongoose";

const configSchema = new Schema(
  {
    openai_api_key: {
      type: String,
      required: true,
    },
    nextauth_secret: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);


const Config = models.Config || mongoose.model("Config", configSchema);
export default Config;