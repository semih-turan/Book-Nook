import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <Router>
      <AppBar position="fixed" style={{ backgroundColor: '#DCD7C9' }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, color: '#2C3639' }}> {/* Metin rengi değiştirildi */}
            Book Nook
          </Typography>
          <Button style={{ color: '#2C3639' }} component={Link} to="/">Home</Button> {/* Buton metin rengi */}
          <Button style={{ color: '#2C3639' }} component={Link} to="/publishers">Publishers</Button>
          <Button style={{ color: '#2C3639' }} component={Link} to="/categories">Categories</Button>
          <Button style={{ color: '#2C3639' }} component={Link} to="/books">Books</Button>
          <Button style={{ color: '#2C3639' }} component={Link} to="/authors">Authors</Button>
          <Button style={{ color: '#2C3639' }} component={Link} to="/borrowings">Borrowing</Button>
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: '100px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Diğer rotaları buraya ekleyin */}
        </Routes>
      </Container>
      <footer className="footer">
        <Container>
          <Typography variant="body2" align="center" color="textSecondary">
            &copy; {new Date().getFullYear()} Library Management System. All rights reserved.
          </Typography>
          <div className="footer-links">
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </Container>
      </footer>
    </Router>
  );
}

export default App;
