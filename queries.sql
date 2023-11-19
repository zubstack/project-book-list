CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    author VARCHAR(200) NOT NULL,
    recommendation INTEGER CHECK (recommendation >= 1 AND recommendation <= 10) NOT NULL,
    ISBN VARCHAR(15) NOT NULL 
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    book_id INT UNIQUE REFERENCES
    books(id)
);


INSERT INTO books (title,author, recommendation, ISBN)
VALUES ('The Great Gatsby','F. Scott Fitzgerald', 7,'9780743273565'),
('To Kill a Mockingbird','Harper Lee', 8,'9780061120084'),
('1984','George Orwell"', 9,'9780451524935'),
('The Catcher in the Rye','J.D. Salinger', 10,'9780061120084');



SELECT author,recommendation,content,ISBN
FROM books
INNER JOIN reviews ON reviews.book_id=books.id;

ALTER TABLE books
DROP COLUMN review;

ALTER TABLE books 
ADD COLUMN title VARCHAR(100);