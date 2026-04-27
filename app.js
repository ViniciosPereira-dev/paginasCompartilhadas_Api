import "dotenv/config";
import express from "express";
import path from "path";

//Rotas
import userRoutes from "./src/routes/user.routes.js";
import bookRoutes from "./src/routes/book.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use("/users", userRoutes);
app.use("/books", bookRoutes);

app.get("/", (req, res) => {
  res.send("Servidor rodando");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});