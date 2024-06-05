import { MarketPriceModel } from "../model/marketPriceModel.js";

// this file is created by Sacha.

// Create
export const createMarketPrice = async (req, res) => {
  try {
    const newMarketPrice = await MarketPriceModel.create(req.body);
    res.status(201).send(newMarketPrice);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

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
    res.status(201).send(docs);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};
