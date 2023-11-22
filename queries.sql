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
    book_id INT REFERENCES
    books(id)
);

INSERT INTO books (title,author, recommendation, ISBN) VALUES ('The Great Gatsby','F. Scott Fitzgerald', 7,'9780743273565') RETURNING id;


INSERT INTO books (title,author, recommendation, ISBN)
VALUES ('The Great Gatsby','F. Scott Fitzgerald', 7,'9780743273565'),
('1984','George Orwell"', 9,'9780451524935'),
('The Catcher in the Rye','J.D. Salinger', 10,'9780061120084');


SELECT author,recommendation,content AS review,ISBN
FROM books
INNER JOIN reviews ON reviews.book_id=books.id;

ALTER TABLE books
DROP COLUMN review;

ALTER TABLE books 
ADD COLUMN title VARCHAR(100);

UPDATE books
SET title = "El gatito con botas",
    column2 = value2,
WHERE condition;

DELETE FROM books
WHERE id =$1;

ALTER TABLE reviews
DROP CONSTRAINT reviews_book_id_fkey, 
ADD CONSTRAINT reviews_book_id_fkey
FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE;

SELECT constraint_name
FROM information_schema.table_constraints
WHERE table_name = 'reviews' AND constraint_type = 'FOREIGN KEY';
