import { UserModel } from "../model/userModel.js";

// Create a user
export const createUser = async (req, res) => {
  try {
    const newUser = await UserModel.create(req.body);
    res.status(201).json({
      status: "success",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Read a user
export const readUser = async (req, res) => {
  try {
    const { userid } = req.params;
    const doc = await UserModel.findById(userid);
    res.status(201).json({
      status: "success",
      data: doc,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
