import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    phone: { type: String },
    address: { type: String },
    birthdate: { type: Date },
    additionalInfo: { type: Map, of: String, default: {} }, // جديد (للحقول الإضافية اللي المستخدم يضيفها بنفسه)
    role: { type: String, default: "user", enum: ["user", "admin", "owner"] },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function (pass) {
  return bcrypt.compare(pass, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
