import express from "express";
import * as notificationController from "../controller/notificationController.js";

const router = express.Router({ mergeParams: true });

router.get("/:id", notificationController.getNotificationById);
router.post("/", notificationController.createNotification);
router.patch("/:id", notificationController.updateNotification);
router.delete("/:id", notificationController.deleteNotification);

export default router;