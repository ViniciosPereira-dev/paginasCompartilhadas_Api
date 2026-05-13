import { Router } from "express";
import * as requestController from "../controllers/request.controller.js";
import { validateApiKey } from "../middlewares/apiKey.middleware.js";

const router = Router();

router.post("/", requestController.createRequest);
router.post("/accept/:id", requestController.acceptRequest);
router.post("/reject/:id",  requestController.rejectRequest);
router.post("/finalize/:id",  requestController.finalizeRequest);

router.get("/book/:bookId",  requestController.getRequestsByBook);
router.get("/user/:userId",  requestController.getRequestsByUser);
router.get("/",  requestController.getAllRequests);

export default router;