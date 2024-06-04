import { salesFinmodel } from "../model/salesFinModel.js";

export const createSalesFin = async (req, res) => {
  try {
    const newSalesFin = await salesFinmodel.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        newSalesFin,
      },
    });
  } catch (err) {
    console.log(err);
    // in case anything conflicting with schema is detected
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// Read_1 (all docs)
export const readSalesFins = async (req, res) => {
  try {
    console.log("successful reading");
    // Read the docs
    const docs = await salesFinmodel.find({});
    res.status(201).json({
      status: "success",
      numDocs: docs.length,
      data: {
        docs,
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

// aggregate
export const salesFinStats = async (req, res) => {
  try {
    const stats = await salesFinmodel.aggregate([
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
      data: { stats },
    });
  } catch {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: "failed",
    });
  }
};
