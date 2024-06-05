import express from "express";
import * as currentBalanceController from "../controller/currentBalanceController.js";

// this file is created by Sacha.

const router = express.Router({ mergeParams: true });

router
  .route("/:userid/currentbalance")
  .post(currentBalanceController.createCurrentBalance)
  .get(currentBalanceController.readCurrentBalance);
// get: expecting /user/{userid}/currentbalance?from={yyyymm}&to={yyyymm} (e.g. user/66605a1d4469d91be0d4401f/currentbalance?from=202405&to=202406)

export default router;
