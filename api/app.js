import "dotenv/config";
import express from "express";
import path from "path";
import { swaggerUi, specs } from "./src/config/swagger.js";

//Rotas
import userRoutes from "./src/routes/user.routes.js";
import bookRoutes from "./src/routes/book.routes.js";
import requestRoutes from "./src/routes/request.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use("/users", userRoutes);
app.use("/books", bookRoutes);
app.use("/requests", requestRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/", (req, res) => {
  res.send("Servidor rodando");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

