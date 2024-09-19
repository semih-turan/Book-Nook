import { Container, Typography } from '@mui/material';
import libraryImage from '../assets/library-hero.webp';

function Home() {
  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100vh', 
      overflow: 'hidden' 
    }}>
      {/* Arkaplan resim katmanı */}
      <div 
        style={{ 
          backgroundImage: `url(${libraryImage})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat', 
          opacity: 0.7, /* Sadece resmin opaklığını ayarlar */
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1 
        }} 
      />
      {/* Metin katmanı */}
      <Container style={{ 
        position: 'relative', 
        zIndex: 2, /* Metni resmin üzerine koyar */
        color: '#2C3639', 
        textAlign: 'center', 
        paddingTop: '200px' /* Metni ortalamak için padding ekledik */
      }}>
        <Typography variant="h2" gutterBottom>
          Welcome to Book Nook
        </Typography>
        <Typography variant="h6">
          Manage your books, authors, categories, and borrowing with ease.
        </Typography>
      </Container>
    </div>
  );
}

export default Home;
