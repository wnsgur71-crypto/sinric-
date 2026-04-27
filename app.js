const WebSocket = require("ws");

const ws = new WebSocket("wss://ws.sinric.pro", {
  headers: {
    appkey: "YOUR_APP_KEY",
    authorization: "YOUR_APP_SECRET"
  }
});

ws.on("open", () => {
  console.log("Connected!");
});

ws.on("message", (data) => {
  console.log(data.toString());
});

ws.on("close", () => {
  console.log("Disconnected");
});
