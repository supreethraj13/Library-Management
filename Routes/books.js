const express = require('express');
const {books} = require('../data/books');
const {users} = require('../data/users');
const router = express.Router();

//route to get all books

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    data: books,
  });
});

// route to get issued books
router.get('/issued', (req, res) => {
  const UserwithissuedBooks = users.filter((u) => {
    return u.issuedBook !== null && u.issuedBook !== undefined;
  });

  const issuedBooks = []
  UserwithissuedBooks.forEach((user) => {
    const book = books.find((book) => book.id === user.issuedBook);
    if (book) {
      book.issuedby = user.name;
      book.issuedDate = user.issuedDate;
      book.returnDate = user.returnDate;

      issuedBooks.push(book);
    }
  });

  if(issuedBooks.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'No issued books found',
    });
  }

  res.status(200).json({
    success: true,
    data: issuedBooks,
  });
});

//route to get a book by id
router.get('/:id', (req, res) => {
  const {id} = req.params;
  const book = books.find(b => b.id === id);
  if (!book) {
    return res.status(404).json({
      success: false,
      message: 'Book not found',
    });
  }
  res.status(200).json({
    success: true,
    data: book,
  });
});

//route to create a new book
router.post('/', (req, res) => {
  const {id,name,author, genre, publisher, price } = req.body;
  if (!id || !name || !author || !genre || !price || !publisher) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }
  const book = books.find(b => b.id === id);
  if (book) {
    return res.status(409).json({ 
      success: false,
      message: 'Book with this ID already exists',
    });
  }

  books.push({id,name,author, genre, publisher, price });
  res.status(201).json({
    success: true,
    message: 'Book created successfully',
  });
});

//route to update a book by id
router.put('/:id', (req, res) => {
  const {id} = req.params;
  const {data} = req.body;
  const book = books.find(b => b.id === id);
  if (!book) {
    return res.status(404).json({
      success: false,
      message: 'Book not found',
    });
  }
  Object.assign(book, data);
  res.status(200).json({
    success: true,
    message: 'Book updated successfully',
  });
});

//route to delete a book by id
router.delete('/:id', (req, res) => {
  const {id} = req.params;
  const book = books.find(b => b.id === id);
  if (!book) {
    return res.status(404).json({
      success: false,
      message: 'Book not found',
    });
  }
  const updatedBooks = books.filter(b => b.id !== id);
  // const index = books.findIndex(b => b.id === id);
  // if (index !== -1) {
  //   books.splice(index, 1);
  // }
  res.status(200).json({
    success: true,
    data: updatedBooks,
    message: 'Book deleted successfully',
  });
});

 

module.exports = router;