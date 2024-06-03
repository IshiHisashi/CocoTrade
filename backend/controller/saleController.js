import { Sale } from "../model/saleModel.js";

export const createSale = async (req, res) => {
    try {
        const newSales = new Sale(req.body);
        const savedSales = await newSales.save();
        console.log("Sale Added!");
        res.status(201).json(savedSales);
    }
    catch(err) {
        res.status(500).json({error: err.message});
    }
};

export const getAllSales = async (req, res) => {
    try {
        const sales = await Sale.find();
        console.log("Sales retrieved");
        res.status(200).json(sales);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const getSaleById = async (req, res) => {
    try {
        const sales = await Sale.findById(req.params.id);
        if(!sales) {
            return res.status(404).json({ error: 'Sale not found' });
        }
        res.status(200).json(sales);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const updateSale = async (req, res) => {
    try {
        const updatedSales = Sale.findByIdAndUpdate(req.params.id);
        if (!updatedSales) {
            return res.status(404).json({ error: "Sale not found" });
        }
        res.status(200).json(updatedSales);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
}

export const deleteSale = async (res, req) => {
    try {
        const deletedSales = await Sale.findByIdAndDelete(res.params.id);
        if (!deletedSales) {
            return res.status(404).json({ error: "Sale not found" });
        }
        res.status(200).json(deletedSales);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
}
