import { Router } from "express";
import axios from "axios";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Recommendations
 *   description: Consulta ao microsserviço de recomendações personalizadas
 */

/**
 * @swagger
 * /recommendation:
 *   get:
 *     summary: Obtém recomendações de livros para o usuário logado
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filtra as recomendações por um gênero literário específico
 *         example: Fantasia
 *     responses:
 *       200:
 *         description: Recomendações retornadas com sucesso pelo microsserviço
 *       401:
 *         description: Não autenticado (Token não fornecido ou inválido)
 *       500:
 *         description: Erro ao consultar o microsserviço de recomendações
 */
router.get("/", verificarToken, async (req, res) => {
    try {
        const userIdLogado = req.usuario.id;

        const response = await axios.get(
            `${process.env.RECOMMENDATION_SERVICE_URL}/recommendation`,
            {
                params: {
                    ...req.query,      
                    userId: userIdLogado 
                }
            }
        );

        return res.status(200).json(response.data);

    } catch (error) {
        console.error("Erro ao consultar microsserviço:", error.message);

        const status = error.response ? error.response.status : 500;

        return res.status(status).json({
            error: "Erro ao consultar recomendações"
        });
    }
});

export default router;
