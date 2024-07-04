import express from "express";
import * as inventoryController from "../controller/inventoryController.js";

const router = express.Router({ mergeParams: true });

router.get("/:id", inventoryController.getInventoryById);
router.post("/", inventoryController.createInventory);
router.patch("/updatepurchase", inventoryController.updateInventoryPurchase);
router.patch("/:id", inventoryController.updateInventory);
// router.get("/duration", inventoryController.getAllInventoriesByDuration);
router.delete("/:id", inventoryController.deleteInventorById);

router.post("/first", inventoryController.createFirstInventory);

export default router;
