import { PrismaClient } from "@prisma/client";
import { success, error } from "../utils/response.js";
const prisma = new PrismaClient();

// Controlador para criar um novo livro - CREATE
export async function createBook(req, res) {
    try{
        const { title, author, publicationDate, genre, isbn, description, status, userId } = req.body;

        if(!title || !author || !publicationDate || !isbn || !genre || !userId){
            return error(res, "Título, autor, data de publicação, gênero, ISBN e ID do usuário são obrigatórios", 400);
        }

        const userIdNumber = Number(userId);
        if(isNaN(userIdNumber)){
            return error(res, "ID do usuário inválido", 400);
        }

        const user = await prisma.user.findUnique({ where: { id: userIdNumber } });

        if(!user){
            return error(res, "Usuário não encontrado", 404);
        }

        const book = await prisma.book.create({
            data: {
                title,
                author,
                publicationDate,
                genre,
                isbn,
                description,
                status,
                userId: userIdNumber
            }
        });

        return success(res, "Livro criado com sucesso", book, 201);

    } catch (err) {
        console.error("Erro ao criar livro:", err);
        return error(res, "Erro interno do servidor", 500);
    }
}

// Controlador para obter todos os livros - READ
export async function getAllBooks(req, res) {
    try{
        const books = await prisma.book.findMany({include : { user: true }});
        return success(res, "Livros encontrados", books);
    } catch (err) {
        console.error("Erro ao obter livros:", err  );
        return error(res, "Erro interno do servidor", 500);
    }
}

// Controlador para obter um livro por ID - READ
export async function getBookById(req, res) {
    try{
        const id = Number(req.params.id);

        if(isNaN(id)){
            return error(res, "ID inválido", 400    );
        }

        const book = await prisma.book.findUnique({ where: { id: parseInt(id) }, 
        include: { 
            user: {
            select: { 
                id: true, 
                name: true, email: true }
        }} });

        if(!book){
            return error(res, "Livro não encontrado", 404);
        }

        return success(res, "Livro encontrado", book);
    } catch (err) {
        console.error("Erro ao obter livro:", err);
        return error(res, "Erro interno do servidor", 500);
    }
}

// Controlador para atualizar um livro por ID - UPDATE
export async function updateBook(req, res) {
    try{
        const id = Number(req.params.id);

        if(isNaN(id)){
            return error(res, "ID inválido", 400);
        }

        const { title, author, publicationDate, genre, isbn, description, status } = req.body;
        const book = await prisma.book.findUnique({ where: { id: parseInt(id) } });

        if(!book){
            return error(res, "Livro não encontrado", 404);
        }

        const updatedBook = await prisma.book.update({
            where: { id: parseInt(id) },
            data: {
                title,
                author,
                publicationDate,
                genre,
                isbn,
                description,
                status
            }
        });

        return success(res, "Livro atualizado com sucesso", updatedBook);

    } catch (err) {
        console.error("Erro ao atualizar livro:", err);
        return error(res, "Erro interno do servidor", 500);
    }
}

// Controlador para deletar um livro por ID - DELETE
export async function deleteBook(req, res) {
    try {
        const id = Number(req.params.id); 

        if (isNaN(id)) {
            return error(res, "ID inválido", 400);
        }

        const book = await prisma.book.findUnique({
            where: { id }
        });

        if (!book) {
            return error(res, "Livro não encontrado", 404);
        }

        if (book.status === "DONATED") {
            return error(res, "Não é possível deletar um livro doado", 400);
            };

        if (book.status === "REQUESTED") {
            return error(res, "Livro está em processo de doação", 400);
}

        await prisma.book.delete({
            where: { id }
        });

        return success(res, "Livro deletado com sucesso");

    } catch (err) {

        if (err.code === "P2025") {
            return error(res, "Livro não encontrado", 404);
        }

        return error(res, "Erro interno do servidor", 500 );
    }
}

