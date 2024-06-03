import express from "express";
import * as purchaseLogController from "../controller/purchaseLogController.js";

// this file is created by Sacha.

const router = express.Router({ mergeParams: true });

router.post("/", purchaseLogController.createPurchaseLog);

router.get("/:month", purchaseLogController.readPurchaseLogsMonthly);
// expecting /purchaselog/thismonth or /purchaselog/lastmonth.

export default router;
