import express from "express";
import * as salesLogController from "../controller/salesLogController.js";

// this file is created by Sacha.

const router = express.Router({ mergeParams: true });

router.post("/", salesLogController.createSalesLog);

export default router;
