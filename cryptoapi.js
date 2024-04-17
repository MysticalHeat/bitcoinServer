const axios = require("axios");
const db = require("./database");
const { activeSessions } = require("./websocket");
const { sendMail } = require("./mailservice");

const apiKey = process.env.APIKEY;
const url = `https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD&api_key=${apiKey}`;

async function filterInactiveUsers() {
    const userlist = await db.getUsers();

    return userlist.filter(user => {
        const userSession = Object.values(activeSessions).filter(session => session.userId == user.userid)[0];

        if (userSession) {
            return false;
        } else {
            return true;
        }
    });
}

const requestbtc = () => {
    axios.get(url)
        .then(async ({ data }) => {
            const inactiveUsers = await filterInactiveUsers();

            if (inactiveUsers.length !== 0 && Math.abs((await db.getCurrency()).usd - data["USD"]) >= 100) {
                sendMail(data["USD"], inactiveUsers.map(user => user.email));
            }

            await db.updateCurrency(data["USD"]);
        })
        .catch(error => {
            console.log(error);
        });
}

requestbtc();
const currencyUpdate = setInterval(requestbtc, 60 * 1000);

