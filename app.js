const express = require("express");
const cookieParser = require("cookie-parser");
require("express-async-errors");
const cors = require("cors");
const app = express();
const port = 3000;

var http = require("http").createServer(app);
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  console.log("소켓이 연결되었습니다.");

  socket.on("user join", (name, room) => {
    (socket.name = name), (socket.room = room), socket.join(room);

    io.to(socket.room).emit("update", {
      type: "connect",
      name: "administrator",
      message: `${userId}님이 채팅창에 접속하셨습니다.`,
    });
  });

  socket.on("chat message", (data) => {
    (data.name = socket.name),
      (data.room = socket.room),
      socket.broadcast.to(socket.room).emit("chat message", data);
  });
});

app.use(cors());

const router = require("./routes");
const errorHandler = require("./middlewares/error-handler");

app.use(express.json());
app.use(cookieParser());
app.use("/api", router);
app.use(errorHandler);

http.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
