import { Purchase } from "../model/purchaseModel.js";
import { UserModel } from "../model/userModel.js";

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
          monthlySales: { $sum: "$total_purchase_price" },
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
