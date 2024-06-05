import express from "express";
import * as marketPriceController from "../controller/marketPriceController.js";

// this file is created by Sacha.

const router = express.Router({ mergeParams: true });

router.post("/", marketPriceController.createMarketPrice);

router.get(
  "/:lastweekdate/:thisweekdate",
  marketPriceController.readMarketPrice
);

export default router;
