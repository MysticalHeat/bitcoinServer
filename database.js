const pgp = require("pg-promise")();

const user = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE
}

const table = {
    currency: "public.currency",
    users: "public.users"
};

const cn = `postgres://${user.username}:${user.password}@${user.host}:${user.port}/${user.database}`;
const db = pgp(cn);

async function updateCurrency(count) {
    await db.none(`INSERT INTO ${table.currency} VALUES (1, 'BITCOIN', ${count}) ON CONFLICT (id) DO UPDATE SET usd = EXCLUDED.usd`);
}

async function getCurrency() {
    return await db.one(`SELECT usd FROM ${table.currency} WHERE crypto='BITCOIN'`);
}

async function getUsers() {
    return await db.many(`SELECT * FROM ${table.users}`);
}

module.exports = { updateCurrency, getCurrency, getUsers }