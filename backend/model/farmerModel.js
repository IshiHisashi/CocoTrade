import mongoose from "mongoose";

export {
    Farmer
};

const {Schema} = mongoose;
const farmerSchema = new Schema({
    user_id: String,
    full_name: String,
});
const Farmer = mongoose.model('Farmer', farmerSchema);