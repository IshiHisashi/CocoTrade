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
      const user = await UserModel.findById(req.params.userid)
          .populate('inventory_amount_array')
          .populate('sales_array');

      if (!user) {
          return res.status(404).json({ 
              status: "failed",
              error: 'User not found' 
          });
      }
      const data = {
          max_amount: user.max_inventory_amount,
          inventory: user.inventory_amount_array,
          sales: user.sales_array
      }
      console.log("Inventories retrieved");
      res.status(200).json({
          status: "Success",
          data: data });
  }
  catch (err) {
      res.status(500).json({
          status: "failed",
          error: err.message
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
      error: 'Please provide both start and end timestamps' 
    });
  }

  try {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const user = await UserModel.findById(req.params.userid)
        .populate('inventory_amount_array')
        .populate('sales_array');

    if (!user) {
        return res.status(404).json({ 
            status: "failed",
            error: 'User not found' 
        });
    }
    const data = user.inventory_amount_array;
    const dataBasedOnDuration = await data.filter(item => {
      const itemDate = new Date(item.time_stamp);
      return itemDate >= startDate && itemDate <= endDate;
    })
    console.log("Inventories retrieved");
    res.status(200).json({
        status: "Success",
        data: dataBasedOnDuration });
  }
  catch (err) {
      res.status(500).json({
          status: "failed",
          error: err.message
      });
  }
};

// Get all the manufacturers based on user
export const getAllManufacturers = async (req, res) => {
  try {
      // GET MANUFACTURERS INFO
      const user = await UserModel.findById(req.params.userid)
          .populate('manufacturers_array');

      if (!user) {
          return res.status(404).json({
              status: "failed", 
              error: 'User not found' 
          });
      }
      const data = {
          manufacturers: user.manufacturers_array,
      }
      console.log("Manufacturers retrieved");
      res.status(200).json({
          status: "success",
          data: data
      });
  }
  catch (err) {
      res.status(500).json({
          status: "failed",
          error: err.message
      });
  }
}

// Get all the Notifications based on user
export const getAllNotifications = async (req, res) => {
  try {
      // GET Notifications info
      const user = await UserModel.findById(req.params.userid)
          .populate('notification_array');

      if (!user) {
          return res.status(404).json({
              status: "failed", 
              error: 'User not found' 
          });
      }
      const data = {
          Notifications: user.notification_array,
      }
      console.log("Notifications retrieved");
      res.status(200).json({
          status: "success",
          data: data
      });
  }
  catch (err) {
      res.status(500).json({
          status: "failed",
          error: err.message
      });
  }
}

// Get all the Notifications based on duration
// SOMETHING IS WRONG AND COULDN'T FIGURE OUT WHY
export const getNotificationsByDuration = async (req, res) => {

  const { start, end } = req.query;
  console.log(start, end);
  if (!start || !end) {
    return res.status(400).json({ 
      status: "failed",
      error: 'Please provide both start and end timestamps' 
    });
  }

  try {
    const startDate = new Date(start);
    const endDate = new Date(end);
    console.log(startDate);
    console.log(endDate);
    const user = await UserModel.findById(req.params.userid)
        .populate('notification_array');

    if (!user) {
        return res.status(404).json({
            status: "failed", 
            error: 'User not found' 
        });
    }
    const data = user.notification_array;
    const dataBasedOnDuration = await data.filter(item => {
      console.log(item.time_stamp);
      const itemDate = new Date(item.time_stamp);
      console.log(itemDate);
      return itemDate >= startDate && itemDate <= endDate;
    })
    console.log("Notifications retrieved");
    res.status(200).json({
        status: "success",
        data: dataBasedOnDuration
    });
  }
  catch (err) {
    res.status(500).json({
        status: "failed",
        error: err.message
    });
  }
}