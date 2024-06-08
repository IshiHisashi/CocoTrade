import express from "express";
import * as inventoryController from "../controller/inventoryController.js";
import * as manufacturerController from "../controller/manufacturerController.js";

const router = express.Router({ mergeParams: true });
router.get("/:userId", inventoryController.getAllInventories);
router.get("/manu", manufacturerController.getAllManufacturers);
router.get("/:id", inventoryController.getInventoryById);
router.patch("/:id", inventoryController.updateInventory);
// router.get("/duration", inventoryController.getAllInventoriesByDuration);
router.delete("/:id", inventoryController.deleteInventorById);

export default router;