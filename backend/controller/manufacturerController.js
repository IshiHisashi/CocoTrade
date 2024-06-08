import { Manufacturer } from "../model/manufacturerModel.js";
import { UserModel as User } from "../model/userModel.js"

// Create manufacturer
export const createManufacturer = async (req, res) => {
    try {
        const newManufacturer = new Manufacturer(req.body);
        const savedManufacturer = await newManufacturer.save();
        console.log("Manufacturer Added!");
        res.status(201).json(savedManufacturer);
    }
    catch(err) {
        res.status(500).json({error: err.message});
    }
};

// Get all the manufacturers based on user
export const getAllManufacturers = async (req, res) => {
    try {
        // GET MANUFACTURERS INFO
        const { userId } = req.params.userId;
        const user = await User.findById(userId)
            .populate('manufacturers_array');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const data = {
            manufacturers: user.manufacturers_array,
        }
        console.log("Manufacturers retrieved");
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
}

export const getManufacturerById = async (req, res) => {
    try {
        const manufacturer = await Manufacturer.findById(req.params.id);
        if(!manufacturer) {
            return res.status(404).json({ error: 'Manufacturer not found' });
        }
        res.status(200).json(manufacturer);
    }
    catch (err) {
        res.status(500).json({error: err.message});
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
            return res.status(404).json({ error: "Manufacturer noot found" });
        }
        res.status(200).json(updatedManufacturer);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
}

export const deleteManufacturer = async (req, res) => {
    try {
        const deletedManufacturer = await Manufacturer.findByIdAndDelete(req.params.id);
        if (!deletedManufacturer) {
            return res.status(404).json({ error: "Manufacturer not found" });
        }
        res.status(200).json(deletedManufacturer);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
}