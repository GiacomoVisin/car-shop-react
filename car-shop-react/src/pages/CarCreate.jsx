import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CarCreate() {
  const [formData, setFormData] = useState({
    name: '',
    brand_id: '',
    type_id: '',
    km: '',
    price: '',
    registration_date: '',
    description: ''
  });

  // Stati per le liste dei menu a tendina e per il file immagine
  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Carichiamo brand e tipi all'avvio del componente
  useEffect(() => {
    const fetchSelectData = async () => {
      try {
        const [brandsRes, typesRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/brands'), // Assicurati di avere questo endpoint o adegualo
          axios.get('http://127.0.0.1:8000/api/types')  // Idem per le tipologie
        ]);
        setBrands(brandsRes.data.data || brandsRes.data);
        setTypes(typesRes.data.data || typesRes.data);
      } catch (err) {
        console.error("Errore nel caricamento di brand e tipologie:", err);
      }
    };
    fetchSelectData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('token');

    // Usiamo FormData per supportare l'invio del file binario
    const dataToSend = new FormData();
    dataToSend.append('name', formData.name);
    dataToSend.append('brand_id', formData.brand_id);
    dataToSend.append('type_id', formData.type_id);
    dataToSend.append('km', formData.km);
    dataToSend.append('price', formData.price);
    dataToSend.append('registration_date', formData.registration_date);
    
    if (formData.description) {
      dataToSend.append('description', formData.description);
    }

    // Se l'utente ha selezionato un file immagine, lo aggiungiamo
    if (imageFile) {
      dataToSend.append('image', imageFile);
    }

    try {
      await axios.post(
        'http://127.0.0.1:8000/api/cars',
        dataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      navigate('/'); // Torna al catalogo dopo il successo
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

        {/* Selezione Brand */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Marca:</label>
          <select
            name="brand_id"
            value={formData.brand_id}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #495057', background: '#212529', color: '#fff', boxSizing: 'border-box' }}
          >
            <option value="">Seleziona Marca</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
        </div>

        {/* Selezione Tipologia */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Tipologia:</label>
          <select
            name="type_id"
            value={formData.type_id}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #495057', background: '#212529', color: '#fff', boxSizing: 'border-box' }}
          >
            <option value="">Seleziona Tipologia</option>
            {types.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
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

        {/* Input File per l'immagine */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Immagine Auto:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #495057', background: '#212529', color: '#fff', boxSizing: 'border-box' }}
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