import { PrismaClient } from "@prisma/client";
import { success, error } from "../utils/response.js";

const prisma = new PrismaClient();

// CREATE REQUEST
export const createRequest = async (req, res) => {
    try {
        const { userId, bookId } = req.body;

        const userIdNumber = Number(userId);
        const bookIdNumber = Number(bookId);

        if (isNaN(userIdNumber) || isNaN(bookIdNumber)) {
            return error(res, "IDs devem ser números", 400);
        }

        const book = await prisma.book.findUnique({
            where: { id: bookIdNumber }
        });

        const user = await prisma.user.findUnique({
            where: { id: userIdNumber }
        });

        if (!user) {
            return error(res, "Usuário não encontrado", 404);
        }

        if (!book) {
            return error(res, "Livro não encontrado", 404);
        }

        // Não pode solicitar próprio livro
        if (book.userId === userIdNumber) {
            return error(res, "Você não pode solicitar seu próprio livro", 400);
        }

        // Regras de status
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

// ACCEPT REQUEST
export async function acceptRequest(req, res) {
    try {
        const id = Number(req.params.id);

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

        if (request.status !== "PENDING") {
            return error(res, "Requisição já foi processada", 400);
        }

        if (request.book.status !== "AVAILABLE") {
            return error(res, "Este livro já está em processo ou foi doado", 400);
        }

        // aceita
        await prisma.request.update({
            where: { id },
            data: { status: "ACCEPTED" }
        });

        // rejeita as outras
        await prisma.request.updateMany({
            where: {
                bookId: request.bookId,
                id: { not: id }
            },
            data: { status: "REJECTED" }
        });

        // atualiza livro
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

// REJECT REQUEST
export async function rejectRequest(req, res) {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return error(res, "ID inválido", 400);
        }

        const request = await prisma.request.findUnique({
            where: { id }
        });

        if (!request) {
            return error(res, "Requisição não encontrada", 404);
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

// FINALIZE REQUEST
export async function finalizeRequest(req, res) {
    try {
        const id = Number(req.params.id);

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