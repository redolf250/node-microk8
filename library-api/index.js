const express = require('express');
const app = express();
const PORT = 9200;

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory list acting as the database
let books = [
  { id: 1, title: '1984', author: 'George Orwell', year: 1949 },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960 },
];

// Get all books
app.get('/books', (req, res) => {
  res.json(books);
});

// Get a single book by ID
app.get('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  res.json(book);
});

// Add a new book
app.post('/books', (req, res) => {
  const { title, author, year } = req.body;

  if (!title || !author || !year) {
    return res.status(400).json({ message: 'Title, author, and year are required' });
  }

  const newBook = {
    id: books.length > 0 ? books[books.length - 1].id + 1 : 1,
    title,
    author,
    year,
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

// Update a book by ID
app.put('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const { title, author, year } = req.body;

  const bookIndex = books.findIndex(b => b.id === bookId);
  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }

  // Update the book details
  books[bookIndex] = { ...books[bookIndex], title, author, year };

  res.json(books[bookIndex]);
});

// Delete a book by ID
app.delete('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const bookIndex = books.findIndex(b => b.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }

  // Remove the book from the list
  const deletedBook = books.splice(bookIndex, 1);
  res.json(deletedBook[0]);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});