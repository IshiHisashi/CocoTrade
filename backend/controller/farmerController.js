import { Farmer } from "../model/farmerModel.js";

// Create Farmer
export const createFarmer = async (req, res) => {
    try {
        const newFarmer = new Farmer(req.body);
        const savedFarmer = await newFarmer.save();
        console.log("Farmer Added!");
        res.status(201).json({
            status: "Success",
            data: savedFarmer
        });
    }
    catch(err) {
        res.status(500).json({
            status: "failed",
            error: err.message
        });
    }
};

export const getAllFarmers = async (req, res) => {
    try {
      // eslint-disable-next-line camelcase
      const { user_id } = req.query;
      // eslint-disable-next-line camelcase
      const filter = user_id ? { user_id } : {};
      const farmers = await Farmer.find(filter, 'full_name');
      console.log("Farmers retrieved:");
      res.status(200).json(farmers);
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  };

export const getFarmerById = async (req, res) => {
    try {
        const farmer = await Farmer.findById(req.params.id);
        if(!farmer) {
            return res.status(404).json({
                status: "failed", 
                error: 'Farmer not found' 
            });
        }
        res.status(200).json({
            status: "success",
            data: farmer
        });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            error: err.message
        });
    }
};

export const updateFarmer = async (req, res) => {
    try {
        const userId = req.params.id;
        const updateData = req.body;

        const updatedFarmer = Farmer.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        );
        if (!updatedFarmer) {
            return res.status(404).json({
                status: "failed", 
                error: "Farmer noot found" 
            });
        }
        res.status(200).json({
            status: "success",
            data: updatedFarmer
        });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            error: err.message
        });
    }
}

export const deleteFarmer = async (req, res) => {
    try {
        const deletedFarmer = await Farmer.findByIdAndDelete(req.params.id);
        if (!deletedFarmer) {
            return res.status(404).json({
                status: "failed", 
                error: "Farmer not found" 
            });
        }
        res.status(200).json({
            status: "success",
            data: deletedFarmer
        });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            error: err.message
        });
    }
}