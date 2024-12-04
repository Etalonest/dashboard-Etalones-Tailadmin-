// import  mongoose, { Schema, model } from  "mongoose";

// export interface UserDocument {
//     _id: string;
//     email: string;
//     password: string;
//     name: string;
//     phone: string;
//     picture: string;
//     createdAt: Date;
//     updatedAt: Date;
//   }

//   const UserSchema = new Schema<UserDocument>({
//     email: {
//       type: String,
//       unique: true,
//       required: [true, "Email is required"],
//       match: [
//         /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
//         "Email is invalid",
//       ],
//     },
//     password: {
//       type: String,
//       required: true
//     },
//     name: {
//       type: String,
//       required: [true, "Name is required"]
//     }
//   },
//   {
//     timestamps: true,
//   }
// );

// const  User  =  mongoose.models?.User  ||  model<UserDocument>('User', UserSchema);
// export  default  User;

import mongoose from 'mongoose'

interface User {
  googleId: string;
  email: string;
  name: string;
}

const userSchema = new mongoose.Schema<User>({
  googleId: { type: String, unique: true, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
})

// Экспортируем модель, а не схему
const UserModel = mongoose.models.User || mongoose.model<User>('User', userSchema)

export default UserModel  // Экспортируем модель как default
