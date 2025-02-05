import express, { Request, Response } from "express";
import router from "./routes/testRoute";
import itemRouter from "./routes/ItemRoute";
import stockLogRouter from "./routes/StockLogRoute";
import stockRequestRouter from "./routes/StockRequestRoute";
import PlateRouter from "./routes/PlateRoute";
import ingredientRouter from "./routes/IngredientRoute";
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

// routes
app.use("/test", router);

app.use("/stock-log", stockLogRouter);
app.use("/items", itemRouter);
app.use("/stock-request", stockRequestRouter);
app.use("/plates", PlateRouter);
app.use("/ingredients", ingredientRouter);
// error handlers
app.use(notFoundHandler);
app.use(errorLogger);

app.use(errorHandler);
export default app;
