import { Router } from "express";
import * as bookController from "../controllers/book.controller.js";
import { validateApiKey } from "../middlewares/apiKey.middleware.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Gerenciamento de livros
 */

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Cria um novo livro (Vincula ao usuário logado)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: [] # <-- ATIVA O CADEADO JWT NESTA ROTA
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - genre
 *               - isbn
 *               - publicationDate
 *             properties:
 *               title:
 *                 type: string
 *                 example: O Hobbit
 *               author:
 *                 type: string
 *                 example: J.R.R. Tolkien
 *               genre:
 *                 type: string
 *                 example: Fantasia
 *               isbn:
 *                 type: string
 *                 example: 9788595084742
 *               publicationDate:
 *                 type: string
 *                 example: 21/09/1937
 *               description:
 *                 type: string
 *                 example: Um clássico da fantasia
 *     responses:
 *       201:
 *         description: Livro criado com sucesso
 */
router.post("/", verificarToken, bookController.createBook);

// ... Mantenha as rotas GET /books e GET /books/:id originais com validateApiKey iguais você já tem

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Atualiza um livro (Apenas o proprietário)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: [] # <-- ATIVA O CADEADO JWT NESTA ROTA
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Livro atualizado com sucesso
 */
router.put("/:id", verificarToken, bookController.updateBook);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Remove um livro (Apenas o proprietário)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: [] # <-- ATIVA O CADEADO JWT NESTA ROTA
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Livro removido com sucesso
 */
router.delete("/:id", verificarToken, bookController.deleteBook);

export default router;
