import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import httpStatus from "http-status";

import router from "./app/routes";
import globalErrorHandler from "./app/middleware/globalErrorhandler";
import notFound from "./app/middleware/notFound";
import AppError from "./app/error/AppError";


const app: Application = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  }),
);

// application routes
app.use("/api/v1", router);

app.get("/", (_req, res) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: "Welcome to the E-commerce API",
    timestamp: new Date().toString(),
  });
});

app.get("/health", (_req, res) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toString(),
  });
});


// Not-found must run before the error handler so all errors reach one response path.
app.use(notFound);
app.use(globalErrorHandler);

export default app;
