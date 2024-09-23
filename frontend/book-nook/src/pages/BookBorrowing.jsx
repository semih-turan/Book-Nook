import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';

function BookBorrowing() {
  const [borrowings, setBorrowings] = useState([]);
  const [books, setBooks] = useState([]);
  const [open, setOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedBorrowing, setSelectedBorrowing] = useState(null);
  const [borrowerName, setBorrowerName] = useState('');
  const [borrowerMail, setBorrowerMail] = useState('');
  const [borrowingDate, setBorrowingDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBorrowings();
    fetchBooks();
  }, []);

  const fetchBorrowings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(import.meta.env.VITE_APP_BASE_URL +'/api/v1/borrows');
      setBorrowings(response.data);
    } catch (error) {
      showErrorModal('Failed to fetch borrowings', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_APP_BASE_URL +'/api/v1/books');
      setBooks(response.data);
    } catch (error) {
      showErrorModal('Failed to fetch books', error);
    }
  };

  const handleAddOrUpdateBorrowing = async () => {
    if (!borrowerName || !borrowerMail || !borrowingDate || !selectedBook) {
      showErrorModal('Please fill in all the fields');
      return;
    }

    const borrowingData = {
      borrowerName,
      borrowerMail,
      borrowingDate,
      returnDate,
      bookForBorrowingRequest: selectedBook && {
        id: selectedBook.id,
        name: selectedBook.name,
        publicationYear: selectedBook.publicationYear,
        stock: selectedBook.stock,
      }
    };

    try {
      if (selectedBorrowing) {
        // Güncelleme işlemi
        await axios.put(import.meta.env.VITE_APP_BASE_URL +`/api/v1/borrows/${selectedBorrowing.id}`, {
          borrowerName,
          borrowingDate,
          returnDate
        });
      } else {
        // Yeni ödünç alma kaydı ekleme işlemi
        await axios.post(import.meta.env.VITE_APP_BASE_URL +'/api/v1/borrows', borrowingData);
      }
      fetchBorrowings(); // Ödünç alma kayıtlarını tekrar çek
      handleClose(); // Dialog'u kapat
    } catch (error) {
      showErrorModal('Failed to save borrowing record', error);
    }
  };

  const handleDeleteBorrowing = async (id) => {
    try {
      await axios.delete(import.meta.env.VITE_APP_BASE_URL +`/api/v1/borrows/${id}`);
      fetchBorrowings(); // Ödünç alma kayıtlarını tekrar çek
    } catch (error) {
      showErrorModal('Failed to delete borrowing record', error);
    }
  };

  const handleOpen = (borrowing = null) => {
    if (borrowing) {
      setSelectedBorrowing(borrowing);
      setBorrowerName(borrowing.borrowerName);
      setBorrowerMail(borrowing.borrowerMail);
      setBorrowingDate(borrowing.borrowingDate);
      setReturnDate(borrowing.returnDate);
      setSelectedBook(borrowing.book);
    } else {
      setSelectedBorrowing(null);
      setBorrowerName('');
      setBorrowerMail('');
      setBorrowingDate('');
      setReturnDate('');
      setSelectedBook(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedBorrowing(null);
    setBorrowerName('');
    setBorrowerMail('');
    setBorrowingDate('');
    setReturnDate('');
    setSelectedBook(null);
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

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Book Borrowings
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add New Borrowing
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
                <TableCell>Borrower Name</TableCell>
                <TableCell>Borrower Email</TableCell>
                <TableCell>Borrowing Date</TableCell>
                <TableCell>Return Date</TableCell>
                <TableCell>Book Name</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(borrowings) && borrowings.map((borrowing) => (
                <TableRow key={borrowing.id}>
                  <TableCell>{borrowing.id}</TableCell>
                  <TableCell>{borrowing.borrowerName}</TableCell>
                  <TableCell>{borrowing.borrowerMail}</TableCell>
                  <TableCell>{borrowing.borrowingDate}</TableCell>
                  <TableCell>{borrowing.returnDate}</TableCell>
                  <TableCell>{borrowing.book.name}</TableCell>
                  <TableCell align="right">
                    <Button 
                      color="primary" 
                      onClick={() => handleOpen(borrowing)}
                      style={{ marginRight: '10px' }}
                    >
                      Edit
                    </Button>
                    <Button 
                      color="secondary" 
                      onClick={() => handleDeleteBorrowing(borrowing.id)}
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

      {/* Dialog for Add/Edit Borrowing */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedBorrowing ? 'Edit Borrowing' : 'Add New Borrowing'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Borrower Name"
            type="text"
            fullWidth
            value={borrowerName}
            onChange={(e) => setBorrowerName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Borrower Email"
            type="email"
            fullWidth
            value={borrowerMail}
            onChange={(e) => setBorrowerMail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Borrowing Date"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true, // Label'in düzgün şekilde yerleşmesi için
            }}
            value={borrowingDate}
            onChange={(e) => setBorrowingDate(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Return Date"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true, // Label'in düzgün şekilde yerleşmesi için
            }}
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />
          {!selectedBorrowing && (
            <FormControl fullWidth margin="dense">
              <InputLabel>Book</InputLabel>
              <Select
                value={selectedBook ? selectedBook.id : ''}
                onChange={(e) => setSelectedBook(books.find(book => book.id === e.target.value))}
              >
                {books.map((book) => (
                  <MenuItem key={book.id} value={book.id}>
                    {book.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
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
          <Button onClick={handleAddOrUpdateBorrowing} color="primary">
            {selectedBorrowing ? 'Update' : 'Add'}
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

export default BookBorrowing;
