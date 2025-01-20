import { NextFunction, Request, Response, Router } from "express";
import testController from "../controllers/testController";

const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  return testController.getAllTest(req, res, next);
});

export default router;
