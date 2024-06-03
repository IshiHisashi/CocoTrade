import { SalesLogModel } from "../model/salesLogModel.js";

// this file is created by Sacha.

// Create
export const createSalesLog = async (req, res) => {
  try {
    const newSalesLog = await SalesLogModel.create(req.body);
    res.status(201).send(newSalesLog);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};
