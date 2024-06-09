import { CurrentBalanceModel } from "../model/CurrentBalanceModel.js";
// Define fnc to read the data
// Create
export const createCurrentBalance = async (req, res) => {
  try {
    const newCurrentBalance = await CurrentBalanceModel.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        newCurrentBalance,
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
export const getAllCurrentBalance = async (req, res) => {
  try {
    // Read the docs
    const docs = await CurrentBalanceModel.find({});
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
export const getCurrentBalance = async (req, res) => {
  try {
    const doc = await CurrentBalanceModel.findById(req.params.id);
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

// Update and Delete needs parameter (ID)
// Update
export const updateCurrentBalance = async (req, res) => {
  try {
    const result = await CurrentBalanceModel.findByIdAndUpdate(
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
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
// Delete
export const deleteCurrentBalance = async (req, res) => {
  try {
    const result = await CurrentBalanceModel.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "not found" });
    }
    return res.status(201).json({
      status: "success in deleting",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
