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
  } else {
    return res
      .status(200)
      .send({ user: req.session.user, response: "Authenticated" });
  }
});

router.post("/register", async (req, res, next) => {
  const { username, email, password, confirm_password } = req.body;
  if (email && password && confirm_password && password === confirm_password) {
    if (password.length < 8) {
      return res
        .status(400)
        .send({ response: "Password does not fulfill the requirements" });
    } else {
      bcrypt.hash(password, saltRounds, async (error, hashedPassword) => {
        if (error) {
          return res.status(500).send({});
        }
        try {
          const existingUser = await User.query()
            .select()
            .where({ email: email })
            .limit(1);

          if (existingUser[0]) {
            return res.status(404).send({ response: "User already exists" });
          } else {
            const newUser = await User.query().insert({
              username,
              email,
              password: hashedPassword,
            });

            return res.status(200).send({ email: newUser.email });
          }
        } catch (error) {
          return res
            .status(500)
            .send({ response: "Something went wrong with the database" });
        }
      });
    }
  } else if (password !== repeatPassword) {
    return res
      .status(404)
      .send({ response: "Password and repeat password are not the same" });
  } else {
    return res.status(404).send({ response: "Missing fields" });
  }
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
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send({ response: "Unable to logout" });
    }
    res.json({ message: "Successfuly logged out" });
  });
});



//delete user
router.delete("/", async (req, res) => {
  if (req.session.user) {
    const deleteUser = await User.query().deleteById(req.session.user.id);
    if (deleteUser) {
      req.status(200).send({ response: "deleted user succcess" });
    } else {
      req.status(404).send({ response: "couldnt delele user" });
    }
  } else {
    res.status(403).send({ response: "Not logged in" });
  }
});

// Export to api.js
module.exports = router;
