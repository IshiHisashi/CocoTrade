import express from "express";
import * as currentBalanceController from "../controller/currentBalanceController.js";

// this file is created by Sacha.

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(currentBalanceController.createCurrentBalance)
  .get(currentBalanceController.readCurrentBalance);
// get: expecting /currentbalance?from={yyyymm}&to={yyyymm} (e.g. /currentbalance?from=202405&to=202406)

export default router;
