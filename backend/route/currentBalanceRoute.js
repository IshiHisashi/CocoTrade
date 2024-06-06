import express from "express";
import * as currentBalanceController from "../controller/currentBalanceController.js";

// Define route to execute it
const router = express.Router({ mergeParams: true });
router.get("/", currentBalanceController.getAllCurrentBalance);
router.get("/:id", currentBalanceController.getCurrentBalance);
router.post("/", currentBalanceController.createCurrentBalance);
router.patch("/:id", currentBalanceController.updateCurrentBalance);
router.delete("/:id", currentBalanceController.deleteCurrentBalance);

export default router;
