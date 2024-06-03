import express from "express";
import * as currentBalanceController from "../controller/currentBalanceController.js";

// this file is created by Sacha.

const router = express.Router({ mergeParams: true });

router.post("/", currentBalanceController.createCurrentBalance);

router.get(
  "/:startyearmonth/:endyearmonth",
  currentBalanceController.readCurrentBalance
);
// expecting /currentbalance/yyyymm/yyyymm (e.g. /currentbalance/202405/202406)

export default router;
