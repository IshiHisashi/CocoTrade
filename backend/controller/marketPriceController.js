<<<<<<< HEAD
import { MarketPriceModel } from "../model/marketPriceModel.js";

// this file is created by Sacha.

// Create
export const createMarketPrice = async (req, res) => {
  try {
    const newMarketPrice = await MarketPriceModel.create(req.body);
    res.status(201).json({
      status: "success",
      data: newMarketPrice,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "fail",
      message: error.message,
=======
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
>>>>>>> c39d9b7995964f5aefb078b72d342cf3bcaea393
    });
  }
};

<<<<<<< HEAD
// Read
export const readMarketPrice = async (req, res) => {
  try {
    const { comparison, current } = req.query;

    const comparisonYear = Number(comparison.substring(0, 4));
    const comparisonMonth = Number(comparison.substring(4, 6));
    const comparisonDay = Number(comparison.substring(6));
    const comparisonDate = new Date(
      comparisonYear,
      comparisonMonth - 1,
      comparisonDay
    );

    const comparisonNextDate = new Date(comparisonDate);
    comparisonNextDate.setDate(comparisonDate.getDate() + 1);

    const currentYear = Number(current.substring(0, 4));
    const currentMonth = Number(current.substring(4, 6));
    const currentDay = Number(current.substring(6));
    const currentDate = new Date(currentYear, currentMonth - 1, currentDay);

    const currentNextDate = new Date(currentDate);
    currentNextDate.setDate(currentDate.getDate() + 1);

    const docs = await MarketPriceModel.find({
      $or: [
        {
          createdAt: {
            $gte: comparisonDate,
            $lt: comparisonNextDate,
          },
        },
        {
          createdAt: {
            $gte: currentDate,
            $lt: currentNextDate,
          },
        },
      ],
    });
    res.status(201).json({
      status: "success",
      data: docs,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "fail",
      message: error.message,
=======
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
    } else {
      return res.status(201).json({
        status: "success in updating",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
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
    } else {
      return res.status(201).json({
        status: "success in deleting",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
>>>>>>> c39d9b7995964f5aefb078b72d342cf3bcaea393
    });
  }
};
