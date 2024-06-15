import mongoose from "mongoose";

export {
    Farmer
};

const Schema = mongoose.Schema;
const farmerSchema = new Schema({
    full_name: String,
});
const Farmer = mongoose.model('Farmer', farmerSchema);