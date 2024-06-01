import { User } from "../model/schemaModels.js";

export const createUser = async (req, res) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        console.log("user Added!");
        res.status(201).json(savedUser);
    }
    catch(err) {
        res.status(500).json({error: err.message});
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        console.log("User retrieved");
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const updateUser = async (req, res) => {
    try {
        const updatedUser = User.findByIdAndUpdate(req.params.id);
        if (!updatedUser) {
            return res.status(404).json({ error: "User noot found" });
        }
        res.status(200).json(updatedUser);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
}

export const deleteUser = async (res, req) => {
    try {
        const deletedUser = await User.findByIdAndDelete(res.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(deletedUser);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
}