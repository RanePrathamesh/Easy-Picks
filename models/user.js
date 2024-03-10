
import mongoose, { Schema, models } from "mongoose";
import crypto from "node:crypto";
import bcrypt from "bcryptjs"

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'Admin',
      required: true
    },
    status: {
      type: String,
      required: true
    },
    createPasswordToken: {
      type: String,
    },
    createPasswordExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.pre("save",async function(next){
  if(!this.isModified("password")){
    next()
  }
  this.password=await bcrypt.hash(this.password,10)
})

userSchema.method('generatePasswordToken', async function () {
  const token = crypto.randomBytes(20).toString("hex");
  const generatepasswordtoken = crypto.createHash("sha256").update(token).digest("hex");
  this.createPasswordToken = generatepasswordtoken;
  this.createPasswordExpiry = Date.now() + 15 * 60 * 1000;
  return token;
});

const User = models.User || mongoose.model("User", userSchema);
export default User;