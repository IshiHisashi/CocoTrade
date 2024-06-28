import { CurrentBalanceModel } from "../model/currentBalanceModel.js";
import { UserModel } from "../model/userModel.js";
// Define fnc to read the data
// Create
export const createCurrentBalance = async (req, res) => {
  try {
    // Get the latest balance
    const user = await UserModel.findById(req.params.userid);
    const doc = await CurrentBalanceModel.aggregate([
      {
        $match: { _id: { $in: user.balance_array } },
      },
      {
        $sort: { date: -1 },
      },
      {
        $limit: 1,
      },
    ]);
    const currentCash = +doc[0].current_balance;
    const newDoc = {
      user_id: req.body.user_id,
      date: req.body.date,
      current_balance:
        req.body.type === "purchase"
          ? currentCash - req.body.changeValue
          : currentCash + req.body.changeValue,
    };
    const newCurrentBalance = await CurrentBalanceModel.create(newDoc);
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

export const getAllCurrentBalanceByUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userid);
    // Read the docs
    // const docs = await CurrentBalanceModel.find({});
    const docs = await CurrentBalanceModel.aggregate([
      { $match: { _id: { $in: user.balance_array } } },
    ]);
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

// Read the most latest one
export const getLatestBalance = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userid);
    // Read the docs
    // const docs = await CurrentBalanceModel.find({});
    const doc = await CurrentBalanceModel.aggregate([
      {
        $match: { _id: { $in: user.balance_array } },
      },
      {
        $sort: { date: -1 },
      },
      {
        $limit: 1,
      },
    ]);
    res.status(201).json({
      status: "success",
      data: {
        doc,
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
    return res.status(400).json({
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
    return res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
