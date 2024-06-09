import express from "express";
import saleRoute from "./saleRoute.js";
import purchaseRoute from "./purchaseRoute.js";

const router = express.Router({ mergeParams: true });

router.use("/:userid/sale", saleRoute);
router.use("/:userid/purchase", purchaseRoute);

export default router;
