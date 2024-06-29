import express from "express";
import * as manufacturerController from "../controller/manufacturerController.js";

const router = express.Router({ mergeParams: true });

router.get("/:id", manufacturerController.getManufacturerById);
router.get("/", manufacturerController.getAllManufacturers);
router.post("/", manufacturerController.createManufacturer);
router.patch("/:id", manufacturerController.updateManufacturer);
router.delete("/:id", manufacturerController.deleteManufacturer);

export default router;