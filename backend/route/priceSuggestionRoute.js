import express from "express";
import * as priceSuggestionController from "../controller/priceSuggestionController.js";

const router = express.Router({ mergeParams: true });
router
  .route("/:userid/pricesuggestion")
  .post(priceSuggestionController.createPriceSuggestion);

router.post(
  "/:userid/pricesuggestion/first",
  priceSuggestionController.createFirstPriceSuggestion
);

router.get(
  "/:userid/pricesuggestion/getone",
  priceSuggestionController.readOneRecentPriceSuggestion
);
router.get(
  "/:userid/pricesuggestion/gettwo",
  priceSuggestionController.readTwoRecentPriceSuggestion
);

export default router;
