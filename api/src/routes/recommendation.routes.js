import { Router } from "express";
import axios from "axios";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Recommendations
 *   description: Consulta ao microsserviço de recomendações personalizadas
 */

router.get("/", async (req, res) => {
    // Força o endereço do microsserviço caso a variável do .env falhe ou venha mal formatada
    const urlServico = process.env.RECOMMENDATION_SERVICE_URL || "http://localhost:4000";

    try {
        console.log(`[API Principal] Tentando conectar ao microsserviço em: ${urlServico}/recommendation`);

        const response = await axios.get(
            `${urlServico}/recommendation`,
            {
                params: req.query, // Repassa o gênero (?genre=...) vindo do front-end
                timeout: 5000 // Se o microsserviço travar por mais de 5 segundos, cancela a chamada
            }
        );

        return res.status(200).json(response.data);

    } catch (error) {
        // DETALHAMENTO DE LOGS NO TERMINAL DA PORTA 3000:
        console.error("====== ERRO NA CONSULTA AO MICROSSERVIÇO ======");
        console.error("Mensagem do Erro:", error.message);
        
        if (error.response) {
            // O microsserviço respondeu com um status fora do padrão 2xx
            console.error("Status retornado pelo microsserviço (Porta 4000):", error.response.status);
            console.error("Dados do erro do microsserviço:", error.response.data);
            return res.status(error.response.status).json(error.response.data);
        } else if (error.request) {
            // A API principal tentou bater na porta 4000, mas o microsserviço não respondeu (está desligado)
            console.error("O microsserviço na porta 4000 não respondeu. Certifique-se de que ele está rodando!");
            return res.status(503).json({ error: "O microsserviço de recomendações parece estar desligado." });
        }

        return res.status(500).json({
            error: "Erro interno no servidor ao processar recomendações"
        });
    }
});

export default router;
