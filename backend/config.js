export const PORT = 5555;
import dotenv from "dotenv";
dotenv.config({ path: "../backend/config.env" });

export const mongoURL = `mongodb+srv://product-user:${process.env.PASSWORD}@cocotrade.49q1bzb.mongodb.net/cocotrade?retryWrites=true&w=majority&appName=CocoTrade`;
