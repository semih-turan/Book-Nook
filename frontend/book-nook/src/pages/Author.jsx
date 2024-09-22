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
import dayjs from "dayjs"; // Tarih formatlamak için dayjs kullanımı

function Author() {
  const [authors, setAuthors] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        import.meta.env.VITE_APP_BASE_URL + "/api/v1/authors"
      );
      if (Array.isArray(response.data)) {
        setAuthors(response.data);
      } else {
        setAuthors([]);
      }
    } catch (error) {
      setError("Failed to fetch authors");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateAuthor = async () => {
    try {
      if (selectedAuthor) {
        // Güncelleme işlemi
        await axios.put(
          import.meta.env.VITE_APP_BASE_URL +
            `/api/v1/authors/${selectedAuthor.id}`,
          {
            name,
            birthDate,
            country,
          }
        );
      } else {
        // Yeni yazar ekleme işlemi
        await axios.post(
          import.meta.env.VITE_APP_BASE_URL + "/api/v1/authors",
          {
            name,
            birthDate,
            country,
          }
        );
      }
      fetchAuthors(); // Yazarları tekrar çek
      handleClose(); // Dialog'u kapat
    } catch (error) {
      setError("Failed to save author");
    }
  };

  const handleDeleteAuthor = async (id) => {
    try {
      await axios.delete(
        import.meta.env.VITE_APP_BASE_URL + `/api/v1/authors/${id}`
      );
      fetchAuthors(); // Yazarları tekrar çek
    } catch (error) {
      setError("Failed to delete author");
    }
  };

  const handleOpen = (author = null) => {
    setSelectedAuthor(author);
    setName(author ? author.name : "");
    setBirthDate(author ? dayjs(author.birthDate).format("YYYY-MM-DD") : ""); // Tarihi uygun formatta göster
    setCountry(author ? author.country : "");
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedAuthor(null);
    setName("");
    setBirthDate("");
    setCountry("");
    setOpen(false);
    setError("");
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Authors
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add New Author
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
                <TableCell>Birth Date</TableCell>
                <TableCell>Country</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(authors) &&
                authors.map((author) => (
                  <TableRow key={author.id}>
                    <TableCell>{author.id}</TableCell>
                    <TableCell>{author.name}</TableCell>
                    <TableCell>
                      {dayjs(author.birthDate).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell>{author.country}</TableCell>
                    <TableCell align="right">
                      <Button
                        color="primary"
                        onClick={() => handleOpen(author)}
                        style={{ marginRight: "10px" }}
                      >
                        Edit
                      </Button>
                      <Button
                        color="secondary"
                        onClick={() => handleDeleteAuthor(author.id)}
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

      {/* Dialog for Add/Edit Author */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedAuthor ? "Edit Author" : "Add New Author"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Author Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Birth Date"
            type="date" // Tarih formatı
            fullWidth
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Country"
            type="text"
            fullWidth
            value={country}
            onChange={(e) => setCountry(e.target.value)}
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
          <Button onClick={handleAddOrUpdateAuthor} color="primary">
            {selectedAuthor ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Author;
