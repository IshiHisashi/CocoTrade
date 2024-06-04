import express from "express";
import * as purchaseFinController from "../controller/purchaseFinController.js";
// Define route to execute it
const router = express.Router({ mergeParams: true });
router.get("/", purchaseFinController.readPurchaseFins);
router.get("/monthly-aggregate", purchaseFinController.purchaseFinStats);
// router.get("/:id", testController.readTest);
router.post("/", purchaseFinController.createPurchaseFin);
// router.patch("/:id", testController.updateTest);
// router.delete("/:id", testController.deleteTest);

export default router;
