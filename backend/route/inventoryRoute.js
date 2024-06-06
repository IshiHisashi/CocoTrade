import express from "express";
import * as inventoryController from "../controller/inventoryController.js";
import * as manufacturerController from "../controller/manufacturerController.js";

const router = express.Router({ mergeParams: true });
router.get("/", inventoryController.getAllInventories);
router.post("/shipment", inventoryController.createShipment);
router.get("/shipment", manufacturerController.getAllManufacturers);
// router.get("/:id", inventoryController.getInventoryById);
// router.patch("/:id", inventoryController.updateInventory);
router.get("/duration", inventoryController.getAllInventoriesByDuration);
router.delete("/:id", inventoryController.deleteInventory);

export default router;