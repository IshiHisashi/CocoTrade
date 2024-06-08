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
    if (!doc) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    res.status(200).json({
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

// Update a user
// need to check how this will behave with array updating.
export const updateUser = async (req, res) => {
  try {
    const { userid } = req.params;
    const doc = await UserModel.findByIdAndUpdate(userid, req.body, {
      new: true,
    });
    if (!doc) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
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

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const { userid } = req.params;
    const result = await UserModel.findByIdAndDelete(userid);
    if (!result) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    res.status(201).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
