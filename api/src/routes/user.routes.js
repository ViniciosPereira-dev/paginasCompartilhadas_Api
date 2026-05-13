import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { validateApiKey } from "../middlewares/apiKey.middleware.js";

const router = Router();

router.post("/", validateApiKey, userController.createUser);
router.get("/", validateApiKey, userController.findAllUsers);
router.get("/:id", validateApiKey, userController.findUserById);
router.put("/:id", validateApiKey, userController.updateUser);
router.delete("/:id", validateApiKey, userController.deleteUser);

export default router;
