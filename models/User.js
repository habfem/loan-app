import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullAddress: {
      type: String,
    },
    country: {
      type: String,
    },
    img: {
      type: String,
    },
    city: {
      type: String,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    nationalId: {
      type: String,
      unique: true,
    },
    bankVerificationNumber: {
      type: String,
      unique: true,
    },
    role: { type: String, default: "customer", enum: ["customer", "admin"] },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

UserSchema.virtual("name").get(function () {
  return this.firstName + " " + this.lastName;
});
export default mongoose.model("User", UserSchema);
