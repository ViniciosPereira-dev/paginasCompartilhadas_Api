import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { validateApiKey } from "../middlewares/apiKey.middleware.js";

const router = Router();

router.post("/",  userController.createUser);
router.get("/", userController.findAllUsers);
router.get("/:id",  userController.findUserById);
router.put("/:id",  userController.updateUser);
router.delete("/:id",  userController.deleteUser);

export default router;
