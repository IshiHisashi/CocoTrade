import { Inventory } from "../model/inventoryModel.js";

// Create inventory
export const createInventory = async (req, res) => {
    try {
        const newInventory = new Inventory(req.body);
        const savedInventory = await newInventory.save();
        console.log("Inventory Added!");
        res.status(201).json({ 
            status: "success",
            data: savedInventory
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

        if(!inventory) {
            return res.status(404).json({ 
                status: "failed",
                error: 'Inventory not found' 
            });
        }
        res.status(200).json({
            status: "Success",
            data: inventory });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            error: err.message
        });
    }
};

export const updateInventory = async (req, res) => {
    try {
        const invId = req.params.id;
        const updateData = req.body;

        const updatedInventory = await Inventory.findByIdAndUpdate(
            invId,
            updateData,
        );
        if (!updatedInventory) {
            return res.status(404).json({ 
                status: "failed",
                error: "User not found" 
            });
        }
        res.status(200).json({
            status: "Success",
            data: updatedInventory });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            error: err.message
        });
    }
}

export const deleteInventorById = async (req, res) => {
    try {
        const deletedInventory = await Inventory.findByIdAndDelete(req.params.id);
        if (!deletedInventory) {
            return res.status(404).json({ 
                status: "failed",
                error: "User not found" 
            });
        }
        res.status(200).json({
            status: "Success",
            data: deletedInventory });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            error: err.message
        });
    }
}

