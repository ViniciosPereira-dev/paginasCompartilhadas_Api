import { Router } from "express";
import * as requestController from "../controllers/request.controller.js";
import { validateApiKey } from "../middlewares/apiKey.middleware.js";

const router = Router();

router.post("/", validateApiKey, requestController.createRequest);
router.post("/accept/:id", validateApiKey, requestController.acceptRequest);
router.post("/reject/:id", validateApiKey, requestController.rejectRequest);
router.post("/finalize/:id", validateApiKey, requestController.finalizeRequest);

router.get("/book/:bookId", validateApiKey, requestController.getRequestsByBook);
router.get("/user/:userId", validateApiKey, requestController.getRequestsByUser);
router.get("/", validateApiKey, requestController.getAllRequests);

export default router;