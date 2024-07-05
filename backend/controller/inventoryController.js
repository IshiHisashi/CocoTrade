import { Inventory } from "../model/inventoryModel.js";
import { UserModel } from "../model/userModel.js";

const sum = (arg1, arg2) => {
  return Number(arg1) + Number(arg2);
};

// Create the very first inentory at the end of the onboarding
export const createFirstInventory = async (req, res) => {
  try {
    const newInventory = new Inventory(req.body);
    const savedInventory = await newInventory.save();
    res.status(201).json({
      status: "success",
      data: savedInventory,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      error: error.message,
    });
  }
};

// Create inventory
export const createInventory = async (req, res) => {
  try {
    // Get the latest inventory
    const user = await UserModel.findById(req.params.userid);
    console.log(req.params.userid);
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
    const currentInventoryLeft = docLatest[0]
      ? +docLatest[0].current_amount_left
      : +docsLater[0].current_amount_left;
    const currentInventoryPending = docLatest[0]
      ? +docLatest[0].current_amount_with_pending
      : +docsLater[0].current_amount_with_pending;

    // ----- Execute ------
    // Scenario 1. if the new transaction is NOT the latest one.
    if (+docsLater.length !== 0) {
      // 1-1 get the nearest balance
      const docNearest = docLatest[0] || docsLater[0];
      console.log(docNearest);
      // set the function to update doc(s)
      const loopUpdate = (docs) => {
        docs.forEach(async (doc) => {
          await Inventory.findByIdAndUpdate(doc._id, {
            current_amount_left:
              req.body.type === "purchase"
                ? sum(doc.current_amount_left, req.body.changeValue)
                : sum(doc.current_amount_left, -req.body.changeValue),
            current_amount_with_pending:
              req.body.type === "purchase"
                ? sum(doc.current_amount_with_pending, req.body.changeValue)
                : sum(doc.current_amount_with_pending, -req.body.changeValue),
          });
        });
      };
      console.log(docNearest);
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
              ? sum(currentInventoryLeft, req.body.changeValue)
              : sum(currentInventoryLeft, -req.body.changeValue),
          current_amount_with_pending:
            req.body.type === "purchase"
              ? sum(currentInventoryPending, req.body.changeValue)
              : sum(currentInventoryPending, -req.body.changeValue),
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
      console.log(docLatest, docsLater);
      console.log("you're in 2_I");
      const newDoc = {
        user_id: req.body.user_id,
        time_stamp: req.body.date,
        current_amount_left:
          req.body.type === "purchase"
            ? sum(currentInventoryLeft, req.body.changeValue)
            : sum(currentInventoryLeft, -req.body.changeValue),
        current_amount_with_pending:
          req.body.type === "purchase"
            ? sum(currentInventoryPending, req.body.changeValue)
            : sum(currentInventoryPending, -req.body.changeValue),
      };
      const newInventory = await Inventory.create(newDoc);
      res.status(201).json({
        status: "success",
        data: {
          newInventory,
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "failed",
      error: err.message,
    });
  }
};

// Create simple Inventory
export const createSimpleInventory = async (req, res) => {
  try {
      const newInventoryLog = new Inventory(req.body);
      const savedInventoryLog = await newInventoryLog.save();
      console.log("newInventory Added!");
      res.status(201).json({
          status: "Success",
          data: savedInventoryLog
      });
  }
  catch(err) {
      res.status(500).json({
          status: "failed",
          error: err.message
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

export const updateInventoryPurchase = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userid);
    const isDateChange = req.body.currentPurchaseDate !== req.body.updatedDate;
    const difCopra = +req.body.updatedCopra - req.body.currentCopra;
    const loopUpdate = (docs, changevalue) => {
      docs.forEach(async (doc) => {
        await Inventory.findByIdAndUpdate(doc._id, {
          current_amount_left:
            req.body.type === "purchase"
              ? sum(doc.current_amount_left, changevalue)
              : sum(doc.current_amount_left, -changevalue),
          current_amount_with_pending:
            req.body.type === "purchase"
              ? sum(doc.current_amount_with_pending, changevalue)
              : sum(doc.current_amount_with_pending, -changevalue),
        });
      });
    };
    if (!isDateChange) {
      console.log("in scenario1");
      // Scenraio 1). No date change
      // Step1). FIND OUT SUBSEQUENT TRANSACTIONS
      const docsLater = await Inventory.aggregate([
        {
          $match: {
            _id: { $in: user.inventory_amount_array },
            time_stamp: {
              $gte: new Date(req.body.updatedDate),
            },
          },
        },
        {
          $sort: { time_stamp: 1 },
        },
      ]);
      //  Step2). Update cash balance
      loopUpdate(docsLater, difCopra);
      return res.status(201).json({
        status: "success in updating",
      });
    } else {
      //Scenario 2). Date change
      // download common docs in scenario2-1 and 2-2
      const docUpdatedDay = await Inventory.aggregate([
        {
          $match: {
            _id: { $in: user.inventory_amount_array },
            time_stamp: new Date(req.body.updatedDate),
          },
        },
        {
          $sort: { time_stamp: 1 },
        },
      ]);
      const docLatestOfUpdateDay = await Inventory.aggregate([
        {
          $match: {
            _id: { $in: user.inventory_amount_array },
            time_stamp: { $lt: new Date(req.body.updatedDate) },
          },
        },
        {
          $sort: { time_stamp: -1 },
        },
        {
          $limit: 1,
        },
      ]);
      // Scenario 2-1). date is move back
      if (req.body.currentPurchaseDate > req.body.updatedDate) {
        console.log("in scenario2-1");
        // downloadn necessary docs
        const docUpdateUntilCurrent = await Inventory.aggregate([
          {
            $match: {
              _id: { $in: user.inventory_amount_array },
              time_stamp: {
                $gte: new Date(req.body.updatedDate),
                $lt: new Date(req.body.currentPurchaseDate),
              },
            },
          },
          {
            $sort: { time_stamp: 1 },
          },
        ]);
        const docSubsequent = await Inventory.aggregate([
          {
            $match: {
              _id: { $in: user.inventory_amount_array },
              time_stamp: { $gte: new Date(req.body.currentPurchaseDate) },
            },
          },
          {
            $sort: { time_stamp: 1 },
          },
        ]);
        // updated date is newly created or updated (register the updated value)
        if (docUpdatedDay.length > 0) {
          console.log("doc already exists");
          // if there's already another doc on the date of updated, override with the updatedPrice. This should be extended until the current date.
          loopUpdate(docUpdateUntilCurrent, +req.body.updatedCopra);
          // update all the subsequent dates after current date (value is based on dif cash).
          loopUpdate(docSubsequent, +difCopra);
          // Return
          return res.status(201).json({
            status: "success in updating",
          });
        } else {
          console.log("no doc");
          // if no doc on the day updated, create a new doc
          const newDoc = {
            user_id: req.body.user_id,
            time_stamp: req.body.updatedDate,
            current_amount_left:
              req.body.type === "purchase"
                ? sum(
                    docLatestOfUpdateDay[0].current_amount_left,
                    req.body.updatedCopra
                  )
                : sum(
                    docLatestOfUpdateDay[0].current_amount_left,
                    -req.body.updatedCopra
                  ),
            current_amount_with_pending:
              req.body.type === "purchase"
                ? sum(
                    docLatestOfUpdateDay[0].current_amount_with_pending,
                    req.body.updatedCopra
                  )
                : sum(
                    docLatestOfUpdateDay[0].current_amount_with_pending,
                    -req.body.updatedCopra
                  ),
          };
          const newInventory = await Inventory.create(newDoc);
          // update all the subsequent dates (value is based on dif cash)
          loopUpdate(docUpdateUntilCurrent, +req.body.updatedCopra);
          loopUpdate(docSubsequent, +difCopra);
          res.status(201).json({
            status: "success",
            data: {
              newInventory,
            },
          });
        }
      }
      // Scenario 2-2). date is move forward
      if (req.body.currentPurchaseDate < req.body.updatedDate) {
        console.log("in scenario2-2");
        // Download necessrary docs
        const docCurrentUntilUpdate = await Inventory.aggregate([
          {
            $match: {
              _id: { $in: user.inventory_amount_array },
              time_stamp: {
                $gte: new Date(req.body.currentPurchaseDate),
                $lt: new Date(req.body.updatedDate),
              },
            },
          },
          {
            $sort: { time_stamp: 1 },
          },
        ]);
        const docSubsequent = await Inventory.aggregate([
          {
            $match: {
              _id: { $in: user.inventory_amount_array },
              time_stamp: { $gt: new Date(req.body.updatedDate) },
            },
          },
          {
            $sort: { time_stamp: 1 },
          },
        ]);
        // Cancel the balance of current day and subsequent days until update day.
        loopUpdate(docCurrentUntilUpdate, -req.body.currentCopra);
        if (docUpdatedDay.length > 0) {
          console.log("doc already exists");
          loopUpdate(docUpdatedDay, +difCopra);
          loopUpdate(docSubsequent, +difCopra);
          return res.status(201).json({
            status: "success in updating",
          });
        } else {
          console.log("no doc");
          // if no doc on the day updated, create a new doc
          const newDoc = {
            user_id: req.body.user_id,
            time_stamp: req.body.updatedDate,
            current_amount_left:
              req.body.type === "purchase"
                ? sum(docLatestOfUpdateDay[0].current_amount_left, difCopra)
                : sum(docLatestOfUpdateDay[0].current_amount_left, -difCopra),
            current_amount_with_pending:
              req.body.type === "purchase"
                ? sum(
                    docLatestOfUpdateDay[0].current_amount_with_pending,
                    difCopra
                  )
                : sum(
                    docLatestOfUpdateDay[0].current_amount_with_pending,
                    -difCopra
                  ),
          };
          const newInventory = await Inventory.create(newDoc);
          // update all the subsequent dates (value is based on dif cash)
          loopUpdate(docSubsequent, +difCopra);
          res.status(201).json({
            status: "success",
            data: {
              newInventory,
            },
          });
        }
      }
    }
  } catch (err) {
    console.log(err);
    console.log(req.body);
    return res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
