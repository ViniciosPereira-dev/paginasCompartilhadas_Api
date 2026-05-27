import jwt from "jsonwebtoken";

export function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
    }

    try {
        const dadosDecodificados = jwt.verify(token, process.env.JWT_SECRET);
        
        req.usuario = dadosDecodificados; 
        
        next(); 
        
    } catch (error) {
        return res.status(403).json({ erro: 'Token inválido ou expirado.' });
    }
}


