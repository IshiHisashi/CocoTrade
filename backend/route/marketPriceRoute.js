import express from "express";
import * as marketPriceController from "../controller/marketPriceController.js";

const router = express.Router({ mergeParams: true });

router.post("/", marketPriceController.createMarketPrice);

export default router;
