import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import {connectDB} from "./lib/db.js";
import {ENV} from "./lib/env.js";


const port = ENV.PORT || 3000;
const __dirname = path.resolve();

const app = express();
app.use(express.json()); // use middleware to parse JSON request bodies
app.use(cookieParser()); // use middleware to parse cookies

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (_ , res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
    });
}

app.listen(port, () => {
  console.log('Server is running on port : ' + port);
  connectDB();
});