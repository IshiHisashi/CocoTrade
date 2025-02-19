import express from "express";
import * as currentBalanceController from "../controller/currentBalanceController.js";

const router = express.Router({ mergeParams: true });
router.get("/", currentBalanceController.getAllCurrentBalance);
router.get("/byuser", currentBalanceController.getAllCurrentBalanceByUser);
router.get("/latest", currentBalanceController.getLatestBalance);
router.get("/:id", currentBalanceController.getCurrentBalance);
router.post("/", currentBalanceController.createCurrentBalance);
router.patch("/", currentBalanceController.updateCurrentBalance);
router.patch(
  "/updateForSales",
  currentBalanceController.updateCurrentBalanceAndCascade
);
router.patch("/:id", currentBalanceController.updateCurrentBalanceById);
router.delete("/:id", currentBalanceController.deleteCurrentBalance);

router.post("/first", currentBalanceController.createFirstCurrentBalance);

export default router;
