import { CurrentBalanceModel } from "../model/currentBalanceModel.js";
import { UserModel } from "../model/userModel.js";
// Define fnc to read the data
// Create
export const createCurrentBalance = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userid);
    // ---Prepare the data----
    // Get the latest balance
    const docLatest = await CurrentBalanceModel.aggregate([
      {
        $match: {
          _id: { $in: user.balance_array },
          date: { $lte: new Date(req.body.date) },
        },
      },
      {
        $sort: { date: -1 },
      },
      {
        $limit: 1,
      },
    ]);
    const currentCash = +docLatest[0].current_balance; // This currentCash should be the one to be updated regardless of the 'same day' or 'nearest latest day'.
    // See if there is any doc which is later than the date
    const docsLater = await CurrentBalanceModel.aggregate([
      {
        $match: {
          _id: { $in: user.balance_array },
          date: { $gte: new Date(req.body.date) },
        },
      },
      {
        $sort: { date: 1 },
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
          await CurrentBalanceModel.findByIdAndUpdate(doc._id, {
            current_balance:
              req.body.type === "purchase"
                ? doc.current_balance - req.body.changeValue
                : doc.current_balance + req.body.changeValue,
          });
        });
      };
      // 1-2 if the same day, just update the balance
      if (docNearest.date.getTime() === new Date(req.body.date).getTime()) {
        console.log("you're in 1-2_C");
        loopUpdate(docsLater);
        res.status(201).json({
          status: "success in updating",
        });
      } else {
        // 1-3 if no same day,
        console.log("you're in 1-3_C", docsLater);
        // 1-3-1 create a new one
        const newDoc = {
          user_id: req.body.user_id,
          date: req.body.date,
          current_balance:
            req.body.type === "purchase"
              ? currentCash - req.body.changeValue
              : currentCash + req.body.changeValue,
        };
        const newCurrentBalance = await CurrentBalanceModel.create(newDoc);
        // 1-3-2 then, update all the subsequenst docs
        loopUpdate(docsLater);
        // res
        res.status(201).json({
          status: "success",
          data: {
            newCurrentBalance,
          },
        });
      }
    }
    // Scenario 2. if the new transaction is the latest one.
    else {
      console.log("you're in 2_c");
      const newDoc = {
        user_id: req.body.user_id,
        date: req.body.date,
        current_balance:
          req.body.type === "purchase"
            ? currentCash - req.body.changeValue
            : currentCash + req.body.changeValue,
      };
      const newCurrentBalance = await CurrentBalanceModel.create(newDoc);
      res.status(201).json({
        status: "success",
        data: {
          newCurrentBalance,
        },
      });
    }
  } catch (err) {
    console.log(err);
    // in case anything conflicting with schema is detected
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// Read_1 (all docs)
export const getAllCurrentBalance = async (req, res) => {
  try {
    // Read the docs
    const docs = await CurrentBalanceModel.find({});
    res.status(201).json({
      status: "success",
      data: {
        docs,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: "failed",
    });
  }
};

export const getAllCurrentBalanceByUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userid);
    // Read the docs
    // const docs = await CurrentBalanceModel.find({});
    const docs = await CurrentBalanceModel.aggregate([
      { $match: { _id: { $in: user.balance_array } } },
    ]);
    res.status(201).json({
      status: "success",
      data: {
        docs,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: "failed",
    });
  }
};
// Read_2 (one doc)
export const getCurrentBalance = async (req, res) => {
  try {
    const doc = await CurrentBalanceModel.findById(req.params.id);
    res.status(201).json({
      status: "success",
      data: {
        doc,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// Read the most latest one
export const getLatestBalance = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userid);
    // Read the docs
    // const docs = await CurrentBalanceModel.find({});
    const doc = await CurrentBalanceModel.aggregate([
      {
        $match: { _id: { $in: user.balance_array } },
      },
      {
        $sort: { date: -1 },
      },
      {
        $limit: 1,
      },
    ]);
    res.status(201).json({
      status: "success",
      data: {
        doc,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: "failed",
    });
  }
};

// Update and Delete needs parameter (ID)
// Update
export const updateCurrentBalance = async (req, res) => {
  try {
    const result = await CurrentBalanceModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!result) {
      return res.status(404).json({ message: "not found" });
    }
    return res.status(201).json({
      status: "success in updating",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
// Delete
export const deleteCurrentBalance = async (req, res) => {
  try {
    const result = await CurrentBalanceModel.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "not found" });
    }
    return res.status(201).json({
      status: "success in deleting",
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
