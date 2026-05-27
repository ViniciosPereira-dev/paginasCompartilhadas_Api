import { Router } from "express";
import * as requestController from "../controllers/request.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Requests
 *   description: Gerenciamento e fluxo de solicitações de doação de livros
 */

// Aplica o middleware verificarToken em todas as rotas abaixo
router.use(verificarToken);

/**
 * @swagger
 * /requests:
 *   post:
 *     summary: Cria uma nova solicitação de doação para um livro
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *             properties:
 *               bookId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Solicitação criada com sucesso
 *       400:
 *         description: Dados inválidos, livro indisponível ou tentativa de solicitar o próprio livro
 *       401:
 *         description: Não autenticado
 */
router.post("/", requestController.createRequest);

/**
 * @swagger
 * /requests/accept/{id}:
 *   post:
 *     summary: Aceita uma solicitação recebida (Apenas o dono do livro)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Solicitação aceita com sucesso e concorrentes rejeitadas
 *       403:
 *         description: Acesso negado (Você não é o dono do livro)
 *       44:
 *         description: Solicitação não encontrada
 */
router.post("/accept/:id", requestController.acceptRequest);

/**
 * @swagger
 * /requests/reject/{id}:
 *   post:
 *     summary: Rejeita uma solicitação recebida (Apenas o dono do livro)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
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
 *       403:
 *         description: Acesso negado
 */
router.post("/reject/:id", requestController.rejectRequest);

/**
 * @swagger
 * /requests/finalize/{id}:
 *   post:
 *     summary: Finaliza o processo de doação de um livro (Apenas o dono do livro)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Doação finalizada com sucesso e status do livro atualizado para doado
 *       403:
 *         description: Acesso negado
 */
router.post("/finalize/:id", requestController.finalizeRequest);

/**
 * @swagger
 * /requests/book/{bookId}:
 *   get:
 *     summary: Lista todas as solicitações de interessados em um livro específico (Apenas o dono do livro)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de requisições retornada com sucesso
 *       403:
 *         description: Acesso negado
 */
router.get("/book/:bookId", requestController.getRequestsByBook);

/**
 * @swagger
 * /requests/user:
 *   get:
 *     summary: Lista todas as solicitações enviadas pelo usuário logado atualmente
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Suas solicitações foram recuperadas com sucesso
 *       401:
 *         description: Não autenticado
 */
router.get("/user", requestController.getRequestsByUser);

/**
 * @swagger
 * /requests:
 *   get:
 *     summary: Lista todas as solicitações registradas no sistema global
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Histórico global retornado com sucesso
 */
router.get("/", requestController.getAllRequests);

export default router;
