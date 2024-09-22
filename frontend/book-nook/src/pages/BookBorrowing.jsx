import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';

function BookBorrowing() {
  const [borrowings, setBorrowings] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedBorrowing, setSelectedBorrowing] = useState(null);
  const [borrowerName, setBorrowerName] = useState('');
  const [borrowerEmail, setBorrowerEmail] = useState('');
  const [borrowingDate, setBorrowingDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const fetchBorrowings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(import.meta.env.VITE_APP_BASE_URL + '/api/v1/borrows');
      if (Array.isArray(response.data)) {
        setBorrowings(response.data);
      } else {
        setBorrowings([]);
      }
    } catch (error) {
      setError('Failed to fetch borrowings');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateBorrowing = async () => {
    if (!borrowerName) {
      setError('Borrower name cannot be empty');
      return;
    }

    if (!borrowerEmail) {
      setError('Borrower email cannot be empty');
      return;
    }

    if (!borrowingDate) {
      setError('Borrowing date cannot be empty');
      return;
    }

    try {
      if (selectedBorrowing) {
        // Güncelleme işlemi
        await axios.put( import.meta.env.VITE_APP_BASE_URL + `/api/v1/borrows/${selectedBorrowing.id}`, { 
          borrowerName, 
          borrowerEmail, 
          borrowingDate, 
          returnDate 
        });
      } else {
        // Yeni ödünç alma kaydı ekleme işlemi
        await axios.post(import.meta.env.VITE_APP_BASE_URL + '/api/v1/borrows', { 
          borrowerName, 
          borrowerEmail, 
          borrowingDate, 
          returnDate 
        });
      }
      fetchBorrowings(); // Ödünç alma kayıtlarını tekrar çek
      handleClose(); // Dialog'u kapat
    } catch (error) {
      setError('Failed to save borrowing record');
    }
  };

  const handleDeleteBorrowing = async (id) => {
    try {
      await axios.delete( import.meta.env.VITE_APP_BASE_URL + `/api/v1/borrows/${id}`);
      fetchBorrowings(); // Ödünç alma kayıtlarını tekrar çek
    } catch (error) {
      setError('Failed to delete borrowing record');
    }
  };

  const handleOpen = (borrowing = null) => {
    setSelectedBorrowing(borrowing);
    setBorrowerName(borrowing ? borrowing.borrowerName : '');
    setBorrowerEmail(borrowing ? borrowing.borrowerEmail : '');
    setBorrowingDate(borrowing ? dayjs(borrowing.borrowingDate).format('YYYY-MM-DD') : '');
    setReturnDate(borrowing ? dayjs(borrowing.returnDate).format('YYYY-MM-DD') : '');
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedBorrowing(null);
    setBorrowerName('');
    setBorrowerEmail('');
    setBorrowingDate('');
    setReturnDate('');
    setOpen(false);
    setError('');
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
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(borrowings) && borrowings.map((borrowing) => (
                <TableRow key={borrowing.id}>
                  <TableCell>{borrowing.id}</TableCell>
                  <TableCell>{borrowing.borrowerName}</TableCell>
                  <TableCell>{borrowing.borrowerEmail}</TableCell>
                  <TableCell>{dayjs(borrowing.borrowingDate).format('YYYY-MM-DD')}</TableCell> {/* Tarih formatı */}
                  <TableCell>{dayjs(borrowing.returnDate).format('YYYY-MM-DD')}</TableCell> {/* Tarih formatı */}
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
            value={borrowerEmail}
            onChange={(e) => setBorrowerEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Borrowing Date"
            type="date" // Tarih formatı
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
            type="date" // Tarih formatı
            fullWidth
            InputLabelProps={{
              shrink: true, // Label'in düzgün şekilde yerleşmesi için
            }}
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
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
          <Button onClick={handleAddOrUpdateBorrowing} color="primary">
            {selectedBorrowing ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default BookBorrowing;
