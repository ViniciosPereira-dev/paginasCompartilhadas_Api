import { Router } from "express";
import * as userController from "../controllers/user.controller.js";

const router = Router();

router.post("/create", userController.createUser);

/*
router.get("/users", userController.findAllUsers);
router.get("/user/:id", userController.findUserById);
router.put("/update/:id", userController.updateUser);
router.delete("/delete/:id", userController.deleteUser);
*/

export default router;
