const WebSocket = require("ws");

const ws = new WebSocket("wss://ws.sinric.pro", {
  headers: {
    appkey: process.env.APP_KEY,
    authorization: process.env.APP_SECRET
  }
});

ws.on("open", () => {
  console.log("Connected!");
});

ws.on("message", (data) => {
  const message = JSON.parse(data.toString());
  console.log("Received:", message);

  // Sinric 명령 응답
  if (message.action === "setPowerState") {
    const response = {
      requestId: message.requestId,
      payload: {
        success: true
      }
    };

    ws.send(JSON.stringify(response));
    console.log("Response sent");
  }
});

ws.on("close", () => {
  console.log("Disconnected");
});
