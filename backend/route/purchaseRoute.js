import express from "express";
import * as purchaseController from "../controller/purchaseController.js";

const router = express.Router({ mergeParams: true });
router.get("/", purchaseController.getAllPurchase);
router.get("/monthly-aggregate", purchaseController.aggregateMonthlyPurchases);
router.get('/today-total', purchaseController.getTodaysTotalPurchasePriceForUser);
router.get("/:id", purchaseController.getPurchaseById);
router.post("/", purchaseController.createPurchase);
router.patch("/:id", purchaseController.updatePurchase);
router.delete("/:id", purchaseController.deletePurchase);


export default router;
