import express from "express";
import saleRoute from "./saleRoute.js";
import purchaseRoute from "./purchaseRoute.js";
import currentBalanceRoute from "./currentBalanceRoute.js";
import inventoryRoute from "./inventoryRoute.js";

const router = express.Router({ mergeParams: true });

router.use("/:userid/sale", saleRoute);
router.use("/:userid/purchase", purchaseRoute);
router.use("/:userid/currentbalance", currentBalanceRoute);
router.use("/:userid/inventory", inventoryRoute);

export default router;
