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
    const { from, to } = req.query;

    const startYear = Number(from.substring(0, 4));
    const startMonth = Number(from.substring(4));
    const startDateInclusive = new Date(startYear, startMonth - 1);

    const endYear = Number(to.substring(0, 4));
    const endMonth = Number(to.substring(4));
    const endDateExclusive = new Date(
      endMonth === 12 ? endYear + 1 : endYear,
      endMonth === 12 ? 1 : endMonth
    );

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
