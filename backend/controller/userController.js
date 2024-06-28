import { UserModel } from "../model/userModel.js";
import { Sale } from "../model/saleModel.js";
import { Inventory } from "../model/inventoryModel.js";

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
    return res.status(200).json({
      status: "success",
      data: doc,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Read all users and return user IDs and their preffered margin
export const readAllUsers = async (req, res) => {
  try {
    const docs = await UserModel.find({});
    if (!docs) {
      return res.status(404).json({
        status: "fail",
        message: "Couldn't get all users",
      });
    }
    // eslint-disable-next-line no-underscore-dangle
    const userIdsArray = docs.map((doc) => doc._id);
    return res.status(200).json({
      status: "success",
      data: userIdsArray,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Update a user
export const updateUser = async (req, res) => {
  const { userid } = req.params;

  const keysArray = Object.keys(req.body);

  try {
    let doc;

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < keysArray.length; i++) {
      const currentKey = keysArray[i];

      const objToBePushed = {};
      objToBePushed[currentKey] = req.body[currentKey];

      if (req.body[currentKey] instanceof Array) {
        // eslint-disable-next-line no-await-in-loop
        doc = await UserModel.findByIdAndUpdate(
          userid,
          { $push: { ...objToBePushed } },
          {
            new: true,
          }
        );
      } else {
        // eslint-disable-next-line no-await-in-loop
        doc = await UserModel.findByIdAndUpdate(userid, objToBePushed, {
          new: true,
        });
      }

      if (!doc) {
        return res.status(404).json({
          status: "fail",
          message: "User not found",
        });
      }
    }

    return res.status(201).json({
      status: "success",
      data: doc,
    });
  } catch (error) {
    return res.status(500).json({
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
    return res.status(201).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Get all the inventory data based on user
export const getAllInventories = async (req, res) => {
  try {
    // GET INVENTORY INFO
    const user = await UserModel.findById(req.params.userid).populate(
      "inventory_amount_array"
    );

    if (!user) {
      return res.status(404).json({
        status: "failed",
        error: "User not found",
      });
    }
    const data = user.inventory_amount_array;
    await data.sort((a, b) => {
      return new Date(b.time_stamp) - new Date(a.time_stamp);
    });
    console.log("Inventories retrieved");
    return res.status(200).json({
      status: "Success",
      data,
    });
  } catch (err) {
    return res.status(500).json({
      status: "failed",
      error: err.message,
    });
  }
};

// Get all the inventory data based on duration
// ex) http://localhost:5555/user/:userid/invd?start=2024-01-21T13:45:00.000Z&end=2024-05-25T13:45:00.000Z
export const getInventoriesOnDuration = async (req, res) => {
  const { start, end } = req.query;
  if (!start || !end) {
    return res.status(400).json({
      status: "failed",
      error: "Please provide both start and end timestamps",
    });
  }

  try {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const user = await UserModel.findById(req.params.userid)
      .populate("inventory_amount_array")
      .populate("sales_array");

    if (!user) {
      return res.status(404).json({
        status: "failed",
        error: "User not found",
      });
    }
    const data = user.inventory_amount_array;
    const dataBasedOnDuration = await data.filter((item) => {
      const itemDate = new Date(item.time_stamp);
      return itemDate >= startDate && itemDate <= endDate;
    });
    await dataBasedOnDuration.sort((a, b) => {
      return new Date(b.time_stamp) - new Date(a.time_stamp);
    });
    console.log("Inventories retrieved");
    return res.status(200).json({
      status: "Success",
      data: dataBasedOnDuration,
    });
  } catch (err) {
    return res.status(500).json({
      status: "failed",
      error: err.message,
    });
  }
};

// Get the maximum capacity based on user
export const getMaximumCap = async (req, res) => {
  try {
    // GET INVENTORY INFO
    const user = await UserModel.findById(req.params.userid);

    if (!user) {
      return res.status(404).json({
        status: "failed",
        error: "User not found",
      });
    }
    console.log(user);
    const data = user.max_inventory_amount;
    console.log("Max Capacity retrieved");
    return res.status(200).json({
      status: "Success",
      data,
    });
  } catch (err) {
    return res.status(500).json({
      status: "failed",
      error: err.message,
    });
  }
};

// Get all the manufacturers based on user
export const getAllManufacturers = async (req, res) => {
  try {
    // GET MANUFACTURERS INFO
    const user = await UserModel.findById(req.params.userid).populate(
      "manufacturers_array"
    );

    if (!user) {
      return res.status(404).json({
        status: "failed",
        error: "User not found",
      });
    }
    const data = {
      manufacturers: user.manufacturers_array,
    };
    console.log("Manufacturers retrieved");
    return res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    return res.status(500).json({
      status: "failed",
      error: err.message,
    });
  }
};

// Get all the Notifications based on user
export const getAllNotifications = async (req, res) => {
  try {
    // GET Notifications info
    const user = await UserModel.findById(req.params.userid).populate(
      "notification_array"
    );

    if (!user) {
      return res.status(404).json({
        status: "failed",
        error: "User not found",
      });
    }
    const data = {
      Notifications: user.notification_array,
    };
    console.log("Notifications retrieved");
    return res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    return res.status(500).json({
      status: "failed",
      error: err.message,
    });
  }
};

// Get all the Notifications based on duration
// SOMETHING IS WRONG AND COULDN'T FIGURE OUT WHY
export const getNotificationsByDuration = async (req, res) => {
  const { start, end } = req.query;
  console.log(start, end);
  if (!start || !end) {
    return res.status(400).json({
      status: "failed",
      error: "Please provide both start and end timestamps",
    });
  }

  try {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const user = await UserModel.findById(req.params.userid).populate(
      "notification_array"
    );

    if (!user) {
      return res.status(404).json({
        status: "failed",
        error: "User not found",
      });
    }
    const data = user.notification_array;
    const dataBasedOnDuration = await data.filter((item) => {
      const itemDate = new Date(item.time_stamp);
      return itemDate >= startDate && itemDate <= endDate;
    });
    console.log("Notifications retrieved");
    return res.status(200).json({
      status: "success",
      data: dataBasedOnDuration,
    });
  } catch (err) {
    return res.status(500).json({
      status: "failed",
      error: err.message,
    });
  }
};

export const getTopFiveSales = async (req, res) => {
  try {
    // GET sales INFO
    const user = await Sale.find({ user_id: req.params.userid })
      .populate({
        path: "manufacturer_id",
        model: "Manufacturer",
      })
      .sort({ copra_ship_date: -1 })
      .limit(7);

    if (!user) {
      return res.status(404).json({
        status: "failed",
        error: "User not found",
      });
    }
    const data = user;
    console.log("Sales retrieved");
    return res.status(200).json({
      status: "Success",
      data,
    });
  } catch (err) {
    return res.status(500).json({
      status: "failed",
      error: err.message,
    });
  }
};
