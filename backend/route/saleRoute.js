import express from "express";
import * as saleController from "../controller/saleController.js";

const router = express.Router({ mergeParams: true });
router.get("/", saleController.getAllSales);
router.get("/weekly-sales-sum", saleController.getWeeklyCompletedSalesSumByUserSalesArray);
router.get("/monthly-aggregate", saleController.aggregateMonthlySales);
router.get("/latest-pending/:userid", saleController.getNearestPendingSaleDate); 
router.get("/:id", saleController.getSaleById);
router.post("/", saleController.createSale);
router.patch("/:id", saleController.updateSale);
router.delete("/:id", saleController.deleteSale);

export default router;
