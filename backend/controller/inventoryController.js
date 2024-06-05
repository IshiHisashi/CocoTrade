import { Inventory } from "../model/inventoryModel.js";
import { User } from "../model/userModels.js";

const userId = "665bb23ef58fac2ad8cb75f8";

export const getAllInventories = async (req, res) => {
    const endDate = new Date();
    let startDate = new Date(endDate);
    startDate.setMonth(endDate.getMonth() - 3);
    console.log(endDate);
    console.log(startDate);

    if (!startDate || !endDate) {
        return res.status(400).json({ error: "Pls provide a valid date" });
    }

    try {
        const inventories = await Inventory.find({
            time_stamp: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            },
            user_id: userId
        });
        console.log("Inventories retrieved");
        const user = await User.findById(userId);
        console.log("User retreived");

        const data = {
            inventories: inventories,
            user: user
        }

        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const getAllInventoriesByDuration = async (req, res) => {
    const { startDate, endDate} = req.query;
    console.log(startDate);
    console.log(endDate);

    if (!startDate || !endDate) {
        return res.status(400).json({ error: "Pls provide a valid date" });
    }

    try {
        const selectedInventories = await Inventory.find({
            time_stamp: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            },
            user_id: userId
        });
        console.log("Inventories retrieved");
        res.status(200).json(selectedInventories);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const createShipment = async (req, res) => {
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