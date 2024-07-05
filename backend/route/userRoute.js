import express from "express";
import * as userController from "../controller/userController.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(userController.readAllUsers)
  .post(userController.createUser);

router
  .route("/:userid")
  .get(userController.readUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.get("/:userid/inv", userController.getAllInventories);
router.get("/:userid/invd", userController.getInventoriesOnDuration);
router.get("/:userid/maxcap", userController.getMaximumCap);
router.get("/:userid/manu", userController.getAllManufacturers);
router.get("/:userid/ntf", userController.getAllNotifications);
router.get("/:userid/ntfd", userController.getNotificationsByDuration);
router.get("/:userid/fivesales", userController.getTopFiveSales);
router.get("/:userid/latestInv", userController.getLatestInventory);
router.get("/:userid/sales", userController.getSalesByUserId);

export default router;
