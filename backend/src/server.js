import express from "express";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();
const port = process.env.PORT || 3000;
const __dirname = path.resolve();

const app = express();

if(process.env.node_env === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/build")));
}

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(port, () => {
  console.log('Server is running on port : ' + port);
});