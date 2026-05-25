import { Router } from "express";
import axios from "axios";

const router = Router();

router.get("/", async (req, res) => {
    try {

        const response = await axios.get(
            `${process.env.RECOMMENDATION_SERVICE_URL}/recommendation`,
            {
                params: req.query
            }
        );

        return res.status(200).json(response.data);

    } catch (error) {

        console.error("Erro ao consultar microsserviço:", error.message);

        return res.status(500).json({
            error: "Erro ao consultar recomendações"
        });
    }
});

export default router;