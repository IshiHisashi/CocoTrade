import { Sale } from "../model/saleModel.js";
import { UserModel } from "../model/userModel.js";

export const aggregateMonthlySales = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userid);
    const salesAggregation = await Sale.aggregate([
      { $match: { _id: { $in: user.sales_array } } },
      {
        $group: {
          _id: {
            year: { $year: "$copra_ship_date" },
            month: { $month: "$copra_ship_date" },
          },
          monthlySales: { $sum: "$total_sales_price" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);
    res.status(200).json({
      status: "success",
      data: {
        salesAggregation,
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
