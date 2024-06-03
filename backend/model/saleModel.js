import mongoose from "mongoose";

export {
    Sale
};

const Schema = mongoose.Schema;
const saleSchema = new Schema({
    sale_log_id: String,
    user_id: Array,
    manufacturer_id: Array,
    amount_of_copra_sold: Number,
    status: { type: String, enum: ['pending', 'ongoing', 'completed', 'cancelled'], default: 'pending' },
    copra_ship_date: Date,
    cheque_receive_date: Date,
    total_sales_price: Number
});
const Sale = mongoose.model('Sale', saleSchema);