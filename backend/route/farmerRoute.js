import express from "express";
import * as farmerController from "../controller/farmerController.js";

const router = express.Router({ mergeParams: true });

router.get("/:id", farmerController.getFarmerById);
router.get('/', farmerController.getAllFarmers);
router.post("/", farmerController.createFarmer);
router.patch("/:id", farmerController.updateFarmer);
router.delete("/:id", farmerController.deleteFarmer);

export default router;