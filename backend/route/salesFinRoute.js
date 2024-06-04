import express from "express";
import * as salesFinController from "../controller/salesFinController.js";
// Define route to execute it
const router = express.Router({ mergeParams: true });
router.get("/", salesFinController.readSalesFins);
// router.get("/:id", testController.readTest);
router.post("/", salesFinController.createSalesFin);
// router.patch("/:id", testController.updateTest);
// router.delete("/:id", testController.deleteTest);

export default router;
