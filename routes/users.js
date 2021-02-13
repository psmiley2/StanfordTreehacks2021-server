const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const passport = require("passport");
const { ObjectID } = require("mongodb");
const saltRounds = 12;

// Load User model
const User = require("../models/User");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

router.get("/sudarshan", (req, res) => {
    res.status(200).send("hi sudarshan!!")
})

// Fetch an existing user
router.get("/find/:userid", async (req, res) => {
    let user;
    let userid = req.params.userid;
    let errors = [];

    if (userid == undefined || userid.length != 24) {
        errors.push("a valid userid must be set as a url parameter");
        return;
    }

    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }

    await User.findById(userid)
        .then((res) => {
            if (res) {
                // User was found
                user = res;
            } else {
                errors.push("no user found for the given id");
            }
        })
        .catch((err) => {
            console.error(err);
        });
    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }

    res.status(200).send(user);
});

router.post("/register", async (req, res) => {
    const { email, password } = req.body;
    let errors = [];

    if (!email || !password) {
        errors.push("Please enter all fields");
    }

    if (password.length < 6) {
        errors.push("Password must be at least 6 characters");
    }

    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }

    // Makes sure this email does not already exist in the database
    await User.findOne({ "userInfo.email": email })
        .then((user) => {
            if (user) {
                errors.push({ msg: "Email already exists" });
            }
        })
        .catch((err) => {
            console.error(err);
        });

    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }

    let hashedPassword = "";
    let newUser;
    let salt;

    // Generates salt for hasing
    await bcrypt
        .genSalt(saltRounds)
        .then((s) => {
            salt = s;
        })
        .catch((err) => console.error(err));

    // Uses the salt to hash the password
    await bcrypt
        .hash(password, salt)
        .then((hash) => {
            hashedPassword = hash;
        })
        .catch((err) => console.error(err));

    // Populates user schema
    newUser = new User({
        _id: new ObjectID(),
        userInfo: {
            email,
            password: hashedPassword,
        },
        habits: [],
        tasks: [],
        allowSchedulingInterval: {
            startTime: "2020-11-25T13:00:05.141Z", 
            endTime: "2020-11-25T23:00:05.157Z"
        },
    });

    // Puts user in database
    await newUser
        .save()
        .then((user) => {
            newUser = user;
        })
        .catch((err) => {
            console.error(err);
        });

    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }

    // Logs in user
    passport.authenticate("local", (err, account) => {
        req.logIn(account, function () {
            res.status(err ? 500 : 200).send(err ? err : account);
        });
    });

    // No errors
    res.status(201).send(newUser);
});

router.post("/login", passport.authenticate("local"), async (req, res) => {
    let userid = req.session.passport.user;
    let errors = [];
    let user;

    if (userid == undefined || userid.length != 24) {
        errors.push("the session is storing an invalid userid");
    }

    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }

    await User.findById(userid)
        .then((u) => {
            user = u;
        })
        .catch((err) => console.error(err));
    res.status(200).send(user);

});

router.post("/logout", async (req, res) => {
    req.logout();
    req.session.destroy();
    res.status(201).end();
    // TODO - Make some tests
});

// Get the passport session info
router.get("/session", ensureAuthenticated, async (req, res) => {
    res.status(200).send(req.session.passport.user);
    // TODO - Make some tests
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
    // console.log("cookies", req.cookies);
    res.send("hello");
});

router.delete("/:userid", async (req, res) => {
    let userid = req.params.userid;
    let errors = [];

    if (userid == undefined || userid.length != 24) {
        errors.push("a valid userid must be set as a url parameter");
    }

    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }

    await User.findByIdAndDelete(userid)
        .then((user) => {
            if (!user) {
                errors.push("could not find a user with the given id");
            }
        })
        .catch((err) => console.error(err));

    if (errors.length > 0) {
        res.status(400).send(errors);
    } else {
        res.status(200).send();
    }
});

module.exports = router