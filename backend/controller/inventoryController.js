import { Inventory } from "../model/inventoryModel.js";
import { UserModel } from "../model/userModel.js";

// Create inventory
export const createInventory = async (req, res) => {
  try {
    // Get the latest inventory
    const user = await UserModel.findById(req.params.userid);
    const docLatest = await Inventory.aggregate([
      {
        $match: {
          _id: { $in: user.inventory_amount_array },
          time_stamp: { $lte: new Date(req.body.date) },
        },
      },
      {
        $sort: { time_stamp: -1 },
      },
      {
        $limit: 1,
      },
    ]);
    const currentInventoryLeft = docLatest[0]
      ? +docLatest[0].current_amount_left
      : 0;
    const currentInventoryPending = docLatest[0]
      ? +docLatest[0].current_amount_with_pending
      : 0;
    // See if there is any doc which is later than the date
    const docsLater = await Inventory.aggregate([
      {
        $match: {
          _id: { $in: user.inventory_amount_array },
          time_stamp: { $gte: new Date(req.body.date) },
        },
      },
      {
        $sort: { time_stamp: 1 },
      },
    ]);

    // ----- Execute ------
    // Scenario 1. if the new transaction is NOT the latest one.
    if (+docsLater.length !== 0) {
      // 1-1 get the nearest balance
      const docNearest = docsLater[0];
      // set the function to update doc(s)
      const loopUpdate = (docs) => {
        docs.forEach(async (doc) => {
          await Inventory.findByIdAndUpdate(doc._id, {
            current_amount_left:
              req.body.type === "purchase"
                ? doc.current_amount_left + req.body.changeValue
                : doc.current_amount_left - req.body.changeValue,
          });
        });
      };
      // 1-2 if the same day, just update the balance
      if (
        docNearest.time_stamp.getTime() === new Date(req.body.date).getTime()
      ) {
        console.log("you're in 1-2_I");
        loopUpdate(docsLater);
        res.status(201).json({
          status: "success in updating",
        });
      } else {
        // 1-3 if no same day,
        console.log("you're in 1-3_I");
        // 1-3-1 create a new one
        const newDoc = {
          user_id: req.body.user_id,
          time_stamp: req.body.date,
          current_amount_left:
            req.body.type === "purchase"
              ? currentInventoryLeft + req.body.changeValue
              : currentInventoryLeft - req.body.changeValue,
          current_amount_with_pending: currentInventoryPending,
        };
        const newInventory = await Inventory.create(newDoc);
        // 1-3-2 then, update all the subsequenst docs
        loopUpdate(docsLater);
        // res
        res.status(201).json({
          status: "success",
          data: {
            newInventory,
          },
        });
      }
    }
    // Scenario 2. if the new transaction is the latest one.
    else {
      console.log("you're in 2_I");
      const newDoc = {
        user_id: req.body.user_id,
        time_stamp: req.body.date,
        current_amount_left:
          req.body.type === "purchase"
            ? currentInventoryLeft + req.body.changeValue
            : currentInventoryLeft - req.body.changeValue,
        current_amount_with_pending: currentInventoryPending,
      };
      const newInventory = await Inventory.create(newDoc);
      res.status(201).json({
        status: "success",
        data: {
          newInventory,
        },
      });
      // old
      // const newInventory = new Inventory(req.body);
      // const savedInventory = await newInventory.save();
      // console.log("Inventory Added!");
      // res.status(201).json({
      //   status: "success",
      //   data: savedInventory,
      // });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "failed",
      error: err.message,
    });
  }
};

export const getInventoryById = async (req, res) => {
  // To test this try path "id", value "665bc229cfc7cb78a6a6a956"

  try {
    const inventory = await Inventory.findById(req.params.id);
    // .populate("purchase_array")
    // .populate("sales_array");
    // ACTIVATE THIS LATER ONCE I GET SCHEMA

    if (!inventory) {
      return res.status(404).json({
        status: "failed",
        error: "Inventory not found",
      });
    }
    res.status(200).json({
      status: "Success",
      data: inventory,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      error: err.message,
    });
  }
};

export const updateInventory = async (req, res) => {
  try {
    const invId = req.params.id;
    const updateData = req.body;

    const updatedInventory = await Inventory.findByIdAndUpdate(
      invId,
      updateData
    );
    if (!updatedInventory) {
      return res.status(404).json({
        status: "failed",
        error: "User not found",
      });
    }
    res.status(200).json({
      status: "Success",
      data: updatedInventory,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      error: err.message,
    });
  }
};

export const deleteInventorById = async (req, res) => {
  try {
    const deletedInventory = await Inventory.findByIdAndDelete(req.params.id);
    if (!deletedInventory) {
      return res.status(404).json({
        status: "failed",
        error: "User not found",
      });
    }
    res.status(200).json({
      status: "Success",
      data: deletedInventory,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      error: err.message,
    });
  }
};
