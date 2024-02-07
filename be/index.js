import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import routes from "./route.js";
import bodyParser from "body-parser";
import http from "http";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("database connection successfully.");
  })
  .catch((error) => {
    console.log("Error found on database connecrtion.", error);
  });

app.use(cors("*"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use("/", routes);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
