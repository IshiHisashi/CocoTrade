import { CurrentBalanceModel } from "../model/currentBalanceModel.js";
import { UserModel } from "../model/userModel.js";

// Create the very first balance at the end of the onboarding
export const createFirstCurrentBalance = async (req, res) => {
  try {
    const newCurrentBalance = await CurrentBalanceModel.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        newCurrentBalance,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

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
    // This currentCash should be the one to be updated regardless of the 'same day' or 'nearest latest day'.
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
    const currentCash = docLatest[0]
      ? +docLatest[0].current_balance
      : +docsLater[0].current_balance;

    // ----- Execute ------
    // Scenario 1. if the new transaction is NOT the latest one.
    if (+docsLater.length !== 0) {
      // 1-1 get the nearest balance
      const docNearest = docLatest[0] || docsLater[0];
      console.log(docNearest);
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

export const updateCurrentBalanceAndCascade = async (req, res) => {
  try {
    const userId = req.body.userId;
    const prevReceivedDate = req.body.prevReceivedDate;
    const newReceivedDate = req.body.newReceivedDate;
    const prevPrice = req.body.prevPrice;
    const newPrice = req.body.newPrice;
  
    // loop function to update and cascade the change in total_sales_price
    const loopUpdateFinDocs = (docs, number, type) => {
      if (type === "add" || type === "modify") {
        docs.forEach(async (doc) => {
          await CurrentBalanceModel.findByIdAndUpdate(doc._id, {
            current_balance: Number(doc.current_balance) + Number(number),
          });
        });
      } else if (type === "reverse") {
        docs.forEach(async (doc) => {
          await CurrentBalanceModel.findByIdAndUpdate(doc._id, {
            current_balance: Number(doc.current_balance) - Number(number),
          });
        });
      }
    };
  
    // Get user
    const user = await UserModel.findById(userId);

    // Get a latest finance doc
    const docLatest = await CurrentBalanceModel.aggregate([
      {
        $match: {
          _id: { $in: user.balance_array },
          date: { $lte: new Date(newReceivedDate) },
        },
      },
      {
        $sort: { date: -1 },
      },
      {
        $limit: 1,
      },
    ]);

    // If there is no fin doc for today, create a new one with the exact same current_balance num. Logic is a bit different from Inv controller here. 
    if (docLatest[0].date.toISOString().split('T')[0] !== newReceivedDate) {
      const newFinData = {
        user_id: userId,
        purchases_array: [],
        purchases_sum: 0,
        sales_array: [],
        sales_sum: 0,
        current_balance: docLatest[0].current_balance,
        date: new Date(newReceivedDate),
      }
      console.log(newFinData);
      const newFinDoc = CurrentBalanceModel(newFinData);
      const savedNewFinDoc = await newFinDoc.save();
      const id = savedNewFinDoc._id;
      const newFinArray = [...user.balance_array, id];
      await UserModel.findByIdAndUpdate(user._id, {
        balance_array: newFinArray,
      })
    }

    // When needed to add number to current_balance
    if (req.body.addFinNeeded === true) {
      const docsLater = await CurrentBalanceModel.aggregate([
        {
          $match: {
            _id: { $in: user.balance_array },
            date: {
              $gte: new Date(newReceivedDate),
            },
          },
        },
        {
          $sort: { date: 1 },
        },
      ]);
      loopUpdateFinDocs(docsLater, newPrice, "add");
    }

    // When needed to reverse addition done before. It has to stick with the previous money received date to ensure its consistency and reliability
    if (req.body.reverseFinNeeded === true) {
      const docsLater = await CurrentBalanceModel.aggregate([
        {
          $match: {
            _id: { $in: user.balance_array },
            date: {
              $gte: new Date(prevReceivedDate),
            },
          },
        },
        {
          $sort: { date: 1 },
        },
      ]);
        loopUpdateFinDocs(docsLater, prevPrice, "reverse");
    }

    // When need to modify current_balance number. This happens only when a user change money received date or total sales number while keeping its status "completed"
    if (req.body.modifFinWithDiffNeeded === true) {
      const difference = Number(newPrice) - Number(prevPrice);
      const docsLater = await CurrentBalanceModel.aggregate([
        {
          $match: {
            _id: { $in: user.balance_array },
            date: {
              $gte: new Date(prevReceivedDate),
            },
          },
        },
        {
          $sort: { date: 1 },
        },
      ]);
      console.log(docsLater);

      if (Number(prevPrice) !== Number(newPrice)) {
        loopUpdateFinDocs(docsLater, difference, "modify");
      }

      if (prevReceivedDate.split('T')[0] !== newReceivedDate) {
        if (new Date(newReceivedDate) < new Date(prevReceivedDate)) {
          const finDocsBetweenTwoDates = await CurrentBalanceModel.aggregate([
            {
              $match: {
                _id: { $in: user.balance_array },
                date: { 
                  $gte: new Date(newReceivedDate),
                  $lt: new Date(prevReceivedDate),
                },
              },
            },
            {
              $sort: { date: 1 },
            },
          ])
          if (finDocsBetweenTwoDates.length !== 0) {
            loopUpdateFinDocs(finDocsBetweenTwoDates, newPrice, "add");
          }
        } else {
          const finDocsBetweenTwoDates = await CurrentBalanceModel.aggregate([
            {
              $match: {
                _id: { $in: user.balance_array },
                date: { 
                  $gte: new Date(prevReceivedDate),
                  $lt: new Date(newReceivedDate),
                },
              },
            },
            {
              $sort: { date: 1 },
            },
          ])
          if (finDocsBetweenTwoDates.length !== 0) {
            loopUpdateFinDocs(finDocsBetweenTwoDates, newPrice, "reverse");
          } 
        }
      }
    }

    res.status(200).json({
      status: "success"
    })

  }
  catch (err) {
    res.status(500).json({
      status: "failed",
      error: err.message,
    });
  }
}