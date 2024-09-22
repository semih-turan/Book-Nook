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

function Categories() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        import.meta.env.VITE_APP_BASE_URL + "/api/v1/categories"
      );
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      setError("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateCategory = async () => {
    if (!name) {
      setError("Category name cannot be empty");
      return;
    }

    try {
      if (selectedCategory) {
        // Güncelleme işlemi
        await axios.put(
          import.meta.env.VITE_APP_BASE_URL +
            `/api/v1/categories/${selectedCategory.id}`,
          {
            name: name || selectedCategory.name, // Eğer name boşsa eski ismi gönder
            description,
          }
        );
      } else {
        // Yeni kategori ekleme işlemi
        await axios.post(
          import.meta.env.VITE_APP_BASE_URL + "/api/v1/categories",
          {
            name,
            description,
          }
        );
      }
      fetchCategories(); // Kategorileri tekrar çek
      handleClose(); // Dialog'u kapat
    } catch (error) {
      setError("Failed to save category");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(
        import.meta.env.VITE_APP_BASE_URL + `/api/v1/categories/${id}`
      );
      fetchCategories(); // Kategorileri tekrar çek
    } catch (error) {
      setError("Failed to delete category");
    }
  };

  const handleOpen = (category = null) => {
    setSelectedCategory(category);
    setName(category ? category.name : "");
    setDescription(category ? category.description : "");
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedCategory(null);
    setName("");
    setDescription("");
    setOpen(false);
    setError("");
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Categories
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add New Category
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
                <TableCell>Description</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(categories) &&
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.id}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell align="right">
                      <Button
                        color="primary"
                        onClick={() => handleOpen(category)}
                        style={{ marginRight: "10px" }}
                      >
                        Edit
                      </Button>
                      <Button
                        color="secondary"
                        onClick={() => handleDeleteCategory(category.id)}
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

      {/* Dialog for Add/Edit Category */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedCategory ? "Edit Category" : "Add New Category"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
          <Button onClick={handleAddOrUpdateCategory} color="primary">
            {selectedCategory ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Categories;
