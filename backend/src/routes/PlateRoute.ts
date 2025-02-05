import { Router } from "express";
import PlateController from "../controllers/PlateController";
import { validateRequest } from "../middlewares/validateMiddlewares";

import PlateSchema from "../validators/PlateValidator";
const router = Router();
const plateController = new PlateController();

router.post("/", validateRequest(PlateSchema), plateController.createPlate);
router.get("/", plateController.getPlates);
router.get("/:id", plateController.getPlateById);
router.put("/:id", validateRequest(PlateSchema), plateController.updatePlate);
router.delete("/:id", plateController.deletePlate);
export default router;
