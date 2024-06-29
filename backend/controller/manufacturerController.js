import { Manufacturer } from "../model/manufacturerModel.js";

// Create manufacturer
export const createManufacturer = async (req, res) => {
    try {
        const newManufacturer = new Manufacturer(req.body);
        const savedManufacturer = await newManufacturer.save();
        console.log("Manufacturer Added!");
        res.status(201).json({
            status: "Success",
            data: savedManufacturer
        });
    }
    catch(err) {
        res.status(500).json({
            status: "failed",
            error: err.message
        });
    }
};

export const getAllManufacturers = async (req, res) => {
    try {
      const manufacturers = await Manufacturer.find({}, 'full_name');
      console.log("Manufacturers retrieved");
      res.status(200).json(manufacturers);
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  };

export const getManufacturerById = async (req, res) => {
    try {
        const manufacturer = await Manufacturer.findById(req.params.id);
        if(!manufacturer) {
            return res.status(404).json({
                status: "failed", 
                error: 'Manufacturer not found' 
            });
        }
        res.status(200).json({
            status: "success",
            data: manufacturer
        });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            error: err.message
        });
    }
};

export const updateManufacturer = async (req, res) => {
    try {
        const userId = req.params.id;
        const updateData = req.body;

        const updatedManufacturer = Manufacturer.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        );
        if (!updatedManufacturer) {
            return res.status(404).json({
                status: "failed", 
                error: "Manufacturer noot found" 
            });
        }
        res.status(200).json({
            status: "success",
            data: updatedManufacturer
        });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            error: err.message
        });
    }
}

export const deleteManufacturer = async (req, res) => {
    try {
        const deletedManufacturer = await Manufacturer.findByIdAndDelete(req.params.id);
        if (!deletedManufacturer) {
            return res.status(404).json({
                status: "failed", 
                error: "Manufacturer not found" 
            });
        }
        res.status(200).json({
            status: "success",
            data: deletedManufacturer
        });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            error: err.message
        });
    }
}