import express from "express";
import { PORT, mongoURL } from "./config.js";
import mongoose from "mongoose";
import inventoryRoute from "./route/inventoryRoute.js";
import manufacturerRoute from "./route/manufacturerRoute.js";
import userRoute from "./route/userRoute.js";
import notificationRoute from "./route/notificationRoute.js"
import currentBalanceRoute from "./route/currentBalanceRoute.js";
import marketPriceRoute from "./route/marketPriceRoute.js";
import saleRoute from "./route/saleRoute.js";

const app = express();

// middleware to parse request body
app.use(express.json());
app.get("/", (req, res) => {
  return res.status(234).send("Successful connection!");
});
app.listen(PORT, () => {
  console.log(`APP is listning to port :${PORT}`);
});

// app.use("/test", testRoute);
app.use("/currentbalance", currentBalanceRoute);
app.use("/user", userRoute);
app.use("/inventory", inventoryRoute);
app.use("/manufacturer", manufacturerRoute);
app.use("/notification", notificationRoute);
app.use("/marketprice", marketPriceRoute);
app.use("/sale", saleRoute);

// connection to DB
mongoose
  .connect(mongoURL, {})
  .then(() => {
    console.log("connected with DB successfully!");
  })
  .catch((error) => {
    console.log(error);
  });
