import express from "express";
import { PORT, mongoURL } from "./config.js";
import mongoose from "mongoose";
import inventoryRoute from "./route/inventoryRoute.js";
import manufacturerRoute from "./route/manufacturerRoute.js";
import testRoute from "./route/testRoute.js";
import userRoute from "./route/userRoute.js";

const app = express();

// Middleware to parse request body
app.use(express.json());
app.get("/", (req, res) => {
  return res.status(234).send("Successful connection!");
});
app.listen(PORT, () => {
  console.log(`APP is listning to port :${PORT}`);
});


app.use("/inventory", inventoryRoute);
app.use("/manufacturer", manufacturerRoute);

app.use("/user", userRoute);

// connection to DB
mongoose
  .connect(mongoURL, {})
  .then(() => {
    console.log("connected with DB successfully!");
  })
  .catch((error) => {
    console.log(error);
  });
