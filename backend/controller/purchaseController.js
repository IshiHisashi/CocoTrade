import mongoose from "mongoose";
import { Purchase } from "../model/purchaseModel.js";
import { UserModel } from "../model/userModel.js";

export const createPurchase = async (req, res) => {
  try {
    const newPurchase = new Purchase(req.body);
    const savedPurchase = await newPurchase.save();
    console.log("Purchase Added!");
    res.status(201).json(savedPurchase);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

export const getAllPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.find().populate('farmer_id');;
    console.log("Purchase retrieved");
    res.status(200).json(purchase);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

export const getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) {
      return res.status(404).json({
        error: "Purchase not found",
      });
    }
    res.status(200).json(purchase);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

export const updatePurchase = async (req, res) => {
  try {
    const updatedPurchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!updatedPurchase) {
      return res.status(404).json({
        error: "Purchase not found",
      });
    } 
      return res.status(201).json({
        status: "success in updating",
      });    
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const deletePurchase = async (req, res) => {
  try {
    const deletedPurchase = await Purchase.findByIdAndDelete(req.params.id);
    if (!deletedPurchase) {
      return res.status(404).json({
        error: "Purchase not found",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Purchase successfully deleted",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// This is to retrieve monthly aggregated purchase number
export const aggregateMonthlyPurchases = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userid);
    const purchaseAggregation = await Purchase.aggregate([
      { $match: { _id: { $in: user.purchases_array } } },
      {
        $group: {
          _id: {
            year: { $year: "$purchase_date" },
            month: { $month: "$purchase_date" },
          },
          monthlyPurchase: { $sum: "$total_purchase_price" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);
    res.status(200).json({
      status: "success",
      data: {
        purchaseAggregation,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: "failed",
    });
  }
};
export const getTodaysTotalPurchasePriceForUser = async (req, res) => {
  const user = await UserModel.findById(req.params.userid);
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0); // Set to start of today in UTC
  
  const endOfDay = new Date();
  endOfDay.setUTCHours(23, 59, 59, 999); // Set to end of today in UTC

  try {
    const result = await Purchase.aggregate([
      {
        $match: {
          _id: { $in: user.purchases_array },
          purchase_date: {
            $gte: startOfDay,
            $lte: endOfDay
          }
        }
      },
      {
        $group: {
          _id: null,
          totalSum: { $sum: "$total_purchase_price" }
        }
      }
    ]);

    if (result.length === 0 || !result[0].totalSum) {
      return res.status(404).json({
        status: "fail",
        message: "No purchases found for today for this user",
      });
    }
    res.status(200).json({
      status: "success",
      totalSum: result[0].totalSum
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};