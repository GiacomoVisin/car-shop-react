import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Recupera i dati dall'API Laravel al caricamento del componente
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/cars')
      .then(response => {
        // Se la risposta è wrappata in 'data'
        const data = response.data.data ? response.data.data : response.data;
        setCars(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Errore durante il recupero dei dati:", err);
        setError("Impossibile caricare il catalogo auto.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', color: '#fff' }}>
        <h2>Caricamento auto in corso...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', color: '#ff6b6b' }}>
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundColor: '#1a1c1e', 
      minHeight: '100vh', 
      color: '#fff', 
      padding: '30px', 
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' 
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px', color: '#f8f9fa' }}>
        🚗 Catalogo Auto (React + Laravel)
      </h1>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '24px', 
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        {cars.map((car) => {
          // Ricostruiamo l'URL completo dell'immagine se presente
          let imageSrc = null;
          if (car.img) {
            if (car.img.startsWith('http://') || car.img.startsWith('https://')) {
              imageSrc = car.img;
            } else if (car.img.startsWith('images/')) {
              imageSrc = `http://127.0.0.1:8000/${car.img}`;
            } else {
              imageSrc = `http://127.0.0.1:8000/storage/${car.img}`;
            }
          }

          return (
            <div key={car.id} style={{ 
              background: 'linear-gradient(135deg, #5a6268, #343a40)', 
              borderRadius: '12px', 
              overflow: 'hidden', 
              boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {imageSrc ? (
                <img 
                  src={imageSrc} 
                  alt={car.name} 
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }} 
                />
              ) : (
                <div style={{ 
                  height: '180px', 
                  backgroundColor: '#2b2d2f', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: '#6c757d' 
                }}>
                  Nessuna Immagine
                </div>
              )}

              <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{car.name}</h3>
                    <span style={{ 
                      backgroundColor: '#6c757d', 
                      fontSize: '0.75rem', 
                      padding: '4px 8px', 
                      borderRadius: '4px' 
                    }}>
                      {car.brand ? car.brand.name : 'Brand N/D'}
                    </span>
                  </div>

                  <p style={{ color: '#ffc107', fontWeight: 'bold', fontSize: '1.2rem', margin: '10px 0' }}>
                    € {Number(car.price).toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                  </p>

                  <div style={{ fontSize: '0.9rem', color: '#ced4da' }}>
                    <p style={{ margin: '4px 0' }}><strong>Tipologia:</strong> {car.type ? car.type.name : 'N/D'}</p>
                    <p style={{ margin: '4px 0' }}><strong>Km:</strong> {Number(car.km).toLocaleString('it-IT')}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;