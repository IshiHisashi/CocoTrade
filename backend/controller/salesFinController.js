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
