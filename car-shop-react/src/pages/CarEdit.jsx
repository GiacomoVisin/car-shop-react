import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function CarEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    km: '',
    description: '',
    brand_id: '',
    type_id: '',
  });

  // Stati per tendine, immagine esistente e nuovo file
  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  const [currentImg, setCurrentImg] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Carichiamo contemporaneamente l'auto, i brand e i tipi
        const [carRes, brandsRes, typesRes] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/cars/${id}`),
          axios.get('http://127.0.0.1:8000/api/brands'),
          axios.get('http://127.0.0.1:8000/api/types')
        ]);

        let data = carRes.data.data ? carRes.data.data : carRes.data;
        if (Array.isArray(data)) data = data[0];

        setFormData({
          name: data.name || '',
          price: data.price || '',
          km: data.km || '',
          description: data.description || '',
          brand_id: data.brand_id || data.brand?.id || '',
          type_id: data.type_id || data.type?.id || '',
        });

        setCurrentImg(data.img || '');
        setBrands(brandsRes.data.data || brandsRes.data);
        setTypes(typesRes.data.data || typesRes.data);
      } catch (err) {
        console.error("Errore recupero dati:", err);
        setError("Impossibile recuperare i dati del veicolo o le categorie.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const dataToSend = new FormData();
    dataToSend.append('_method', 'PUT'); // Trick per far accettare a Laravel il multipart/form-data in aggiornamento
    dataToSend.append('name', formData.name);
    dataToSend.append('price', formData.price);
    dataToSend.append('km', formData.km);
    dataToSend.append('brand_id', formData.brand_id);
    dataToSend.append('type_id', formData.type_id);
    
    if (formData.description) {
      dataToSend.append('description', formData.description);
    }

    if (imageFile) {
      dataToSend.append('image', imageFile);
    }

    try {
      // Usiamo POST con _method='PUT' per il supporto corretto dei file in PHP/Laravel
      await axios.post(`http://127.0.0.1:8000/api/cars/${id}`, dataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      alert('Auto aggiornata con successo!');
      navigate(`/cars/${id}`);
    } catch (err) {
      console.error("Errore aggiornamento:", err);
      if (err.response?.data?.errors) {
        const messages = Object.values(err.response.data.errors).flat().join(' | ');
        setError(messages);
      } else {
        setError(err.response?.data?.message || "Errore durante l'aggiornamento dell'auto.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px', color: '#e9ecef' }}>Caricamento dati auto...</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', color: '#e9ecef' }}>
      <Link to={`/cars/${id}`} style={{ color: '#adb5bd', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>
        ← Torna al Dettaglio
      </Link>

      <h2 style={{ marginBottom: '20px' }}>✏️ Modifica Auto #{id}</h2>

      {error && (
        <div style={{ padding: '12px', backgroundColor: '#721c24', color: '#f8d7da', borderRadius: '6px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ backgroundColor: '#2b3035', padding: '25px', borderRadius: '12px', border: '1px solid #495057' }}>
        
        {/* Nome Modello */}
        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Nome Modello</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} />
        </div>

        {/* Prezzo e KM */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={labelStyle}>Prezzo (€)</label>
            <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Chilometraggio (km)</label>
            <input type="number" name="km" value={formData.km} onChange={handleChange} required style={inputStyle} />
          </div>
        </div>

        {/* Marca e Tipologia (Menu a tendina) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={labelStyle}>Marca</label>
            <select name="brand_id" value={formData.brand_id} onChange={handleChange} required style={inputStyle}>
              <option value="">Seleziona Marca</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Tipologia</label>
            <select name="type_id" value={formData.type_id} onChange={handleChange} required style={inputStyle}>
              <option value="">Seleziona Tipologia</option>
              {types.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Upload Nuova Immagine */}
        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Nuova Immagine (opzionale):</label>
          <input type="file" accept="image/*" onChange={handleFileChange} style={inputStyle} />
          {currentImg && !imageFile && (
            <small style={{ color: '#6c757d', display: 'block', marginTop: '4px' }}>
              Immagine attuale salvata: <code>{currentImg}</code>
            </small>
          )}
        </div>

        {/* Descrizione */}
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Descrizione</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="4" style={{ ...inputStyle, resize: 'vertical' }}></textarea>
        </div>

        <button type="submit" disabled={saving} style={{ width: '100%', padding: '12px', backgroundColor: '#ffc107', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          {saving ? 'Aggiornamento in corso...' : 'Aggiorna Auto'}
        </button>
      </form>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '0.85rem', color: '#adb5bd', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '10px 12px', backgroundColor: '#1e2225', border: '1px solid #495057', borderRadius: '6px', color: '#e9ecef', fontSize: '0.9rem', boxSizing: 'border-box' };