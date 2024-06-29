import { Notification } from "../model/notificationModel.js";
import { UserModel as User } from "../model/userModel.js";

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
      const notification = await Notification.findById(req.params.id);
      if (!notification) {
        return res.status(404).json({
          status: "failed",
          error: 'Notification not found',
        });
      }
      res.status(200).json({
        status: "success",
        data: notification,
      });
    } catch (err) {
      res.status(500).json({
        status: "failed",
        error: err.message,
      });
    }
  };
  
  export const getNotificationsByUserId = async (req, res) => {
    try {
      const notifications = await Notification.find({ user_id: req.params.userId });
      res.status(200).json({
        status: "success",
        data: notifications,
      });
    } catch (err) {
      res.status(500).json({
        status: "failed",
        error: err.message,
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

export const markNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user_id: req.params.userId, read: false },
      { $set: { read: true } }
    );
    res.status(200).json({
      status: 'success',
      message: 'Notifications marked as read'
    });
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      error: err.message
    });
  }
};