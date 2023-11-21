const express = require("express");
const bodyParser = require("body-parser");
const books = require("./temp_db.js");
const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  port: 5432,
  database: "books",
  user: "zubstack",
  password: "loto123",
});

client.connect();
// (async () => {
//   const id = await client.query(
//     "INSERT INTO books (title, author, recommendation, isbn) VALUES ('To Kill a Mockingbird','Harper Lee', 8,'9780061120084') RETURNING id;"
//   );
//   console.log("id", id);
// })();

const app = express();
const port = 3000;

// Configuración para usar archivos EJS como vistas
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.get("/", async (req, res) => {
  const bookList = await client.query(
    "SELECT title,author,recommendation,content AS review,ISBN FROM books INNER JOIN reviews ON reviews.book_id=books.id;"
  );
  res.render("index", {
    books: bookList.rows,
  });
});

app.get("/books/add", (req, res) => {
  res.render("add");
});

app.post("/new", async (req, res) => {
  const data = req.body;
  const response = await client.query(
    "INSERT INTO books (title, author, recommendation, isbn) VALUES ($1,$2,$3,$4) RETURNING id;",
    [data.title, data.author, data.recommendation, data.isbn]
  );
  const currentBookId = response.rows[0].id;
  await client.query(
    "INSERT INTO reviews (content, book_id) VALUES ($1, $2);",
    [data.review, currentBookId]
  );
  console.log("id", response.rows[0].id);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
