import { Inventory } from "../model/inventoryModel.js";
import { UserModel as User } from "../model/userModel.js";

// skip create inventory as it's the same as create sales.
// Get all the inventory data based on userId

export const getAllInventories = async (req, res) => {
    // To test this use ?userId=66622c07858df5960bf57a06 as query in url

    try {
        // GET INVENTORY INFO
        const { userId } = req.query;
        const user = await User.findById(userId)
            .populate('inventory_amount_array');
            // .populate('sales_array');
            // WHY NOT WORKING???

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const data = {
            max_amount: user.max_inventory_amount,
            inventory: user.inventory_amount_array,
            sales: user.sales_array
        }
        console.log("Inventories retrieved");
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json({error: err.message});
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
            return res.status(404).json({ error: 'Inventory not found' });
        }
        res.status(200).json(inventory);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const updateInventory = async (req, res) => {
    try {
        const userId = req.params.id;
        const updateData = req.body;

        const updatedInventory = Inventory.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        );
        if (!updatedInventory) {
            return res.status(404).json({ error: "User noot found" });
        }
        res.status(200).json(updatedInventory);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
}

export const deleteInventorById = async (req, res) => {
    try {
        const deletedInventory = await Inventory.findByIdAndDelete(req.params.id);
        if (!deletedInventory) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(deletedInventory);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
}

//　PLS IGNORE THIS!!! NOT SURE IF WE NEED THIS TYPE OF FUNCTION
// export const getAllInventoriesByDuration = async (req, res) => {
//     const { startDate, endDate} = req.query;
//     console.log(startDate);
//     console.log(endDate);

//     if (!startDate || !endDate) {
//         return res.status(400).json({ error: "Pls provide a valid date" });
//     }

//     try {
//         const selectedInventories = await Inventory.find({
//             time_stamp: {
//                 $gte: new Date(startDate),
//                 $lte: new Date(endDate)
//             },
//             user_id: userId
//         });
//         console.log("Inventories retrieved");
//         res.status(200).json(selectedInventories);
//     }
//     catch (err) {
//         res.status(500).json({error: err.message});
//     }
// };