import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Select, MenuItem, InputLabel, FormControl, Checkbox, ListItemText } from '@mui/material';
import axios from 'axios';

function Books() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [name, setName] = useState('');
  const [publicationYear, setPublicationYear] = useState('');
  const [stock, setStock] = useState('');
  const [author, setAuthor] = useState({ id: '', name: '', birthDate: '', country: '' });
  const [publisher, setPublisher] = useState({ id: '', name: '', establishmentYear: '', address: '' });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
    fetchAuthors();
    fetchPublishers();
    fetchCategories();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get( import.meta.env.VITE_APP_BASE_URL + '/api/v1/books');
      setBooks(response.data);
    } catch (error) {
      showErrorModal('Failed to fetch books', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await axios.get( import.meta.env.VITE_APP_BASE_URL + '/api/v1/authors');
      setAuthors(response.data);
    } catch (error) {
      showErrorModal('Failed to fetch authors', error);
    }
  };

  const fetchPublishers = async () => {
    try {
      const response = await axios.get( import.meta.env.VITE_APP_BASE_URL + '/api/v1/publishers');
      setPublishers(response.data);
    } catch (error) {
      showErrorModal('Failed to fetch publishers', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get( import.meta.env.VITE_APP_BASE_URL + '/api/v1/categories');
      setCategories(response.data);
    } catch (error) {
      showErrorModal('Failed to fetch categories', error);
    }
  };

  const handleAddOrUpdateBook = async () => {
    if (!name || !author.id || !publisher.id || selectedCategories.length === 0) {
      showErrorModal('Please fill in all the fields');
      return;
    }

    if (!publicationYear || isNaN(publicationYear)) {
      showErrorModal('Publication Year must be a valid number');
      return;
    }

    if (!stock || isNaN(stock) || stock < 0) {
      showErrorModal('Stock must be a positive number');
      return;
    }

    const bookData = {
      id: selectedBook ? selectedBook.id : 0,
      name,
      publicationYear: parseInt(publicationYear, 10),
      stock: parseInt(stock, 10),
      author,
      publisher,
      categories: selectedCategories.map((categoryId) => ({
        id: categoryId,
        name: categories.find((category) => category.id === categoryId).name,
        description: categories.find((category) => category.id === categoryId).description,
      })),
    };

    try {
      if (selectedBook) {
        // Güncelleme işlemi
        await axios.put( import.meta.env.VITE_APP_BASE_URL + `/api/v1/books/${selectedBook.id}`, bookData);
      } else {
        // Yeni kitap ekleme işlemi
        await axios.post(import.meta.env.VITE_APP_BASE_URL + '/api/v1/books', bookData);
      }
      fetchBooks(); // Kitapları tekrar çek
      handleClose(); // Dialog'u kapat
    } catch (error) {
      showErrorModal('Failed to save book', error);
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await axios.delete( import.meta.env.VITE_APP_BASE_URL + `/api/v1/books/${id}`);
      fetchBooks(); // Kitapları tekrar çek
    } catch (error) {
      showErrorModal('Failed to delete book', error);
    }
  };

  const handleOpen = (book = null) => {
    if (book) {
      setSelectedBook(book);
      setName(book.name);
      setPublicationYear(book.publicationYear);
      setStock(book.stock);
      setAuthor(book.author);
      setPublisher(book.publisher);
      setSelectedCategories(book.categories.map((category) => category.id));
    } else {
      setSelectedBook(null);
      setName('');
      setPublicationYear('');
      setStock('');
      setAuthor({ id: '', name: '', birthDate: '', country: '' });
      setPublisher({ id: '', name: '', establishmentYear: '', address: '' });
      setSelectedCategories([]);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedBook(null);
    setName('');
    setPublicationYear('');
    setStock('');
    setAuthor({ id: '', name: '', birthDate: '', country: '' });
    setPublisher({ id: '', name: '', establishmentYear: '', address: '' });
    setSelectedCategories([]);
    setOpen(false);
    setErrorMessage('');
  };

  const showErrorModal = (message, error = null) => {
    if (error && error.response) {
      setErrorMessage(`${message}: ${error.response.data.message || error.message}`);
    } else {
      setErrorMessage(message);
    }
    setErrorModalOpen(true);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategories(event.target.value);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Books
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add New Book
      </Button>
      
      {/* Yükleme durumunda spinner göster */}
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Publisher</TableCell>
                <TableCell>Categories</TableCell>
                <TableCell>Publication Year</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(books) && books.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>{book.id}</TableCell>
                  <TableCell>{book.name}</TableCell>
                  <TableCell>{book.author.name}</TableCell>
                  <TableCell>{book.publisher.name}</TableCell>
                  <TableCell>{book.categories.map(category => category.name).join(', ')}</TableCell>
                  <TableCell>{book.publicationYear}</TableCell>
                  <TableCell>{book.stock}</TableCell>
                  <TableCell align="right">
                    <Button 
                      color="primary" 
                      onClick={() => handleOpen(book)}
                      style={{ marginRight: '10px' }}
                    >
                      Edit
                    </Button>
                    <Button 
                      color="secondary" 
                      onClick={() => handleDeleteBook(book.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog for Add/Edit Book */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Book Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Publication Year"
            type="number"
            fullWidth
            value={publicationYear}
            onChange={(e) => setPublicationYear(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Stock"
            type="number"
            fullWidth
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Author</InputLabel>
            <Select
              value={author.id}
              onChange={(e) => setAuthor(authors.find((a) => a.id === e.target.value))}
            >
              {authors.map((author) => (
                <MenuItem key={author.id} value={author.id}>
                  {author.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Publisher</InputLabel>
            <Select
              value={publisher.id}
              onChange={(e) => setPublisher(publishers.find((p) => p.id === e.target.value))}
            >
              {publishers.map((publisher) => (
                <MenuItem key={publisher.id} value={publisher.id}>
                  {publisher.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Categories</InputLabel>
            <Select
              multiple
              value={selectedCategories}
              onChange={handleCategoryChange}
              renderValue={(selected) => selected.map((id) => categories.find((category) => category.id === id).name).join(', ')}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  <Checkbox checked={selectedCategories.indexOf(category.id) > -1} />
                  <ListItemText primary={category.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {errorMessage && (
            <Typography color="error" variant="body2">
              {errorMessage}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddOrUpdateBook} color="primary">
            {selectedBook ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Modal */}
      <Dialog open={errorModalOpen} onClose={() => setErrorModalOpen(false)}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{errorMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorModalOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Books;
