import { Sale } from "../model/saleModel.js";
import { UserModel } from "../model/userModel.js";

export const createSale = async (req, res) => {
  try {
    const newSales = new Sale(req.body);
    const savedSales = await newSales.save();
    console.log("Sale Added!");
    res.status(201).json(savedSales);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

export const getAllSales = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const sales = await Sale.find({
      _id: { $in: user.sales_array },
    })
    .populate({
      path: 'manufacturer_id',
      select: 'full_name'  // Assuming the manufacturer's name is stored in the 'full_name' field
    });

    res.status(200).json(sales.map(sale => {
      // Transforming the data structure a bit to make it easier to handle on the frontend
      return {
        ...sale.toObject(),
        manufacturer_name: sale.manufacturer_id ? sale.manufacturer_id.full_name : 'N/A' // Include manufacturer name directly
      };
    }));
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};


export const getSaleById = async (req, res) => {
  try {
    const sales = await Sale.findById(req.params.id);
    if (!sales) {
      return res.status(404).json({
        error: "Sale not found",
      });
    }
    return res.status(200).json(sales);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

export const updateSale = async (req, res) => {
  try {
    const updatedSales = await Sale.findByIdAndUpdate(req.params.id, req.body);
    if (!updatedSales) {
      return res.status(404).json({
        error: "Sale not found",
      });
    }
    return res.status(200).json({
      status: "success in updating",
      data: updatedSales,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const deleteSale = async (req, res) => {
  try {
    const deletedSales = await Sale.findByIdAndDelete(req.params.id);
    if (!deletedSales) {
      return res.status(404).json({
        error: "Sale not found",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Sale successfully deleted",
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// This is to retrieve monthly sales aggregated number
export const aggregateMonthlySales = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userid);
    const salesAggregation = await Sale.aggregate([
      {
        $match: {
          _id: {
            $in: user.sales_array,
          },
        },
      },
      {
        $group: {
          _id: {
            year: {
              $year: "$copra_ship_date",
            },
            month: {
              $month: "$copra_ship_date",
            },
          },
          monthlySales: {
            $sum: "$total_sales_price",
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);
    res.status(200).json({
      status: "success",
      data: {
        salesAggregation,
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

// function to get dates for last week
const getLastWeekDates = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();

  // Set lastSunday
  const lastSunday = new Date();
  lastSunday.setDate(today.getDate() - dayOfWeek);

  // Set lastMonday
  const lastMonday = new Date(lastSunday);
  lastMonday.setDate(lastSunday.getDate() - 6);
  return {
    lastMonday,
    lastSunday,
  };
};

// This is to retrieve weekly total sales completed by a user
export const getWeeklyCompletedSalesSumByUserSalesArray = async (req, res) => {
  const userId = req.params.userid;
  const { lastMonday, lastSunday } = getLastWeekDates();

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const salesSum = await Sale.aggregate([
      {
        $match: {
          _id: {
            $in: user.sales_array,
          },
          status: "completed",
          cheque_receive_date: {
            $gte: lastMonday,
            $lte: lastSunday,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$total_sales_price",
          },
        },
      },
    ]);

    if (salesSum.length === 0 || !salesSum[0].total) {
      return res.status(404).json({
        status: "fail",
        message: "No completed sales found for this user in the last week",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        totalSales: salesSum[0].total,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

export const getNearestPendingSaleDate = async (req, res) => {
  try {
    const userId = req.params.userid;
    const currentDate = new Date();

    const nearestPendingSale = await Sale.findOne({ 
      user_id: userId, 
      status: "pending",
      copra_ship_date: { $gt: currentDate }
    })
    .sort({ copra_ship_date: 1 }); 

    if (!nearestPendingSale) {
      return res.status(404).json({
        status: "fail",
        message: "No pending sales found for this user",
      });
    }
    const formattedDate = nearestPendingSale.copra_ship_date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    });

    res.status(200).json({
      status: "success",
      date: formattedDate,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
