import express from "express";
import * as userController from "../controller/userController.js";

const router = express.Router({ mergeParams: true });

router.post("/", userController.createUser);

router
  .route("/:userid")
  .get(userController.readUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.get("/:userid/inv", userController.getAllInventories);
router.get("/:userid/invd", userController.getInventoriesOnDuration);
router.get("/:userid/manu", userController.getAllManufacturers);
router.get("/:userid/ntf", userController.getAllNotifications);
router.get("/:userid/ntfd", userController.getNotificationsByDuration);

export default router;
