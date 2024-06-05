import { CurrentBalanceModel } from "../model/currentBalanceModel.js";
import { UserModel } from "../model/userModel.js";

// this file is created by Sacha.

// Create
export const createCurrentBalance = async (req, res) => {
  try {
    const { userid } = req.params;
    const {
      purchases_array,
      purchases_sum,
      sales_array,
      sales_sum,
      current_balance,
      date,
    } = req.body;

    const newData = {
      user_id: userid,
      purchases_array,
      purchases_sum,
      sales_array,
      sales_sum,
      current_balance,
      date,
    };

    const newCurrentBalance = await CurrentBalanceModel.create(newData);
    res.status(201).json({
      status: "success",
      data: newCurrentBalance,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Read current balance based on month range
export const readCurrentBalance = async (req, res) => {
  try {
    const { userid } = req.params;
    const { from, to } = req.query;

    const userDoc = await UserModel.findById(userid).populate("balance_array");

    if (!userDoc) {
      return res.status(404).json({
        status: "404: user not found",
      });
    }

    const startYear = Number(from.substring(0, 4));
    const startMonth = Number(from.substring(4));
    const startDateInclusive = new Date(startYear, startMonth - 1);

    const endYear = Number(to.substring(0, 4));
    const endMonth = Number(to.substring(4));
    const endDateExclusive = new Date(
      endMonth === 12 ? endYear + 1 : endYear,
      endMonth === 12 ? 1 : endMonth
    );

    const balanceDocs = userDoc.balance_array.filter((obj) => {
      const objDate = new Date(obj.date);
      return objDate >= startDateInclusive && objDate < endDateExclusive;
    });

    res.status(201).json({
      status: "success",
      data: balanceDocs,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
