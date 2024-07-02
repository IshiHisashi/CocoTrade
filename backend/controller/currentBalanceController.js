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
  console.log(req.body);
  try {
    const user = await UserModel.findById(req.params.userid);
    const isDateChange = req.body.currentPurchaseDate !== req.body.updatedDate;
    const difCash = +req.body.updatedPrice - req.body.currentPrice;

    const loopUpdate = (docs, changevalue) => {
      docs.forEach(async (doc) => {
        await CurrentBalanceModel.findByIdAndUpdate(doc._id, {
          current_balance:
            req.body.type === "purchase"
              ? +doc.current_balance - changevalue
              : +doc.current_balance + changevalue,
        });
      });
    };
    if (!isDateChange) {
      console.log("in scenario1");
      // Scenraio 1). No date change
      // Step1). FIND OUT SUBSEQUENT TRANSACTIONS
      const docsLater = await CurrentBalanceModel.aggregate([
        {
          $match: {
            _id: { $in: user.balance_array },
            date: {
              $gte: new Date(req.body.updatedDate),
            },
          },
        },
        {
          $sort: { date: 1 },
        },
      ]);
      //  Step2). Update cash balance
      loopUpdate(docsLater, difCash);
      return res.status(201).json({
        status: "success in updating",
      });
    } else {
      //Scenario 2). Date change
      // download common docs in scenario2-1 and 2-2
      const docUpdatedDay = await CurrentBalanceModel.aggregate([
        {
          $match: {
            _id: { $in: user.balance_array },
            date: new Date(req.body.updatedDate),
          },
        },
        {
          $sort: { date: 1 },
        },
      ]);
      const docLatestOfUpdateDay = await CurrentBalanceModel.aggregate([
        {
          $match: {
            _id: { $in: user.balance_array },
            date: { $lt: new Date(req.body.updatedDate) },
          },
        },
        {
          $sort: { date: -1 },
        },
        {
          $limit: 1,
        },
      ]);
      // Scenario 2-1). date is move back
      if (req.body.currentPurchaseDate > req.body.updatedDate) {
        console.log("in scenario2-1");
        // downloadn necessary docs
        const docUpdateUntilCurrent = await CurrentBalanceModel.aggregate([
          {
            $match: {
              _id: { $in: user.balance_array },
              date: {
                $gte: new Date(req.body.updatedDate),
                $lt: new Date(req.body.currentPurchaseDate),
              },
            },
          },
          {
            $sort: { date: 1 },
          },
        ]);
        const docSubsequent = await CurrentBalanceModel.aggregate([
          {
            $match: {
              _id: { $in: user.balance_array },
              date: { $gte: new Date(req.body.currentPurchaseDate) },
            },
          },
          {
            $sort: { date: 1 },
          },
        ]);

        // updated date is newly created or updated (register the updated value)
        if (docUpdatedDay.length > 0) {
          console.log("doc already exists");
          // if there's already another doc on the date of updated, override with the updatedPrice. This should be extended until the current date.
          loopUpdate(docUpdateUntilCurrent, +req.body.updatedPrice);
          // update all the subsequent dates after current date (value is based on dif cash).
          loopUpdate(docSubsequent, difCash);
          // Return
          return res.status(201).json({
            status: "success in updating",
          });
        } else {
          console.log("no doc");
          // if no doc on the day updated, create a new doc
          const newDoc = {
            user_id: req.body.user_id,
            date: req.body.updatedDate,
            current_balance:
              req.body.type === "purchase"
                ? docLatestOfUpdateDay[0].current_balance -
                  req.body.updatedPrice
                : docLatestOfUpdateDay[0].current_balance +
                  req.body.updatedPrice,
          };
          const newCurrentBalance = await CurrentBalanceModel.create(newDoc);
          // update all the subsequent dates (value is based on dif cash)
          loopUpdate(docUpdateUntilCurrent, +req.body.updatedPrice);
          loopUpdate(docSubsequent, difCash);
          res.status(201).json({
            status: "success",
            data: {
              newCurrentBalance,
            },
          });
        }
      }
      // Scenario 2-2). date is move forward
      if (req.body.currentPurchaseDate < req.body.updatedDate) {
        console.log("in scenario2-2");
        // Download necessrary docs
        const docCurrentUntilUpdate = await CurrentBalanceModel.aggregate([
          {
            $match: {
              _id: { $in: user.balance_array },
              date: {
                $gte: new Date(req.body.currentPurchaseDate),
                $lt: new Date(req.body.updatedDate),
              },
            },
          },
          {
            $sort: { date: 1 },
          },
        ]);
        const docSubsequent = await CurrentBalanceModel.aggregate([
          {
            $match: {
              _id: { $in: user.balance_array },
              date: { $gt: new Date(req.body.updatedDate) },
            },
          },
          {
            $sort: { date: 1 },
          },
        ]);
        // Cancel the balance of current day and subsequent days until update day.
        loopUpdate(docCurrentUntilUpdate, -req.body.currentPrice);
        if (docUpdatedDay.length > 0) {
          console.log("doc already exists");
          loopUpdate(docUpdatedDay, difCash);
          loopUpdate(docSubsequent, difCash);
          return res.status(201).json({
            status: "success in updating",
          });
        } else {
          console.log("no doc");
          // if no doc on the day updated, create a new doc
          const newDoc = {
            user_id: req.body.user_id,
            date: req.body.updatedDate,
            current_balance:
              req.body.type === "purchase"
                ? docLatestOfUpdateDay[0].current_balance - difCash
                : docLatestOfUpdateDay[0].current_balance + difCash,
          };
          const newCurrentBalance = await CurrentBalanceModel.create(newDoc);
          // update all the subsequent dates (value is based on dif cash)
          loopUpdate(docSubsequent, difCash);
          res.status(201).json({
            status: "success",
            data: {
              newCurrentBalance,
            },
          });
        }
      }
    }
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
