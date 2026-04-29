import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Controlador para criar uma nova requisição de livro
export const createRequest = async (req, res) => {
    try{
        const {userId, bookId} = req.body;

        const userIdNumber = Number(userId);
        const bookIdNumber = Number(bookId);

        if(isNaN(userIdNumber) || isNaN(bookIdNumber)){
            return res.status(400).json({error: "IDs devem ser números"});
        }

        const book = await prisma.book.findUnique({
            where: {id: bookIdNumber}
        });

        const user = await prisma.user.findUnique({
            where: {id: userIdNumber}
        });

        if(!user){
            return res.status(404).json({error: "Usuário não encontrado"});
        }

        if(!book){
            return res.status(404).json({error: "Livro não encontrado"});
        }

        // Verificar se o usuário está tentando solicitar seu próprio livro
        if(book.userId === userIdNumber){
            return res.status(400).json({error: "Voçê não pode solicitar seu próprio livro"});
        }

        // Verificar se o livro está disponível para requisição
        if(book.status !== "AVAILABLE"){
            return res.status(400).json({error: "Este livro não disponível para requisição"});
        }

        const request = await prisma.request.create({
            data: {
                userId: userIdNumber,
                bookId: bookIdNumber
            }
        });

        return res.status(201).json(request);

    } catch (error) {
        if(error.code === "P2002"){
            return res.status(400).json({error: "Você já solicitou este livro"});
        }

        return res.status(500).json({error: "Erro interno do servidor"});
    }
}

// Controlador para aceitar uma requisição de livro
export async function acceptRequest(req, res) {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "ID deve ser um número" });
        }

        const request = await prisma.request.findUnique({
            where: { id },
            include: {
                user: true,
                book: true
            }

        });

        if (!request) {
            return res.status(404).json({ error: "Requisição não encontrada" });
        }

        if (request.status !== "PENDING") {
            return res.status(400).json({ error: "Requisição já foi processada" });
        }

        if (request.book.status !== "AVAILABLE") {
            return res.status(400).json({
                error: "Este livro já está em processo ou foi doado"
            });
        }

        await prisma.request.update({
            where: { id },
            data: { status: "ACCEPTED" }
        });

        await prisma.request.updateMany({
            where: {
                bookId: request.bookId,
                id: { not: id }
            },
            data: {
                status: "REJECTED"
            }
        });

        await prisma.book.update({
            where: { id: request.bookId },
            data: { status: "REQUESTED" }
        });

        return res.status(200).json({
            message: "Requisição aceita com sucesso, demais foram canceladas",
                request: {
                id: request.id,
                user: {
                    id: request.user.id,
                    name: request.user.name,
                    phone: request.user.phone,
                },
                book: {
                    id: request.book.id,
                    title: request.book.title,
                    author: request.book.author,
                    descricao: request.book.description,
                }
            }
        });

    } catch (error) {
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
}

// Controlador para rejeitar uma requisição de livro
export async function rejectRequest(req, res) {
    try{
        const id = Number(req.params.id);

        if(isNaN(id)){
            return res.status(400).json({error: "ID deve ser um número"});
        }

        const request = await prisma.request.findUnique({
            where: {id},
            include: {
                book: true
            }
        });

        if(!request){
            return res.status(404).json({error: "Requisição não encontrada"});
        }

        if(request.status !== "PENDING"){
            return res.status(400).json({error: "Requisição ja foi processada"});
        }

        await prisma.request.update({
            where: {id},
            data: {
                status: "REJECTED"
            }
        });

        return res.status(200).json({message: "Requisição rejeitada com sucesso"});
    } catch (error) {
        return res.status(500).json({error: "Erro interno do servidor"});
    }
}

// Controlador para finalizar uma requisição de livro
export async function finalizeRequest(req, res) {
    try{
        const id = Number(req.params.id);

        if(isNaN(id)){
            return res.status(400).json({error: "ID deve ser um número"});
        }

        const request = await prisma.request.findUnique({
            where: {id},
            include: {
                book: true,
                user: true
            }
        });

        if(!request){
            return res.status(404).json({error: "Requisição não encontrada"});
        }

        if(request.status !== "ACCEPTED"){
            return res.status(400).json({error: "Apenas requisições aceitas podem ser finalizadas"});
        }

        if(request.book.status !== "REQUESTED"){
            return res.status(400).json({error: "Este livro não está em processamento de requisição"});
        }

        await prisma.request.update({
            where: {id},
            data: {
                status: "FINALIZED"
            }
        });

        await prisma.book.update({
            where: {id: request.bookId},
            data: {
                status: "DONATED"
            }
        });

        return res.status(200).json({message: "Requisição finalizada com sucesso", request: {
            id: request.id,
            user: {
                id: request.user.id,
                name: request.user.name,
                phone: request.user.phone,
            },
            book: {
                id: request.book.id,
                title: request.book.title,
                author: request.book.author,
                descricao: request.book.description
            }
        }});
    } catch (error) {
        return res.status(500).json({error: "Erro interno do servidor"});
    }
}

