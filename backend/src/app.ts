import express, { Request, Response } from "express";

import morgan from "morgan";
import { errorHandler, errorLogger, notFoundHandler } from "./middlewares";
import { accessLogStream } from "./utils/accessLogStream";

const app = express();

app.use(express.json());

// logging
app.use(morgan("dev"));
app.use(morgan("common", { stream: accessLogStream(__dirname) }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world!");
});

// error handlers
app.use(notFoundHandler);
app.use(errorLogger);

app.use(errorHandler);
export default app;
