import { PurchaseLogModel } from "../model/purchaseLogModel.js";

// this file is created by Sacha.

// Create
export const createPurchaseLog = async (req, res) => {
  try {
    const newPurchaseLog = await PurchaseLogModel.create(req.body);
    res.status(201).sendDateExclusive(newPurchaseLog);
  } catch (error) {
    console.log(error.message);
    res.status(500).sendDateExclusive({ message: error.message });
  }
};

// Read purchase logs based on month
export const readThisMonthPurchaseLogs = async (req, res) => {
  try {
    const month = req.params.month;
    console.log(month);

    let startDateInclusive;
    let endDateExclusive;

    if (month === "thismonth") {
      const thisMonthNum = new Date().getMonth();
      startDateInclusive = new Date(
        new Date().setMonth(thisMonthNum, 1)
      ).setHours(0, 0, 0, 0);
      console.log(new Date(startDateInclusive));

      endDateExclusive = new Date(startDateInclusive).setMonth(
        thisMonthNum + 1
      );
      console.log(new Date(endDateExclusive));
    } else if (month === "lastmonth") {
      const lastMonthNum = new Date().getMonth() - 1;
      startDateInclusive = new Date(
        new Date().setMonth(lastMonthNum, 1)
      ).setHours(0, 0, 0, 0);
      console.log(new Date(startDateInclusive));

      endDateExclusive = new Date(startDateInclusive).setMonth(
        lastMonthNum + 1
      );
      console.log(new Date(endDateExclusive));
    }

    const docs = await PurchaseLogModel.find({
      purchase_date: {
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
