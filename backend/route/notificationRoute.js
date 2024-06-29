import express from "express";
import * as notificationController from "../controller/notificationController.js";

const router = express.Router({ mergeParams: true });

router.get('/user/:userId', notificationController.getNotificationsByUserId);
router.patch('/user/:userId/mark-read', notificationController.markNotificationsAsRead); 
router.get("/:id", notificationController.getNotificationById);
router.post("/", notificationController.createNotification);
router.patch("/:id", notificationController.updateNotification);
router.delete("/:id", notificationController.deleteNotification);

export default router;