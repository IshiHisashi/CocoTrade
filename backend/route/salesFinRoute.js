import express from "express";
import * as salesFinController from "../controller/salesFinController.js";
// Define route to execute it
const router = express.Router({ mergeParams: true });

router.get("/monthly-aggregate", salesFinController.aggregateMonthlySales);
export default router;
