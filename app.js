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

  // heartbeat 패킷 무시
  if (message.timestamp) {
  ws.send(JSON.stringify({
    timestamp: message.timestamp
  }));
  console.log("Heartbeat sent");
  return;
}

  // 전원 명령 처리
  if (message.payload?.action === "setPowerState") {
    const state = message.payload.value.state;

    console.log("Switch:", state);

    const response = {
      header: {
        payloadVersion: 2
      },
      payload: {
        clientId: message.payload.clientId,
        createdAt: Date.now(),
        deviceId: message.payload.deviceId,
        replyToken: message.payload.replyToken,
        type: "response",
        success: true,
        value: {
          state: state
        }
      }
    };

    ws.send(JSON.stringify(response));
    console.log("Response sent");
  }
});

ws.on("error", (err) => {
  console.log("Error:", err);
});

ws.on("close", () => {
  console.log("Disconnected");
});
