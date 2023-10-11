const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT;
const MONGO_URL_LOCAL = process.env.MONGO_URL_LOCAL;
const MONGO_URL_CLOUD = process.env.MONGO_URL_CLOUD;

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());
app.use(
  cors({
    origin: "*",
    credentials: true
  })
);

// Connect to MongoDB
mongoose.connect(MONGO_URL_LOCAL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// To check the database is connected to the backend
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

// Create a Schema for the collection
const crudSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: Number,
  phoneNumber: Number
});

// Create the Model
const CrudModel = mongoose.model("Crud-Operation", crudSchema);

app.get("/get-all-data", async (req, res) => {
  const data = await CrudModel.find();
  res.send(data);
});

app.get("/get-single-data/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const find_one = await CrudModel.findById(id);
    res.send(find_one);
  } catch (err) {
    res.send(err);
  }
});

app.post("/post", async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
  console.log(name, email, password, phoneNumber);

  //   return;

  const post_data = new CrudModel({
    name,
    email,
    password,
    phoneNumber
  });

  await post_data.save();

  res.json({ message: "Data Posted Successfully", userData: post_data });
});

app.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const { name, email, password, phoneNumber } = req.body;
  console.log(req.body);
  try {
    const update_data = await CrudModel.findByIdAndUpdate(id, {
      name,
      email,
      password,
      phoneNumber
    });
    res.json({ message: "Data Updated Successfully", userData: update_data });
  } catch (error) {
    res.send(err);
  }
});

// Delete data
app.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id);
    try {
      const deleted_data = await CrudModel.findByIdAndRemove(id);
      res.json({ message: "Data Deleted Successfully", userData: deleted_data });
    } catch (err) {
      res.send(err);
    }
  });

app.listen(PORT, () => {
  console.log("Server Listening on the port 5000");
});


// https://crimson-astronaut-377326.postman.co/workspace/New-Team-Workspace~bf96ea48-57bf-4a0d-a813-17a4185ce90c/collection/29986009-fedf2548-30f8-4722-8c03-13bee697fbc3?action=share&creator=29986009