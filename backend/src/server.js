import express from "express";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import {connectDB} from "./lib/db.js";

dotenv.config();
const port = process.env.PORT || 3000;
const __dirname = path.resolve();

const app = express();
app.use(express.json()); // use middleware to parse JSON request bodies

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (_ , res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
    });
}

app.listen(port, () => {
  console.log('Server is running on port : ' + port);
  connectDB();
});