import { Testmodel } from "../model/testModel.js";

// Define fnc to read the data
// Create
export const createTest = async (req, res) => {
  try {
    const newTest = await Testmodel.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tour: newTest,
      },
    });
  } catch (err) {
    // in case anything conflicting with schema is detected
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// Read_1 (all docs)
export const readTests = async (req, res) => {
  try {
    console.log("successful reading");
    // Read the docs
    const docs = await Testmodel.find({});
    res.status(201).json({
      status: "success",
      data: {
        docs,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: "failed",
    });
  }
};
// Read_2 (one doc)
export const readTest = async (req, res) => {
  try {
    const doc = await Testmodel.findById(req.params.id);
    res.status(201).json({
      status: "success",
      data: {
        doc,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// Update and Delete needs parameter (ID)
// Update
export const updateTest = async (req, res) => {
  try {
    const result = await Testmodel.findByIdAndUpdate(req.params.id, req.body);
    if (!result) {
      return res.status(404).json({ message: "test not found" });
    }
    return res.status(201).json({
      status: "success in updating",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
// Delete
export const deleteTest = async (req, res) => {
  try {
    const result = await Testmodel.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Test not found" });
    }
    return res.status(201).json({
      status: "success in deleting",
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
