import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { PORT, mongoURL } from "./config.js";
import inventoryRoute from "./route/inventoryRoute.js";
import manufacturerRoute from "./route/manufacturerRoute.js";
import userRoute from "./route/userRoute.js";
import priceSuggestionRoute from "./route/priceSuggestionRoute.js";
import currentBalanceRoute from "./route/currentBalanceRoute.js";
import marketPriceRoute from "./route/marketPriceRoute.js";
import saleRoute from "./route/saleRoute.js";
import purchaseRoute from "./route/purchaseRoute.js";
import notificationRoute from "./route/notificationRoute.js";
import tmpFinRoute from "./route/tmpFinRoute.js";
import tmpFinRoute from "./route/farmerRoute.js";

const app = express();

app.use(
  cors({
    credentials: true,
    // Let the origin have wildcard for the time being.
    // origin: "*",
    origin: [
      //   // Local
      "http://localhost:5173",
      "http://localhost:5174",
      // Diployment
      "https://coco-trade.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options(
  "*",
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "https://coco-trade.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// middleware to parse request body
app.use(express.json());
app.get("/", (req, res) => {
  return res.status(234).send("Successful connection!");
});
app.listen(PORT, () => {
  console.log(`APP is listning to port :${PORT}`);
});

app.use("/currentbalance", currentBalanceRoute);
app.use("/user", userRoute);
app.use("/inventory", inventoryRoute);
app.use("/manufacturer", manufacturerRoute);
app.use("/notification", notificationRoute);
app.use("/marketprice", marketPriceRoute);
app.use("/user", priceSuggestionRoute);
app.use("/sale", saleRoute);
app.use("/purchase", purchaseRoute);
app.use("/farmer", farmerRoute);

// This will be replaced by the endpoint 'user'
app.use("/tmpFinRoute", tmpFinRoute);

// connection to DB
mongoose
  .connect(mongoURL, {})
  .then(() => {
    console.log("connected with DB successfully!");
  })
  .catch((error) => {
    console.log(error);
  });
