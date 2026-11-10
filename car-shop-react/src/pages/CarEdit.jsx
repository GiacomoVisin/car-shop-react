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
    img: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    // Carica i dati dell'auto esistente
    axios.get(`http://127.0.0.1:8000/api/cars/${id}`)
      .then(res => {
        let data = res.data.data ? res.data.data : res.data;
        if (Array.isArray(data)) data = data[0];

        setFormData({
          name: data.name || '',
          price: data.price || '',
          km: data.km || '',
          description: data.description || '',
          brand_id: data.brand_id || '',
          type_id: data.type_id || '',
          img: data.img || ''
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Errore recupero auto:", err);
        setError("Impossibile recuperare i dati del veicolo.");
        setLoading(false);
      });
  }, [id, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await axios.put(`http://127.0.0.1:8000/api/cars/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Auto aggiornata con successo!');
      navigate(`/cars/${id}`);
    } catch (err) {
      console.error("Errore aggiornamento:", err);
      setError(err.response?.data?.message || "Errore durante l'aggiornamento dell'auto.");
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
        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Nome Modello</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={labelStyle}>Prezzo (€)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Chilometraggio (km)</label>
            <input type="number" name="km" value={formData.km} onChange={handleChange} required style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={labelStyle}>ID Marca</label>
            <input type="number" name="brand_id" value={formData.brand_id} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>ID Tipologia</label>
            <input type="number" name="type_id" value={formData.type_id} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>URL o Percorso Immagine</label>
          <input type="text" name="img" value={formData.img} onChange={handleChange} style={inputStyle} />
        </div>

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