import express from "express";
import * as priceSuggestionController from "../controller/priceSuggestionController.js";

const router = express.Router({ mergeParams: true });
router
  .route("/:userid/pricesuggestion")
  .post(priceSuggestionController.createPriceSuggestion);

export default router;
