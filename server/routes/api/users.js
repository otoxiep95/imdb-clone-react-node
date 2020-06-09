const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const User = require("../../models/User.js");
const mailerAuth = require("../../config/mailer_config");
var saltRounds = bcrypt.genSaltSync(10);

//check if user is logged in
router.get("/isloggedin", async (req, res) => {
  if (!req.session.user) {
    return res.status(403).send({ response: "Not logged in" });
  }
  return res
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

// register user
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

// log in
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
        return res.status(404).send({ response: "Wrong username or password" });
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

// log out
router.get("/logout", async (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).send({ response: "unable to log out" });
    } else {
      return res.status(200).send({ response: "successfully logged out" });
    }
  });
});

// delete user
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

// forgot password request
router.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;
  const user = await User.query().findOne({ email: email });

  if(!email) {
    res.status(400).send({ response: 'Missing fields' });
  }

  if(!user) {
    res.status(404).send({ response: 'The email does not exist in the database' });
  } else {
    let recovery_link = crypto.randomBytes(16).toString("hex");
    await User.query().patch({
      recovery_link,
      recovery_link_status: true
    }).findById(user.id);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: mailerAuth.user,
        pass: mailerAuth.password
      }
    });

    const mailOptions = {
      from: mailerAuth.user,
      to: email,
      subject: "Password reset",
      html: `<a href="http://localhost:3000/passwordreset/${user.id}/${recovery_link}">Click here to change your password.</a>`
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if(error) {
        res.status(502).send({
          response: "Email not sent",
          error: error.message
        })
      } else {
        return res.status(200).send({ response: "email sent" });
      }
    })
  }
})

// reset password
router.post("/passwordreset", async (req, res) => {
  const { id, recoveryLink, newPassword, confirmNewPassword } = req.body;

  if (id && recoveryLink) {
    const user = await User.query().findById(id);
    if(!user) {
      return res.status(404).send({ response: "user does not exist" });
    }

    if (newPassword && newPassword.length < 8) {
      return res
        .status(400)
        .send({ response: "password does not fulfill the requirements" });
    }

    if(newPassword && confirmNewPassword) {
      if (newPassword !== confirmNewPassword) {
        return res.status(400).send({ response: "passwords do not match" });
      }
    } else {
      return res.status(400).send({ response: "missing fields" });
    }
    if(recoveryLink !== user.recovery_link || user.recovery_link_status == 0) {
      return res.status(400).send({ response: "Recovery token not valid" });
    }

    bcrypt.hash(newPassword, saltRounds, async(error, hashedPassword) => {
      if (error) {
        return res.status(500).send({ response: "Password could not be updated" });
      }

      try {
        await user.$query().patch({
          password: hashedPassword,
          recovery_link_status: false
        })

        return res.send({ response: "Password successfully changed" });
      } catch(error) {
        return res.status(500).send({ response: "Something went wrong in the database" });
      }

    })
  
  } else {
    return res.status(404).send({ response: "id or recovery link missing" });
  } 
})


module.exports = router;
