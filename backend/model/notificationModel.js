import mongoose from "mongoose";

export {
    Notification
};

const Schema = mongoose.Schema;
const notificationSchema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId },
        message: String
    },
    { time_stamp: true }
);

const Notification = mongoose.model('Notification', notificationSchema);