import mongoose from "mongoose";

//   Shcema
const Schema = mongoose.Schema;
const testSchema = new Schema({
  name: String,
  age: Number,
});
export const Testmodel = mongoose.model("Testmodel", testSchema);
