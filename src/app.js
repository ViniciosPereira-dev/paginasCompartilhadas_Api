const express = require("express")
const path = require("path")

const app = express()

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

app.get("/", (req, res) => {
  res.send("Servidor rodando")
})

app.listen(3000, () => {
  console.log("Server running on port 3000")
})