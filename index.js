require("express-async-errors");
const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  port: 5432,
  database: "books",
  user: "zubstack",
  password: "loto123",
});

client.connect();

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

const errorHandling = (err, req, res, next) => {
  res.status(500).json({
    msg: err.message,
    success: false,
  });
};

async function getBookList() {
  return await client.query(
    "SELECT title,author,recommendation,content AS review,isbn FROM books INNER JOIN reviews ON reviews.book_id=books.id;"
  );
}

async function getBooks() {
  return await client.query("SELECT id, title, author, isbn FROM books;");
}

async function getBook(id) {
  return await client.query(
    "SELECT title,author,recommendation,content AS review,isbn FROM books INNER JOIN reviews ON reviews.book_id=books.id WHERE books.id = $1;",
    [id]
  );
}

async function addBook(data) {
  const response = await client.query(
    "INSERT INTO books (title, author, recommendation, isbn) VALUES ($1,$2,$3,$4) RETURNING id;",
    [data.title, data.author, data.recommendation, data.isbn]
  );
  const currentBookId = response.rows[0].id;
  await client.query(
    "INSERT INTO reviews (content, book_id) VALUES ($1, $2);",
    [data.review, currentBookId]
  );
}

async function editBook(data, id) {
  await client.query(
    "UPDATE books SET title =$1, author =$2, recommendation =$3, isbn =$4 WHERE id =$5;",
    [data.title, data.author, data.recommendation, data.isbn, id]
  );
  await client.query("UPDATE reviews SET content =$1 WHERE book_id =$2;", [
    data.review,
    id,
  ]);
}

async function deleteBook(id) {
  await client.query("DELETE FROM books WHERE id =$1;", [id]);
}

app.get("/", async (req, res) => {
  const bookList = await getBookList();
  res.render("index", {
    books: bookList.rows,
  });
});

app.get("/books/dashboard", async (req, res) => {
  const books = await getBooks();
  res.render("dashboard", {
    books: books.rows,
  });
});

app.get("/books/add", (req, res) => {
  res.render("compose");
});

app.get("/books/edit/:id", async (req, res) => {
  const { id } = req.params;
  const response = await getBook(parseInt(id));
  const [data] = response.rows;
  console.log("data", data);
  if (!data) {
    throw new Error("Client tried an unexisting id");
  }
  res.render("edit", { data: { ...data, id } });
});

app.post("/new", async (req, res) => {
  const data = req.body;
  await addBook(data);
  res.redirect("/");
});

app.post("/edit/:id", async (req, res) => {
  const data = req.body;
  const { id } = req.params;
  await editBook(data, parseInt(id));
  res.redirect("/");
});

app.post("/delete/:id", async (req, res) => {
  const { id } = req.params;
  await deleteBook(parseInt(id));
  res.redirect("/books/dashboard");
});

app.get("/*", (req, res) => {
  res.render("not-found");
});

// Middlewares

app.use(errorHandling);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
