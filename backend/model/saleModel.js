import mongoose from "mongoose";

export {
    Sale
};

const Schema = mongoose.Schema;
const saleSchema = new Schema({
    user_id: Array,
    manufacturer_id: Array,
    amount_of_copra_sold: mongoose.Types.Decimal128,
    status: { type: String, enum: ['pending', 'ongoing', 'completed', 'cancelled'], default: 'pending' },
    copra_ship_date: Date,
    cheque_receive_date: Date,
    total_sales_price: mongoose.Types.Decimal128
});
const Sale = mongoose.model('Sale', saleSchema);
