import mongoose, { Schema } from "mongoose";
import { IUser, UserRole } from "@modules/users/user.types";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.CLIENT },
    isActive: { type: Boolean, required: true, default: true },
  },
  { timestamps: true },
);

userSchema.set("toJSON", {
  transform: (_document, returnedDocument) => {
    Reflect.deleteProperty(returnedDocument, "password");
  },
});

const UserModel = mongoose.model<IUser>("User", userSchema);

export { UserModel };
