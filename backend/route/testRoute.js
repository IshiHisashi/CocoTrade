import express from "express";
import * as testController from "../controller/testController.js";
// Define route to execute it
const router = express.Router({ mergeParams: true });
router.get("/", testController.readTests);
router.get("/:id", testController.readTest);
router.post("/", testController.createTest);
router.patch("/:id", testController.updateTest);
router.delete("/:id", testController.deleteTest);

export default router;
