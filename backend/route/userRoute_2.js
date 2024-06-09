import express from "express";
import * as userController from "../controller/userController.js";
import salesFinRoute from "./salesFinRoute.js";
import purchaseFinRoute from "./purchaseFinRoute.js";

const router = express.Router({ mergeParams: true });

router.post("/", userController.createUser);

router
  .route("/:userid")
  .get(userController.readUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.use("/:userid/salesfin", salesFinRoute);
router.use("/:userid/purchasefin", purchaseFinRoute);

export default router;
