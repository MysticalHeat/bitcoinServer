const express = require("express");
const { router } = require("./routes");
require("./cryptoapi");
const expressSession = require("express-session");
const ws = require("./websocket");

const app = express();
const http = require("http").createServer(app);

const PORT = process.env.PORT;

const sessionStore = new expressSession.MemoryStore();
const sessionParser = expressSession({
    store: sessionStore,
    secret: 'asdfkxckzkzkzssada',
    saveUninitialized: true,
    resave: true,

});

app.use(function (req, res, next) {
    req.sessionStore = sessionStore;
    next();
});
app.use(router);
ws.createSocket(http, sessionParser);

http.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});