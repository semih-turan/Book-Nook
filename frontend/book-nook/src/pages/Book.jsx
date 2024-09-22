import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

function Books() {
  const [books, setBooks] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [name, setName] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [stock, setStock] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        import.meta.env.VITE_APP_BASE_URL + "/api/v1/books"
      );
      if (Array.isArray(response.data)) {
        setBooks(response.data);
      } else {
        setBooks([]);
      }
    } catch (error) {
      setError("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateBook = async () => {
    if (!name) {
      setError("Book name cannot be empty");
      return;
    }

    if (!publicationYear || isNaN(publicationYear)) {
      setError("Publication Year must be a valid number");
      return;
    }

    if (!stock || isNaN(stock) || stock < 0) {
      setError("Stock must be a positive number");
      return;
    }

    try {
      if (selectedBook) {
        // Güncelleme işlemi
        await axios.put(
          import.meta.env.VITE_APP_BASE_URL +
            `/api/v1/books/${selectedBook.id}`,
          {
            name,
            publicationYear: parseInt(publicationYear, 10),
            stock: parseInt(stock, 10),
          }
        );
      } else {
        // Yeni kitap ekleme işlemi
        await axios.post(import.meta.env.VITE_APP_BASE_URL + "/api/v1/books", {
          name,
          publicationYear: parseInt(publicationYear, 10),
          stock: parseInt(stock, 10),
        });
      }
      fetchBooks(); // Kitapları tekrar çek
      handleClose(); // Dialog'u kapat
    } catch (error) {
      setError("Failed to save book");
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await axios.delete(
        import.meta.env.VITE_APP_BASE_URL + `/api/v1/books/${id}`
      );
      fetchBooks(); // Kitapları tekrar çek
    } catch (error) {
      setError("Failed to delete book");
    }
  };

  const handleOpen = (book = null) => {
    setSelectedBook(book);
    setName(book ? book.name : "");
    setPublicationYear(book ? book.publicationYear : "");
    setStock(book ? book.stock : "");
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedBook(null);
    setName("");
    setPublicationYear("");
    setStock("");
    setOpen(false);
    setError("");
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
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper} style={{ marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Publication Year</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(books) &&
                books.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>{book.id}</TableCell>
                    <TableCell>{book.name}</TableCell>
                    <TableCell>{book.publicationYear}</TableCell>
                    <TableCell>{book.stock}</TableCell>
                    <TableCell align="right">
                      <Button
                        color="primary"
                        onClick={() => handleOpen(book)}
                        style={{ marginRight: "10px" }}
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
        <DialogTitle>{selectedBook ? "Edit Book" : "Add New Book"}</DialogTitle>
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
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddOrUpdateBook} color="primary">
            {selectedBook ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Books;
