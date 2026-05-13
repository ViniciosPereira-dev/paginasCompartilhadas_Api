import { Router } from "express";
import * as requestController from "../controllers/request.controller.js";
import { validateApiKey } from "../middlewares/apiKey.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Requests
 *   description: Gerenciamento de solicitações de empréstimo
 */

/**
 * @swagger
 * /requests:
 *   post:
 *     summary: Cria uma nova solicitação de empréstimo
 *     tags: [Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - bookId
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               bookId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Solicitação criada com sucesso
 *       400:
 *         description: Dados inválidos ou solicitação já existente
 */
router.post("/", requestController.createRequest);

/**
 * @swagger
 * /requests/accept/{id}:
 *   post:
 *     summary: Aceita uma solicitação
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Solicitação aceita com sucesso
 *       404:
 *         description: Solicitação não encontrada
 */
router.post("/accept/:id", requestController.acceptRequest);

/**
 * @swagger
 * /requests/reject/{id}:
 *   post:
 *     summary: Rejeita uma solicitação
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Solicitação rejeitada com sucesso
 *       404:
 *         description: Solicitação não encontrada
 */
router.post("/reject/:id", requestController.rejectRequest);

/**
 * @swagger
 * /requests/finalize/{id}:
 *   post:
 *     summary: Finaliza uma solicitação
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Solicitação finalizada com sucesso
 *       404:
 *         description: Solicitação não encontrada
 */
router.post("/finalize/:id", requestController.finalizeRequest);

/**
 * @swagger
 * /requests/book/{bookId}:
 *   get:
 *     summary: Lista solicitações de um livro
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Solicitações encontradas com sucesso
 *       404:
 *         description: Livro não encontrado
 */
router.get("/book/:bookId", requestController.getRequestsByBook);

/**
 * @swagger
 * /requests/user/{userId}:
 *   get:
 *     summary: Lista solicitações de um usuário
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Solicitações encontradas com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.get("/user/:userId", requestController.getRequestsByUser);

/**
 * @swagger
 * /requests:
 *   get:
 *     summary: Lista todas as solicitações
 *     tags: [Requests]
 *     responses:
 *       200:
 *         description: Lista de solicitações retornada com sucesso
 */
router.get("/", requestController.getAllRequests);

export default router;