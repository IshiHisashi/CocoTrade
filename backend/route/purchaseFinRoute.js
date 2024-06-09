import express from "express";
import * as purchaseFinController from "../controller/purchaseFinController.js";
// Define route to execute it
const router = express.Router({ mergeParams: true });
router.get(
  "/monthly-aggregate",
  purchaseFinController.aggregateMonthlyPurchases
);

export default router;
