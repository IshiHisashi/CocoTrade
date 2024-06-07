import express from "express";
import * as userController from "../controller/userController.js";

const router = express.Router({ mergeParams: true });

router.post("/", userController.createUser);

router
  .route("/:userid")
  .get(userController.readUser)
  .delete(userController.deleteUser);

export default router;
