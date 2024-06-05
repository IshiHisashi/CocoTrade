import express from "express";
import * as marketPriceController from "../controller/marketPriceController.js";

// this file is created by Sacha.

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(marketPriceController.createMarketPrice)
  .get(marketPriceController.readMarketPrice);
// get: expecting /marketprice?comparison=yyyymmdd&current=yyyymmdd

export default router;
