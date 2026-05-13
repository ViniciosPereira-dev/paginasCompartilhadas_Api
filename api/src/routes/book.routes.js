import { Router } from "express";
import * as bookController from "../controllers/book.controller.js";
import { validateApiKey } from "../middlewares/apiKey.middleware.js";

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
 *     summary: Cria um novo livro
 *     tags: [Books]
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
 *               - userId
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
 *                 format: date
 *                 example: 1937-09-21
 *               description:
 *                 type: string
 *                 example: Um clássico da fantasia
 *               userId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Livro criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post("/", bookController.createBook);

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Lista todos os livros
 *     tags: [Books]
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: Lista de livros retornada com sucesso
 *       401:
 *         description: API Key não fornecida
 *       403:
 *         description: API Key inválida
 */
router.get("/", validateApiKey, bookController.getAllBooks);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Busca um livro pelo ID
 *     tags: [Books]
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Livro encontrado
 *       401:
 *         description: API Key não fornecida
 *       403:
 *         description: API Key inválida
 *       404:
 *         description: Livro não encontrado
 */
router.get("/:id", validateApiKey, bookController.getBookById);

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Atualiza um livro
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: O Senhor dos Anéis
 *               author:
 *                 type: string
 *                 example: J.R.R. Tolkien
 *               genre:
 *                 type: string
 *                 example: Fantasia
 *               isbn:
 *                 type: string
 *                 example: 9788595084759
 *               publicationDate:
 *                 type: string
 *                 format: date
 *                 example: 1954-07-29
 *               description:
 *                 type: string
 *                 example: Continuação do universo Tolkien
 *               status:
 *                 type: string
 *                 example: AVAILABLE
 *     responses:
 *       200:
 *         description: Livro atualizado com sucesso
 *       404:
 *         description: Livro não encontrado
 */
router.put("/:id", bookController.updateBook);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Remove um livro
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Livro removido com sucesso
 *       404:
 *         description: Livro não encontrado
 */
router.delete("/:id", bookController.deleteBook);

export default router;