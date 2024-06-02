import express from "express";
import * as inventoryController from "../controller/inventoryController.js";

const router = express.Router({ mergeParams: true });
router.get("/", inventoryController.getAllInventories);
router.get("/:id", inventoryController.getInventoryById);
router.post("/", inventoryController.createInventory);
router.patch("/:id", inventoryController.updateInventory);
router.delete("/:id", inventoryController.deleteInventory);

export default router;