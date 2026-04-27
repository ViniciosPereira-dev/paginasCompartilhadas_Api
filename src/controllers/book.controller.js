import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Controlador para criar um novo livro - CREATE
export async function createBook(req, res) {
    try{
        const { title, author, publicationDate, genre, isbn, description, status, userId } = req.body;

        if(!title || !author || !publicationDate || !isbn || !genre || !userId){
            return res.status(400).json({ error: "Título, autor, data de publicação, gênero, ISBN e ID do usuário são obrigatórios" });
        }

        const userIdNumber = Number(userId);
        if(isNaN(userIdNumber)){
            return res.status(400).json({ error: "ID do usuário inválido" });
        }

        const user = await prisma.user.findUnique({ where: { id: userIdNumber } });

        if(!user){
            return res.status(404).json({ error: "Usuário não encontrado" });
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

        return res.status(201).json(book);

    } catch (error) {
        console.error("Erro ao criar livro:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
}

// Controlador para obter todos os livros - READ
export async function getAllBooks(req, res) {
    try{
        const books = await prisma.book.findMany({include : { user: true }});
        return res.status(200).json(books); 
    } catch (error) {
        console.error("Erro ao obter livros:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
}

// Controlador para obter um livro por ID - READ
export async function getBookById(req, res) {
    try{
        const id = Number(req.params.id);

        if(isNaN(id)){
            return res.status(400).json({ error: "ID inválido" });
        }

        const book = await prisma.book.findUnique({ where: { id: parseInt(id) }, 
        include: { 
            user: {
            select: { 
                id: true, 
                name: true, email: true }
        }} });

        if(!book){
            return res.status(404).json({ error: "Livro não encontrado" });
        }

        return res.status(200).json(book);
    } catch (error) {
        console.error("Erro ao obter livro:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
}

// Controlador para atualizar um livro por ID - UPDATE
export async function updateBook(req, res) {
    try{
        const id = Number(req.params.id);

        if(isNaN(id)){
            return res.status(400).json({ error: "ID inválido" });
        }

        const { title, author, publicationDate, genre, isbn, description, status } = req.body;
        const book = await prisma.book.findUnique({ where: { id: parseInt(id) } });

        if(!book){
            return res.status(404).json({ error: "Livro não encontrado" });
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

        return res.status(200).json(updatedBook);

    } catch (error) {
        console.error("Erro ao atualizar livro:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
}

// Controlador para deletar um livro por ID - DELETE
export async function deleteBook(req, res) {
    try {
        const id = Number(req.params.id); 

        if (isNaN(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        const book = await prisma.book.findUnique({
            where: { id }
        });

        if (!book) {
            return res.status(404).json({ error: "Livro não encontrado" });
        }

        if (book.status === "DONATED") {
            return res.status(400).json({
                error: "Não é possível deletar um livro doado"
            });
        }

        await prisma.book.delete({
            where: { id }
        });

        return res.status(200).json({
            message: "Livro deletado com sucesso"
        });

    } catch (error) {

        if (error.code === "P2025") {
            return res.status(404).json({ error: "Livro não encontrado" });
        }

        return res.status(500).json({ error: "Erro interno do servidor" });
    }
}

