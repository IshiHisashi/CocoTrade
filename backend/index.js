import express from "express";
import { PORT, mongoURL } from "./config.js";
import mongoose from "mongoose";
import userRoute from "./route/userRoute.js";
import inventoryRoute from "./route/inventoryRoute.js";
import manufacturerRoute from "./route/manufacturerRoute.js";

const app = express();

// Middleware to parse request body
app.use(express.json());
app.get("/", (req, res) => {
  return res.status(234).send("Successful connection!");
});
app.listen(PORT, () => {
  console.log(`APP is listning to port :${PORT}`);
});

app.use("/user", userRoute);
app.use("/inventory", inventoryRoute);
app.use("/manufacturer", manufacturerRoute);

// connection to DB
mongoose
  .connect(mongoURL, {})
  .then(() => {
    console.log("connected with DB successfully!");
  })
  .catch((error) => {
    console.log(error);
  });
