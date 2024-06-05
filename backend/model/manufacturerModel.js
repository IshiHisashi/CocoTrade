import mongoose from "mongoose";

export {
    Manufacturer
};

const Schema = mongoose.Schema;
const manufacturerSchema = new Schema({
    full_name: String,
});
const Manufacturer = mongoose.model('Manufacturers', manufacturerSchema);