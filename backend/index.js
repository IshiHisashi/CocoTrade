import express from "express";
import { PORT, mongoURL } from "./config.js";
import mongoose from "mongoose";
import testRoute from "./route/testRoute.js";
import saleRoute from "./route/saleRoute.js";

const app = express();

// Middleware to parse request body
app.use(express.json());
app.get("/", (req, res) => {
  return res.status(234).send("Successful connection!");
});
app.listen(PORT, () => {
  console.log(`APP is listning to port :${PORT}`);
});

app.use("/test", testRoute);
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
