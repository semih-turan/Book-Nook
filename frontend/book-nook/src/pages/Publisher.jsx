import { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import axios from 'axios';

function Publisher() {
  const [publishers, setPublishers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [name, setName] = useState('');
  const [establishmentYear, setEstablishmentYear] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Yayıncıları API'den çekmek için useEffect kullanımı
  useEffect(() => {
    fetchPublishers();
  }, []);

  const fetchPublishers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(import.meta.env.VITE_APP_BASE_URL + '/api/v1/publishers');
      if (Array.isArray(response.data)) {
        setPublishers(response.data);
      } else {
        setPublishers([]);
      }
    } catch (error) {
      setError('Failed to fetch publishers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdatePublisher = async () => {
    try {
      if (selectedPublisher) {
        // Güncelleme işlemi
        await axios.put(import.meta.env.VITE_APP_BASE_URL + `/api/v1/publishers/${selectedPublisher.id}`, { 
          name, 
          establishmentYear: parseInt(establishmentYear, 10), 
          address 
        });
      } else {
        // Yeni yayıncı ekleme işlemi
        await axios.post(import.meta.env.VITE_APP_BASE_URL + '/api/v1/publishers', { 
          name, 
          establishmentYear: parseInt(establishmentYear, 10), 
          address 
        });
      }
      fetchPublishers(); // Yayıncıları tekrar çek
      handleClose(); // Dialog'u kapat
    } catch (error) {
      setError('Failed to save publisher');
    }
  };

  const handleDeletePublisher = async (id) => {
    try {
      await axios.delete(import.meta.env.VITE_APP_BASE_URL + `/api/v1/publishers/${id}`);
      fetchPublishers(); // Yayıncıları tekrar çek
    } catch (error) {
      setError('Failed to delete publisher');
    }
  };

  const handleOpen = (publisher = null) => {
    setSelectedPublisher(publisher);
    setName(publisher ? publisher.name : '');
    setEstablishmentYear(publisher ? publisher.establishmentYear : '');
    setAddress(publisher ? publisher.address : '');
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedPublisher(null);
    setName('');
    setEstablishmentYear('');
    setAddress('');
    setOpen(false);
    setError('');
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Publishers
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add New Publisher
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
                <TableCell>Establishment Year</TableCell>
                <TableCell>Address</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(publishers) && publishers.map((publisher) => (
                <TableRow key={publisher.id}>
                  <TableCell>{publisher.id}</TableCell>
                  <TableCell>{publisher.name}</TableCell>
                  <TableCell>{publisher.establishmentYear}</TableCell>
                  <TableCell>{publisher.address}</TableCell>
                  <TableCell align="right">
                    <Button 
                      color="primary" 
                      onClick={() => handleOpen(publisher)}
                      style={{ marginRight: '10px' }}
                    >
                      Edit
                    </Button>
                    <Button 
                      color="secondary" 
                      onClick={() => handleDeletePublisher(publisher.id)}
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

      {/* Dialog for Add/Edit Publisher */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedPublisher ? 'Edit Publisher' : 'Add New Publisher'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Publisher Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Establishment Year"
            type="number"
            fullWidth
            value={establishmentYear}
            onChange={(e) => setEstablishmentYear(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Address"
            type="text"
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
          <Button onClick={handleAddOrUpdatePublisher} color="primary">
            {selectedPublisher ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Publisher;
