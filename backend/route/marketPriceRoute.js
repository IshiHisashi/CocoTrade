import express from "express";
import * as marketPriceController from "../controller/marketPriceController.js";
<<<<<<< HEAD

// this file is created by Sacha.

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(marketPriceController.createMarketPrice)
  .get(marketPriceController.readMarketPrice);
// get: expecting /marketprice?comparison=yyyymmdd&current=yyyymmdd
=======
// Define route to execute it
const router = express.Router({ mergeParams: true });
router.get("/", marketPriceController.getallMarketPrice);
router.get("/latest", marketPriceController.getLatestMarketPrice);
router.post("/", marketPriceController.createMarketPrice);
router.get("/:id", marketPriceController.getMarketPrice);
router.patch("/:id", marketPriceController.updateMarketPrice);
router.delete("/:id", marketPriceController.deleteMarketPrice);
>>>>>>> c39d9b7995964f5aefb078b72d342cf3bcaea393

export default router;
