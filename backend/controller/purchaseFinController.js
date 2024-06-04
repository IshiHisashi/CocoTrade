import { purchaseFinmodel } from "../model/purchaseFinModel.js";

export const createPurchaseFin = async (req, res) => {
  try {
    const newPurchaseFin = await purchaseFinmodel.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        newPurchaseFin,
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
export const readPurchaseFins = async (req, res) => {
  try {
    console.log("successful reading");
    // Read the docs
    const docs = await purchaseFinmodel.find({});
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
export const purchaseFinStats = async (req, res) => {
  try {
    const stats = await purchaseFinmodel.aggregate([
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
