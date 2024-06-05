import { Manufacturer } from "../model/manufacturerModel.js";

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

export const getAllManufacturers = async (req, res) => {
    try {
        const manufacturers = await Manufacturer.find();
        console.log("Manufacturers retrieved");
        res.status(200).json(manufacturers);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
};

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
        const updatedManufacturer = Manufacturer.findByIdAndUpdate(req.params.id);
        if (!updatedManufacturer) {
            return res.status(404).json({ error: "Manufacturer not found" });
        }
        res.status(200).json(updatedManufacturer);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
}

export const deleteManufacturer = async (res, req) => {
    try {
        const deletedManufacturer = await Manufacturer.findByIdAndDelete(res.params.id);
        if (!deletedManufacturer) {
            return res.status(404).json({ error: "Manufacturer not found" });
        }
        res.status(200).json(deletedManufacturer);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
}