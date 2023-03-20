const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const requiresAuth = require("../middleware/permission");
const pool = require("../databse/db");

// @route   POST /api/auth/register
// @desc    Create a new user
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // check for an existing user
    const existingEmail = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );
    if (existingEmail.rows.length !== 0) {
      return res
        .status(400)
        .json({ existing: "There is already a user with this email" });
    }
    // check the proper name
    if (name === "") {
      return res.status(400).json({ name: "name field can not be empty" });
    }

    // check the proper email
    if (email === "" || !emailRegex.test(email)) {
      return res.status(400).json({ email: "not a proper email" });
    }

    // check the proper password
    if (password.length < 6) {
      return res
        .status(400)
        .json({ password: "password has to be at least 6 characters long" });
    }

    // if no errors -> create a new user
    const user = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );

    // Set a token if registered
    const payload = { userId: user.rows[0].id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("access-token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: "onrender.com",
    });

    const userCredentials = {
      id: user.rows[0].id,
      name: user.rows[0].name,
      email: user.rows[0].email,
    };
    res.json(userCredentials);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

// @route   POST /api/auth/login
// @desc    Login
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    //CHECKS
    // if user does not exist
    if (user.rows.length === 0) {
      return res
        .status(400)
        .json({ error: "Something is wrong with your credentials" });
    }
    // is password is invalid
    const isValid = await bcrypt.compareSync(password, user.rows[0].password);
    if (!isValid) {
      return res
        .status(400)
        .json({ error: "Something is wrong with your credentials" });
    }

    //IF NO ERRORS
    const payload = { userId: user.rows[0].id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("access-token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: "onrender.com",
    });

    // return everything except the password
    const userCredentials = {
      id: user.rows[0].id,
      name: user.rows[0].name,
      email: user.rows[0].email,
    };
    res.json({ user: userCredentials, token: token });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// @route   POST /api/auth/current
// @desc    Return the currently authed user
// @access  Private
router.get("/current", requiresAuth, (req, res) => {
  if (!req.user) {
    return res.status(401).send("Unathorized");
  }
  return res.json(req.user);
});

// @route   PUT /api/auth/logout
// @desc    Logout user and clear cookie
// @access  Private
router.get("/logout", requiresAuth, async (req, res) => {
  try {
    res.clearCookie("access-token");
    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});

module.exports = router;
