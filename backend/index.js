import express from "express";
import mongoose from "mongoose";
import { PORT, mongoURL } from "./config.js";
import testRoute from "./route/testRoute.js";
import userRoute from "./route/userRoute.js";
import priceSuggestionRoute from "./route/priceSuggestionRoute.js";
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

app.use("/test", testRoute);
app.use("/currentbalance", currentBalanceRoute);
app.use("/marketprice", marketPriceRoute);
app.use("/user", userRoute);
app.use("/user", priceSuggestionRoute);
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
