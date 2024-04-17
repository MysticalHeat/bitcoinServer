const express = require("express");
const router = express.Router();
const bd = require("body-parser");
const { activeSessions } = require("./websocket");
const { getCurrency } = require("./database");

router.use(bd.json());
router.use(bd.urlencoded({ extended: true }));

router.post("/", async function (req, res) {
    let { userId } = req.body;
    let userSession = Object.values(activeSessions).filter(session => session.userId == userId)[0];

    if (userSession) {
        userSession.price = (await getCurrency()).usd;
    }

    res.sendStatus(200);
});

module.exports = { router };