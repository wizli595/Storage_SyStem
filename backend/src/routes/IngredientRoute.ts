import {Router} from "express";
import { IngredientController } from "../controllers/IngredientController";
import validateIngredient from "../validators/IngredientValidator";
import { validateRequest } from "../middlewares/validateMiddlewares";

const router = Router();
const ingredientController = new IngredientController();

router.post(
  "/",
  validateRequest(validateIngredient),
  ingredientController.addIngredient
);
router.get("/plate/:plateId", ingredientController.getIngredientsByPlate);
router.delete("/:id", ingredientController.deleteIngredient);

export default router;
