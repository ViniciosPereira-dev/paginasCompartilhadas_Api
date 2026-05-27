import { PrismaClient } from "@prisma/client";
import { success, error, parseDateBR } from "../utils/response.js";

const prisma = new PrismaClient();

// Controlador para criar um novo livro - CREATE (Protegido por JWT)
export async function createBook(req, res) {
    try {
        const { title, author, publicationDate, genre, isbn, description, status } = req.body;
        
        // Recupera o ID do usuário diretamente do Token JWT decodificado no middleware
        const userIdNumber = Number(req.usuario.id); 

        if (!title || !author || !publicationDate || !isbn || !genre) {
            return error(res, "Título, autor, data de publicação, gênero e ISBN são obrigatórios", 400);
        }

        const parsedDate = parseDateBR(publicationDate);
        if (!parsedDate) {
            return error(res, "Data inválida. Use DD/MM/AAAA", 400);
        }

        const user = await prisma.user.findUnique({ where: { id: userIdNumber } });
        if (!user) {
            return error(res, "Usuário não cadastrado ou não autorizado", 401);
        }

        const book = await prisma.book.create({
            data: {
                title,
                author,
                publicationDate: parsedDate,
                genre,
                isbn,
                description,
                status,
                userId: userIdNumber // Vincula o livro ao usuário logado de forma segura
            }
        });

        return success(res, "Livro criado com sucesso", book, 201);

    } catch (err) {
        console.error("Erro ao criar livro:", err);
        return error(res, "Erro interno do servidor", 500);
    }
}

// Controlador para obter todos os livros - READ (Público / API Key)
export async function getAllBooks(req, res) {
    try {
        const books = await prisma.book.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        phone: true,
                    }
                }
            }
        });

        return success(res, "Livros encontrados", books);
    } catch (err) {
        console.error("Erro ao obter livros:", err);
        return error(res, "Erro interno do servidor", 500);
    }
}

// Controlador para obter um livro por ID - READ (Público / API Key)
export async function getBookById(req, res) {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return error(res, "ID do livro inválido", 400);
        }

        const book = await prisma.book.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        name: true,
                        phone: true
                    }
                }
            }
        });

        if (!book) {
            return error(res, "Livro não encontrado", 404);
        }

        return success(res, "Livro encontrado", book);
    } catch (err) {
        console.error("Erro ao obter livro:", err);
        return error(res, "Erro interno do servidor", 500);
    }
}

// Controlador para atualizar um livro - UPDATE (Protegido por JWT)
export async function updateBook(req, res) {
    try {
        const bookId = Number(req.params.id);
        const userIdLogado = Number(req.usuario.id); // Pego do Token JWT
        const { title, author, publicationDate, genre, isbn, description, status } = req.body;

        if (isNaN(bookId)) {
            return error(res, "ID do livro inválido", 400);
        }

        // 1. Busca o livro para verificar quem é o dono dele
        const existingBook = await prisma.book.findUnique({ where: { id: bookId } });

        if (!existingBook) {
            return error(res, "Livro não encontrado", 404);
        }

        // 2. Trava de segurança: impede modificação se o livro não for do usuário logado
        if (existingBook.userId !== userIdLogado) {
            return error(res, "Acesso negado. Você não tem permissão para editar este livro.", 403);
        }

        // Prepara os dados e formata a data caso ela tenha sido enviada para atualização
        let dadosAtualizacao = { title, author, genre, isbn, description, status };
        if (publicationDate) {
            const parsedDate = parseDateBR(publicationDate);
            if (!parsedDate) return error(res, "Data inválida. Use DD/MM/AAAA", 400);
            dadosAtualizacao.publicationDate = parsedDate;
        }

        // 3. Atualiza o livro no banco de dados
        const updatedBook = await prisma.book.update({
            where: { id: bookId },
            data: dadosAtualizacao
        });

        return success(res, "Livro atualizado com sucesso", updatedBook);

    } catch (err) {
        console.error("Erro ao atualizar livro:", err);
        return error(res, "Erro interno do servidor", 500);
    }
}

// Controlador para remover um livro - DELETE (Protegido por JWT)
export async function deleteBook(req, res) {
    try {
        const bookId = Number(req.params.id);
        const userIdLogado = Number(req.usuario.id); // Pego do Token JWT

        if (isNaN(bookId)) {
            return error(res, "ID do livro inválido", 400);
        }

        // 1. Busca o livro para conferir a propriedade
        const existingBook = await prisma.book.findUnique({ where: { id: bookId } });

        if (!existingBook) {
            return error(res, "Livro não encontrado", 404);
        }

        // 2. Trava de segurança: impede a deleção se o livro for de outro usuário
        if (existingBook.userId !== userIdLogado) {
            return error(res, "Acesso negado. Você não tem permissão para deletar este livro.", 403);
        }

        // 3. Remove o registro do PostgreSQL
        await prisma.book.delete({ where: { id: bookId } });

        return success(res, "Livro removido com sucesso");

    } catch (err) {
        console.error("Erro ao deletar livro:", err);
        return error(res, "Erro interno do servidor", 500);
    }
}
