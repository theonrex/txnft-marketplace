import React from "react";
import mongoose from "mongoose";

// const connectDB = async () => {
//   if (mongoose.connections[0].readyState) {
//     console.log("Already connected.");
//     return;
//   }

//  await mongoose.connect(,
//    {},
//    (err) => {
//      if (err) throw err;
//      console.log("Connected to mongodb.");
//    }
//  );
// };

const connectDB = async () => {
  try {
    // mongoose.set("useNewUrlParser", true);
    if (mongoose.connections[0].readyState) {
      console.log("Already connected.");
      return;
    }
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("connected to database");
  } catch (error) {
    console.log(error);
    // process.exit(1);
  }
};

export default connectDB;
