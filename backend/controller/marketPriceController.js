import { marketPriceModel } from "../model/marketPriceModel.js";

// Define fnc to read the data
// Create
export const createMarketPrice = async (req, res) => {
  try {
    const newDoc = await marketPriceModel.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        newDoc,
      },
    });
  } catch (err) {
    // in case anything conflicting with schema is detected
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// Read_1 (all docs)
export const getallMarketPrice = async (req, res) => {
  try {
    // Read the docs
    const docs = await marketPriceModel.find({});
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
// Read_2 (one doc)
export const getMarketPrice = async (req, res) => {
  try {
    const doc = await marketPriceModel.findById(req.params.id);
    res.status(201).json({
      status: "success",
      data: {
        doc,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// Read the most latest one
export const getLatestMarketPrice = async (req, res) => {
  try {
    const doc = await marketPriceModel.findOne().sort({ createdAt: -1 });
    res.status(201).json({
      status: "success",
      data: {
        doc,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const getLatestTwoMarketPrice = async (req, res) => {
  try {
    const docs = await marketPriceModel.find().limit(2).sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      data: {
        docs,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// Update and Delete needs parameter (ID)
// Update
export const updateMarketPrice = async (req, res) => {
  try {
    const result = await marketPriceModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!result) {
      return res.status(404).json({ message: "not found" });
    }
    return res.status(201).json({
      status: "success in updating",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
// Delete
export const deleteMarketPrice = async (req, res) => {
  try {
    const result = await marketPriceModel.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "not found" });
    }
    return res.status(201).json({
      status: "success in deleting",
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
