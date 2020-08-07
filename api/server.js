const express = require("express");
const authRouter = require("../auth/auth-router");
const session = require("express-session");

const server = express();

const sessionConfig = {
    name: "dinosaur",
    secret: "I won't tell if you dont...",
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false,
        httpOnly: true
    },
    resave: false,
    saveUninitialized: false
}

server.use(express.json());
server.use(session(sessionConfig));

server.use("/api", authRouter)

server.get("/", (req, res) => {
    res.json({ api: "up" });
});

module.exports = server;
