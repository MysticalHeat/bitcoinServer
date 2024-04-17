const WebSocket = require("ws")

const activeSessions = {};

function createSocket(server, sessionParser) {
    const wss = new WebSocket.Server({ server });

    wss.on("connection", function (ws, req) {
        sessionParser(req, {}, function () {
            activeSessions[req.sessionID] = req.session;
            req.sessionStore.set(req.sessionID, req.session, error => { });
        });

        ws.on("message", function (data) {
            let { userId } = JSON.parse(data);
            if (userId) {
                req.session.userId = userId;
            }
        });

        ws.on("close", function (code, reason) {
            delete activeSessions[req.sessionID];
            req.sessionStore.destroy(req.sessionID, error => { });
        });
    });
}

module.exports = { createSocket, activeSessions };