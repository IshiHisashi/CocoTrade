import express from "express";
import saleRoute from "./saleRoute.js";
import purchaseRoute from "./purchaseRoute.js";
import currentBalanceRoute from "./currentBalanceRoute.js";

const router = express.Router({ mergeParams: true });

router.use("/:userid/sale", saleRoute);
router.use("/:userid/purchase", purchaseRoute);
router.use("/:userid/currentbalance", currentBalanceRoute);

export default router;
