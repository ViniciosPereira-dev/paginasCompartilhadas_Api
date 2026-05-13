export function validateApiKey(req, res, next) {

    console.log("MIDDLEWARE EXECUTOU");
    console.log("HEADER:", req.headers["x-api-key"]);

    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
        return res.status(401).json({
            error: "API Key não fornecida"
        });
    }

    if (apiKey !== process.env.API_KEY) {
        return res.status(403).json({
            error: "API Key inválida"
        });
    }

    next();
}