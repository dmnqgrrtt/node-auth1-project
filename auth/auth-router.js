const express = require("express");
const bcrypt = require("bcryptjs");

const db = require("../data/db-config");

const router = express.Router();

router.post("/register", (req, res) => {
    let user = req.body;

    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;

    try {
        db("users")
            .insert(user)
            .then(id => {
                db("users")
                    .where({ id })
                    .first()
                    .then(newUser => {
                        res.status(201).json(newUser);
                    })
            })
            .catch(err => {
                res.status(400).json({ message: "We were unable to add that user" })
            })
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post("/login", (req, res) => {
    let { username, password } = req.body;

    db("users")
        .where({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                req.session.user = user;
                res.status(200).json({ message: "Logged in" });
            } else {
                res.status(401).json({ message: "You shall not pass!" })
            }
        })
        .catch(err => {
            res.status(500).json(err)
        });
});

router.get("/users", (req, res) => {
    if (req.session && req.session.user) {
        db("users")
            .then(users => {
                res.status(200).json(users);
            })
    } else {
        res.status(401).json({ message: "You shall not pass!" });
    }
})

module.exports = router;