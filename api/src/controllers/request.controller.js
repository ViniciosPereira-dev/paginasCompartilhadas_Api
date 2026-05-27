import { PrismaClient } from "@prisma/client";
import { success, error } from "../utils/response.js";

const prisma = new PrismaClient();

// CREATE REQUEST (Protegido por JWT)
export const createRequest = async (req, res) => {
    try {
        const { bookId } = req.body;
        const bookIdNumber = Number(bookId);

        const userIdNumber = Number(req.usuario.id); 

        if (isNaN(bookIdNumber)) {
            return error(res, "O ID do livro deve ser um número válido", 400);
        }

        const book = await prisma.book.findUnique({
            where: { id: bookIdNumber }
        });

        if (!book) {
            return error(res, "Livro não encontrado", 404);
        }


        if (book.userId === userIdNumber) {
            return error(res, "Você não pode solicitar seu próprio livro", 400);
        }

        if (book.status === "REQUESTED") {
            return error(res, "Este livro já está em processo de doação", 400);
        }

        if (book.status === "DONATED") {
            return error(res, "Este livro já foi doado", 400);
        }

        const request = await prisma.request.create({
            data: {
                userId: userIdNumber,
                bookId: bookIdNumber
            }
        });

        return success(res, "Requisição criada com sucesso", request, 201);

    } catch (err) {
        console.error(err);

        if (err.code === "P2002") {
            return error(res, "Você já solicitou este livro", 400);
        }

        return error(res, "Erro interno do servidor", 500);
    }
};


export async function acceptRequest(req, res) {
    try {
        const id = Number(req.params.id);
        const userIdLogado = Number(req.usuario.id);

        if (isNaN(id)) {
            return error(res, "ID inválido", 400);
        }

        const request = await prisma.request.findUnique({
            where: { id },
            include: {
                user: true,
                book: true
            }
        });

        if (!request) {
            return error(res, "Requisição não encontrada", 404);
        }


        if (request.book.userId !== userIdLogado) {
            return error(res, "Acesso negado. Você não é o proprietário deste livro.", 403);
        }

        if (request.status !== "PENDING") {
            return error(res, "Requisição já foi processada", 400);
        }

        if (request.book.status !== "AVAILABLE") {
            return error(res, "Este livro já está em processo ou foi doado", 400);
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
            data: { status: "REJECTED" }
        });


        await prisma.book.update({
            where: { id: request.bookId },
            data: { status: "REQUESTED" }
        });

        return success(res, "Requisição aceita com sucesso", {
            requestId: request.id,
            solicitante: {
                id: request.user.id,
                name: request.user.name,
                phone: request.user.phone
            },
            livro: {
                id: request.book.id,
                title: request.book.title,
                author: request.book.author
            }
        });

    } catch (err) {
        console.error(err);
        return error(res, "Erro interno do servidor", 500);
    }
}

// REJECT REQUEST (Protegido por JWT)
export async function rejectRequest(req, res) {
    try {
        const id = Number(req.params.id);
        const userIdLogado = Number(req.usuario.id);

        if (isNaN(id)) {
            return error(res, "ID inválido", 400);
        }

        const request = await prisma.request.findUnique({
            where: { id },
            include: { book: true }
        });

        if (!request) {
            return error(res, "Requisição não encontrada", 404);
        }

        // Trava: Apenas o dono do livro pode rejeitar a solicitação
        if (request.book.userId !== userIdLogado) {
            return error(res, "Acesso negado. Você não é o proprietário deste livro.", 403);
        }

        if (request.status !== "PENDING") {
            return error(res, "Requisição já foi processada", 400);
        }

        await prisma.request.update({
            where: { id },
            data: { status: "REJECTED" }
        });

        return success(res, "Requisição rejeitada com sucesso");

    } catch (err) {
        console.error(err);
        return error(res, "Erro interno do servidor", 500);
    }
}

// FINALIZE REQUEST (Protegido por JWT)
export async function finalizeRequest(req, res) {
    try {
        const id = Number(req.params.id);
        const userIdLogado = Number(req.usuario.id);

        if (isNaN(id)) {
            return error(res, "ID inválido", 400);
        }

        const request = await prisma.request.findUnique({
            where: { id },
            include: {
                book: true,
                user: true
            }
        });

        if (!request) {
            return error(res, "Requisição não encontrada", 404);
        }

   
        if (request.book.userId !== userIdLogado) {
            return error(res, "Acesso negado. Você não é o proprietário deste livro.", 403);
        }

        if (request.status !== "ACCEPTED") {
            return error(res, "Apenas requisições aceitas podem ser finalizadas", 400);
        }

        if (request.book.status !== "REQUESTED") {
            return error(res, "Livro não está em processo de doação", 400);
        }

        await prisma.request.update({
            where: { id },
            data: { status: "FINALIZED" }
        });

        await prisma.book.update({
            where: { id: request.bookId },
            data: { status: "DONATED" }
        });

        return success(res, "Requisição finalizada com sucesso", {
            requestId: request.id,
            solicitante: {
                id: request.user.id,
                name: request.user.name,
                phone: request.user.phone
            },
            livro: {
                id: request.book.id,
                title: request.book.title,
                author: request.book.author
            }
        });

    } catch (err) {
        console.error(err);
        return error(res, "Erro interno do servidor", 500);
    }
}

// GET REQUESTS BY BOOK (Protegido por JWT)
export async function getRequestsByBook(req, res) {
    try {
        const bookId = Number(req.params.bookId);
        const userIdLogado = Number(req.usuario.id);

        if (isNaN(bookId)) {
            return error(res, "ID do livro inválido", 400);
        }

        const book = await prisma.book.findUnique({ where: { id: bookId } });

        if (!book) {
            return error(res, "Livro não encontrado", 404);
        }

        if (book.userId !== userIdLogado) {
            return error(res, "Acesso negado. Você não tem permissão para ver os pedidos deste livro.", 403);
        }

        const requests = await prisma.request.findMany({
            where: { bookId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        phone: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return success(res, "Requisições do livro retornadas com sucesso", requests);
    } catch (err) {
        console.error(err);
        return error(res, "Erro interno do servidor", 500);
    }
}

// GET REQUESTS BY USER (Protegido por JWT)
export async function getRequestsByUser(req, res) {
    try {

        const userIdLogado = Number(req.usuario.id);

        const requests = await prisma.request.findMany({
            where: { userId: userIdLogado },
            include: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        author: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return success(res, "Suas requisições foram retornadas com sucesso", requests);
    } catch (err) {
        console.error(err);
        return error(res, "Erro interno do servidor", 500);
    }
}

// GET ALL REQUESTS (Protegido por JWT - Uso administrativo ou geral se necessário)
export async function getAllRequests(req, res) {
    try {
        const requests = await prisma.request.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        phone: true
                    }
                },
                book: {
                    select: {
                        id: true,
                        title: true,
                        author: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return success(res, "Todas as requisições do sistema retornadas", requests);
    } catch (err) {
        console.error(err);
        return error(res, "Erro interno do Servidor")
    }
}
