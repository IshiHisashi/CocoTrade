import { CurrentBalanceModel } from "../model/currentBalanceModel.js";

// this file is created by Sacha.

// Create
export const createCurrentBalance = async (req, res) => {
  try {
    const newCurrentBalance = await CurrentBalanceModel.create(req.body);
    res.status(201).send(newCurrentBalance);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Read current balance based on month range
export const readCurrentBalance = async (req, res) => {
  try {
    const startYearMonth = req.params.startyearmonth;
    const endYearMonth = req.params.endyearmonth;

    const startYear = Number(startYearMonth.substring(0, 4));
    const startMonth = Number(startYearMonth.substring(4));
    const startDateInclusive = new Date(startYear, startMonth - 1);

    const endYear = Number(endYearMonth.substring(0, 4));
    const endMonth = Number(endYearMonth.substring(4));
    const endDateExclusive = new Date(
      endMonth === 12 ? endYear + 1 : endYear,
      endMonth === 12 ? 1 : endMonth
    );

    console.log(startDateInclusive, endDateExclusive);

    const docs = await CurrentBalanceModel.find({
      date: {
        $gte: startDateInclusive,
        $lt: endDateExclusive,
      },
    });
    res.status(201).send(docs);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};
