import { Inventory } from "../model/inventoryModel.js";

export const createInventory = async (req, res) => {
    try {
        const newInventory = new Inventory(req.body);
        const savedInventory = await newInventory.save();
        console.log("Inventory Added!");
        res.status(201).json(savedInventory);
    }
    catch(err) {
        res.status(500).json({error: err.message});
    }
};

export const getAllInventories = async (req, res) => {
    try {
        const inventories = await Inventory.find();
        console.log("Inventories retrieved");
        res.status(200).json(inventories);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const getInventoryById = async (req, res) => {
    try {
        const inventory = await Inventory.findById(req.params.id);
        if(!inventory) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(inventory);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const updateInventory = async (req, res) => {
    try {
        const updatedInventory = Inventory.findByIdAndUpdate(req.params.id);
        if (!updatedInventory) {
            return res.status(404).json({ error: "User noot found" });
        }
        res.status(200).json(updatedInventory);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
}

export const deleteInventory = async (res, req) => {
    try {
        const deletedInventory = await Inventory.findByIdAndDelete(res.params.id);
        if (!deletedInventory) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(deletedInventory);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
}