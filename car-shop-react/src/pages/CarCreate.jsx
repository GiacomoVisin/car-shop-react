import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CarCreate() {
  const [formData, setFormData] = useState({
    name: '',
    km: '',
    price: '',
    registration_date: '',
    description: '',
    img: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('token');

    try {
      await axios.post(
        'http://127.0.0.1:8000/api/cars',
        {
          name: formData.name,
          km: parseInt(formData.km, 10),
          price: parseFloat(formData.price),
          registration_date: formData.registration_date,
          description: formData.description || null,
          img: formData.img || null
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      navigate('/'); // torna al catalogo
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        const messages = Object.values(err.response.data.errors).flat().join(' | ');
        setError(messages);
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Errore durante il salvataggio.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', background: '#1e2225', color: '#fff', borderRadius: '8px' }}>
      <h2>Aggiungi Nuova Auto</h2>

      {error && (
        <div style={{ color: '#ff6b6b', marginBottom: '15px', padding: '10px', background: 'rgba(255,107,107,0.1)', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Nome Auto:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Es. Golf 1.6 TDI"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #495057', background: '#212529', color: '#fff', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Chilometri (KM):</label>
          <input
            type="number"
            name="km"
            value={formData.km}
            onChange={handleChange}
            required
            placeholder="Es. 118000"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #495057', background: '#212529', color: '#fff', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Prezzo (€):</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            placeholder="Es. 9750"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #495057', background: '#212529', color: '#fff', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Data Immatricolazione:</label>
          <input
            type="date"
            name="registration_date"
            value={formData.registration_date}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #495057', background: '#212529', color: '#fff', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Descrizione (Opzionale):</label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Es. Perfetta per la città..."
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #495057', background: '#212529', color: '#fff', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Immagine (Percorso / URL opzionale):</label>
          <input
            type="text"
            name="img"
            value={formData.img}
            onChange={handleChange}
            placeholder="Es. images/cars/volkswagen-golf.jpg"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #495057', background: '#212529', color: '#fff', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '10px', background: loading ? '#6c757d' : '#228be6', color: '#fff', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
        >
          {loading ? 'Salvataggio in corso...' : 'Salva Auto'}
        </button>
      </form>
    </div>
  );
}