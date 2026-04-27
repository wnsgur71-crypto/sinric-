const WebSocket = require("ws");

const ws = new WebSocket("wss://ws.sinric.pro", {
  headers: {
    appkey: process.env.APP_KEY,
    authorization: process.env.APP_SECRET
  }
});

ws.on("open", () => {
  console.log("Sinric connected");
});

ws.on("message", (data) => {
  const msg = JSON.parse(data);
  console.log("Received:", msg);

  // 명령 받으면 성공 응답
  if (msg.deviceId === process.env.DEVICE_ID) {
    ws.send(JSON.stringify({
      deviceId: process.env.DEVICE_ID,
      success: true
    }));
  }
});

ws.on("close", () => {
  console.log("Disconnected");
});
