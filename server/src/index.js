import "dotenv/config";
import app from "./app.js";
import connectDB from "./db/db.js";
import { _env } from "./constant.js";
import http from "http";
import invokeSocket from "./socket.js";

connectDB()
  .then(() => {
    console.log("DB connection succesful\n");

    const port = _env.PORT ?? 3000;

    const server = http.createServer(app);

    invokeSocket(server);

    server.listen(port, () => {
      console.log(`Server started at port : ${port}\nhttp://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("DB connection failed");
  });
