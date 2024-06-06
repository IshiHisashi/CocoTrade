import express from "express";
import * as userController from "../controller/userController.js";

const router = express.Router({ mergeParams: true });

router.route("/").post(userController.createUser).get(userController.readUser);

export default router;
