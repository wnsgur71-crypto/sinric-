const WebSocket = require("ws");

const TABLET_URL = "http://59.24.189.206:9522/wake";

const ws = new WebSocket("wss://ws.sinric.pro", {
  headers: {
    appkey: process.env.APP_KEY,
    authorization: process.env.APP_SECRET
  }
});

// 연결 성공
ws.on("open", () => {
  console.log("Connected to Sinric Pro");
});

// 메시지 수신
ws.on("message", async (data) => {
  try {
    const message = JSON.parse(data.toString());
    console.log("Received:", message);

    // Heartbeat 응답 (연결 유지용)
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

      console.log(`Power State: ${state}`);

      // ON일 때만 태블릿 호출 (WOL 실행)
      if (state === "On") {
        try {
          const result = await fetch(TABLET_URL, {
            method: "POST"
          });

          console.log(`Tablet webhook sent: ${result.status}`);
        } catch (error) {
          console.log("Tablet webhook failed:", error.message);
        }
      }

      // Sinric 응답
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
      console.log("Sinric response sent");
    }

  } catch (error) {
    console.log("Message parse error:", error.message);
  }
});

// 에러 처리
ws.on("error", (err) => {
  console.log("WebSocket error:", err.message);
});

// 연결 종료
ws.on("close", () => {
  console.log("Disconnected from Sinric Pro");
});
