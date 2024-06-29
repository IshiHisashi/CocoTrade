import express from "express";
import * as marketPriceController from "../controller/marketPriceController.js";
// Define route to execute it
const router = express.Router({ mergeParams: true });
router.get("/", marketPriceController.getallMarketPrice);
router.get("/latest", marketPriceController.getLatestMarketPrice);
router.get("/latest-2", marketPriceController.getLatestTwoMarketPrice);
router.post("/", marketPriceController.createMarketPrice);
router.get("/:id", marketPriceController.getMarketPrice);
router.patch("/:id", marketPriceController.updateMarketPrice);
router.delete("/:id", marketPriceController.deleteMarketPrice);

export default router;
