import mongoose from "mongoose";

export {
    Manufacturer
};

const {Schema} = mongoose;
const manufacturerSchema = new Schema({
    user_id: String,
    full_name: String,
});
const Manufacturer = mongoose.model('Manufacturer', manufacturerSchema);