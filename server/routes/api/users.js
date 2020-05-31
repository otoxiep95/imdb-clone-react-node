const express = require("express");
const bcrypt = require("bcryptjs");
//const nodemailer = require("nodemailer");
const crypto = require("crypto");
const router = express.Router();
const User = require("../../models/User.js");
//const mailerAuth = require("../../config/mail_config");
var saltRounds = bcrypt.genSaltSync(10);

//check if user is logged in
router.get("/isloggedin", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send({ response: "Not logged in" });
  }
  return res
    .status(200)
    .send({ user: req.session.user, response: "Authenticated" });
});

//get logged user information
router.get("/", async (req, res) => {
  if (req.session.user) {
    try {
      const user = await User.query()
        .select("id", "username", "email")
        .findById(req.session.user.id);
      return res.json(user);
    } catch (error) {
      return res
        .status(500)
        .send({ response: "something went wrong in the database" });
    }
  } else {
    return res.status(404).send({ response: "Not logged in" });
  }
});

router.post("/register", async (req, res, next) => {
  const { username, email, password, confirm_password } = req.body;

  if (!username || !email || !password || !confirm_password) {
    return res.status(400).send({ response: "missing fields" });
  }

  if (password && password.length < 8) {
    return res
      .status(400)
      .send({ response: "password does not fulfill the requirements" });
  }

  if (password !== confirm_password) {
    return res.status(400).send({ response: "passwords do not match" });
  }

  if (username && email) {
    const userExists = await User.query()
      .where("username", username)
      .orWhere("email", email);

    if (userExists.length) {
      return res
        .status(400)
        .send({ response: "username or email already exists" });
    }
  }

  bcrypt.hash(password, saltRounds, async (error, hashedPassword) => {
    if (error) {
      return res.status(500).send({ response: "error creating user" });
    }

    try {
      const user = await User.query().insert({
        username,
        email,
        password: hashedPassword,
      });
      return res.status(200).send({ user, response: "user created" });
    } catch (err) {
      next(err);
    }
  });
});

//login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    const users = await User.query()
      .select()
      .where({ username: username })
      .limit(1);
    const user = users[0];

    if (!user) {
      return res.status(404).send({ response: "Wrong username or password" });
    }

    bcrypt.compare(password, user.password, (error, isSame) => {
      if (error) {
        return res.status(500).send({});
      }
      if (!isSame) {
        return res.status(404).send({});
      } else {
        req.session.user = { username: user.username, id: user.id };
        return res
          .status(200)
          .send({ username: user.username, session: req.session.user });
      }
    });
  } else {
    return res.status(404).send({ response: "Missing username or password" });
  }
});

//Logout
router.get("/logout", async (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).send({ response: "unable to log out" });
    } else {
      return res.status(200).send({ response: "successfully logged out" });
    }
  });
  /* req.session.destroy((err) => {
    if (err) {
      return res.status(500).send({ response: "Unable to logout" });
    }
    return res.json({ message: "Successfuly logged out" });
  }); */
});

//delete user
router.delete("/", async (req, res) => {
  if (req.session.user) {
    const deleteUser = await User.query().deleteById(req.session.user.id);
    if (deleteUser) {
      req.session.destroy();
      return res.status(200).send({ response: "deleted user succcess" });
    } else {
      return res.status(404).send({ response: "couldnt delete user" });
    }
  } else {
    return res.status(403).send({ response: "Not logged in" });
  }
});

// Export to api.js
module.exports = router;
