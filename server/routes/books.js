import express from 'express';
import { books } from '../data/books.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all books (public)
router.get('/', (req, res) => {
  try {
    const { search, author, genre, minPrice, maxPrice, year, limit = 22 } = req.query;
    
    let filteredBooks = [...books];

    // Search filter
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredBooks = filteredBooks.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.description.toLowerCase().includes(searchTerm) ||
        book.genre.toLowerCase().includes(searchTerm)
      );
    }

    // Author filter
    if (author) {
      filteredBooks = filteredBooks.filter(book => book.author.toLowerCase().includes(author.toLowerCase()));
    }

    // Genre filter
    if (genre) {
      filteredBooks = filteredBooks.filter(book => book.genre.toLowerCase() === genre.toLowerCase());
    }

    // Price range filter
    if (minPrice) {
      filteredBooks = filteredBooks.filter(book => book.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filteredBooks = filteredBooks.filter(book => book.price <= parseFloat(maxPrice));
    }

    // Year filter
    if (year) {
      filteredBooks = filteredBooks.filter(book => book.publishedYear === parseInt(year));
    }

    // Limit results
    const limitedBooks = filteredBooks.slice(0, parseInt(limit));

    res.json({
      books: limitedBooks,
      total: filteredBooks.length,
      showing: limitedBooks.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch books', error: error.message });
  }
});

// Get single book (public)
router.get('/:id', (req, res) => {
  try {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch book', error: error.message });
  }
});

// Get all genres (public)
router.get('/meta/genres', (req, res) => {
  try {
    const genres = [...new Set(books.map(book => book.genre))].sort();
    res.json(genres);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch genres', error: error.message });
  }
});

// Get all authors (public)
router.get('/meta/authors', (req, res) => {
  try {
    const authors = [...new Set(books.map(book => book.author))].sort();
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch authors', error: error.message });
  }
});

// Create new book (admin only)
router.post('/', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { title, author, isbn, publishedYear, genre, price, description, pages, publisher, language, image } = req.body;

    // Validation
    if (!title || !author || !genre || !price) {
      return res.status(400).json({ message: 'Title, author, genre, and price are required' });
    }

    const newBook = {
      id: books.length + 1,
      title,
      author,
      isbn: isbn || '',
      publishedYear: parseInt(publishedYear) || new Date().getFullYear(),
      genre,
      price: parseFloat(price),
      description: description || '',
      pages: parseInt(pages) || 0,
      publisher: publisher || '',
      language: language || 'English',
      rating: 0,
      stock: 0,
      image: image || 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
      createdAt: new Date().toISOString()
    };

    books.push(newBook);
    res.status(201).json({ message: 'Book created successfully', book: newBook });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create book', error: error.message });
  }
});

// Update book (admin only)
router.put('/:id', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
    if (bookIndex === -1) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const updatedBook = { ...books[bookIndex], ...req.body, id: books[bookIndex].id };
    books[bookIndex] = updatedBook;

    res.json({ message: 'Book updated successfully', book: updatedBook });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update book', error: error.message });
  }
});

// Delete book (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
    if (bookIndex === -1) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const deletedBook = books.splice(bookIndex, 1)[0];
    res.json({ message: 'Book deleted successfully', book: deletedBook });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete book', error: error.message });
  }
});

export default router;