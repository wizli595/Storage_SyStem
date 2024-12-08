import express, { Request, Response } from "express";
import { errorHandler, errorLogger, notFoundHandler } from "./middlewares";

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world!");
});

// error handlers
app.use(notFoundHandler);
app.use(errorLogger);

app.use(errorHandler);
export default app;
