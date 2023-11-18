const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000; // Puedes cambiar el puerto si es necesario

// Configuración para usar archivos EJS como vistas
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// Ruta principal que renderiza el archivo index.ejs
app.get("/", (req, res) => {
  res.render("index");
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
