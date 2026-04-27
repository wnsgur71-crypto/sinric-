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

  // heartbeat 무시
  if (!message.payload) return;

  if (message.payload.action === "setPowerState") {
    console.log("Switch:", message.payload.value.state);

    const response = {
      header: {
        payloadVersion: 2
      },
      payload: {
        deviceId: message.payload.deviceId,
        replyToken: message.payload.replyToken,
        type: "response",
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
