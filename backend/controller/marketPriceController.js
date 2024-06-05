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
    const lastWeekDate = req.params.lastweekdate;
    const thisWeekDate = req.params.thisweekdate;

    const startYearLast = Number(lastWeekDate.substring(0, 4));
    const startMonthLast = Number(lastWeekDate.substring(4, 6));
    const startDayLast = Number(lastWeekDate.substring(6));
    const startDateInclusiveLast = new Date(
      startYearLast,
      startMonthLast - 1,
      startDayLast
    );

    const nextDateLast = new Date(startDateInclusiveLast);
    nextDateLast.setDate(startDateInclusiveLast.getDate() + 1);

    const startYearThis = Number(thisWeekDate.substring(0, 4));
    const startMonthThis = Number(thisWeekDate.substring(4, 6));
    const startDayThis = Number(thisWeekDate.substring(6));
    const startDateInclusiveThis = new Date(
      startYearThis,
      startMonthThis - 1,
      startDayThis
    );

    const nextDateThis = new Date(startDateInclusiveThis);
    nextDateThis.setDate(startDateInclusiveThis.getDate() + 1);

    const docs = await MarketPriceModel.find({
      $or: [
        {
          createdAt: {
            $gte: startDateInclusiveLast,
            $lt: nextDateLast,
          },
        },
        {
          createdAt: {
            $gte: startDateInclusiveThis,
            $lt: nextDateThis,
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
