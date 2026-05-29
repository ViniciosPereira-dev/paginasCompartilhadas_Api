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
 *   get:
 *     summary: Lista todos os livros disponíveis
 *     tags: [Books]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Lista de livros retornada com sucesso
 */
router.get("/",  bookController.getAllBooks);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Busca um livro pelo ID
 *     tags: [Books]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Livro encontrado com sucesso
 *       404:
 *         description: Livro não encontrado
 */
router.get("/:id", bookController.getBookById);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Cria um novo livro vinculado ao usuário logado
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
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
 *               status:
 *                 type: string
 *                 example: DISPONIVEL
 *     responses:
 *       201:
 *         description: Livro criado com sucesso
 */
router.post("/", verificarToken, bookController.createBook);

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Atualiza um livro (apenas o proprietário)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
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
 *               author:
 *                 type: string
 *               genre:
 *                 type: string
 *               isbn:
 *                 type: string
 *               publicationDate:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Livro atualizado com sucesso
 *       403:
 *         description: Usuário não autorizado
 *       404:
 *         description: Livro não encontrado
 */
router.put("/:id", verificarToken, bookController.updateBook);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Remove um livro (apenas o proprietário)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Livro removido com sucesso
 *       403:
 *         description: Usuário não autorizado
 *       404:
 *         description: Livro não encontrado
 */
router.delete("/:id", verificarToken, bookController.deleteBook);

export default router;