import mongoose from "mongoose";

export { Notification };

const { Schema } = mongoose;
const notificationSchema = new Schema(
  {
    user_id: {
      type: String,
      // ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
  },
  { time_stamp: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
