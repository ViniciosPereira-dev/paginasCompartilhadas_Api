import express from 'express';
import axios from 'axios';

const app = express();
const PORT = 4000;

app.listen(PORT, () => {
    console.log(`Recommendation Service running on http://localhost:${PORT}`);
});


app.get("/recommendation", async (req, res) => {
    try {
        const { genre } = req.query;

        const response = await axios.get("http://localhost:3000/books/books");
        const books = response.data.data || response.data;

        if (!books || books.length === 0) {
            return res.json({
                message: "Nenhum livro disponível",
                book: null
            });
        }

        let filteredBooks = books.filter(
            (b) => b.status === "AVAILABLE"
        );

        if (genre) {
            filteredBooks = filteredBooks.filter(
                (b) =>
                    b.genre.toLowerCase() === genre.toLowerCase()
            );
        }

        if (filteredBooks.length === 0) {
            return res.json({
                message: "Nenhum livro encontrado para esse gênero",
                book: null
            });
        }

        const randomIndex = Math.floor(Math.random() * filteredBooks.length);
        const recommendedBook = filteredBooks[randomIndex];

       return res.json({
            message: "Livro recomendado com sucesso",
            book: {
                id: recommendedBook.id,
                title: recommendedBook.title,
                author: recommendedBook.author,
                genre: recommendedBook.genre,
                description: recommendedBook.description,
                status: recommendedBook.status
            },
            owner: {
                id: recommendedBook.user?.id,
                name: recommendedBook.user?.name,
                phone: recommendedBook.user?.phone
            }
        });

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({
            error: "Erro ao buscar recomendação"
        });
    }
});