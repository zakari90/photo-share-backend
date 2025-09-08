import cors from "cors";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";

import * as middlewares from "./middlewares.js";

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

try {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
}
catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
