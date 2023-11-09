const express = require("express");
const router = express.Router();
const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "iamawebdeveloper";
const fetchuser = require("../middleware/fetchuser");

//middleware function to handle the registraion

//Route 1

router.post("/createuser", async (req, res) => {
  let success = false;
  //if there are errors, return Bad request and the errors
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({
        success,
        error: "Sorry a user with this email alredy exists",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    });
    const data = {
      user: {
        id: user.id,
      },
    };
    const authToken = jwt.sign(data, JWT_SECRET);

    success = true;
    res.json({ success, authToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(`Some error occured`);
  }
});

//authenticate user using post
// Route 2

router.post("/login", async (req, res) => {
  let success = false;

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      success = false;
      return res
        .status(400)
        .json({ error: "Please try to login using valid credentials" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      success = false;
      return res
        .status(400)
        .json({ error: "Please try to login using valid credentials" });
    }

    const data = {
      user: {
        id: user.id,
      },
    };

    const authToken = jwt.sign(data, JWT_SECRET);
    success = true;
    if (success) {
      console.log("User logged in successfully");
    }
    res.status(200).json({ success, authToken });
  } catch (err) {
    console.log(err.message);
    res.statuds(500).send("Internal server error");
  }
});

// Route 4: Fetch user's name
router.get("/getUserName", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("name"); // Assuming the field for the user's name is 'name'

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ name: user.name });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
