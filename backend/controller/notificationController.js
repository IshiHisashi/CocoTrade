import { Notification } from "../model/notificationModel.js";
import { UserModel as User } from "../model/userModel.js"

// Create Notification
export const createNotification = async (req, res) => {
    try {
        const newNotification = new Notification(req.body);
        const savedNotification = await newNotification.save();
        console.log("Notification Added!");
        res.status(201).json({
            status:"success",
            data: savedNotification
        });
    }
    catch(err) {
        res.status(500).json({
            status: "failed",
            error: err.message
        });
    }
};

export const getNotificationById = async (req, res) => {
    try {
        const Notification = await Notification.findById(req.params.id);
        if(!Notification) {
            return res.status(404).json({
                status: "failed", 
                error: 'Notification not found' 
            });
        }
        res.status(200).json({
            status: "success",
            data: Notification
        });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            error: err.message
        });
    }
};

export const updateNotification = async (req, res) => {
    try {
        const userId = req.params.id;
        const updateData = req.body;

        const updatedNotification = Notification.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        );
        if (!updatedNotification) {
            return res.status(404).json({
                status: "failed", 
                error: "Notification not found" 
            });
        }
        res.status(200).json({
            status: "success",
            data: updatedNotification
        });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            error: err.message
        });
    }
}

export const deleteNotification = async (req, res) => {
    try {
        const deletedNotification = await Notification.findByIdAndDelete(req.params.id);
        if (!deletedNotification) {
            return res.status(404).json({
                status: "failed", 
                error: "Notification not found" 
            });
        }
        res.status(200).json({
            status: "success",
            data: deletedNotification
        });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            error: err.message
        });
    }
}