import mongoose from "mongoose";

export {
    Manufacturer
};

const {Schema} = mongoose;
const manufacturerSchema = new Schema({
    full_name: String,
});
const Manufacturer = mongoose.model('Manufacturer', manufacturerSchema);