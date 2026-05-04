import { Router } from "express";
import * as requestController from "../controllers/request.controller.js";

const router = Router();

router.post("/create", requestController.createRequest);
router.post("/accept/:id", requestController.acceptRequest);
router.post("/reject/:id", requestController.rejectRequest);
router.post("/finalize/:id", requestController.finalizeRequest);

router.get("/book/:bookId", requestController.getRequestsByBook);
router.get("/user/:userId", requestController.getRequestsByUser);
router.get("/requests", requestController.getAllRequests);

export default router;