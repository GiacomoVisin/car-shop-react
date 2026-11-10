import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function CarDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Controlla se l'utente è loggato (per mostrare i pulsanti di gestione)
    const token = localStorage.getItem('token');

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/cars/${id}`)
            .then(response => {
                let data = response.data.data ? response.data.data : response.data;

                // Se data è un array (es. [ {id: 8, ...} ]), prendiamo il primo elemento [0]
                if (Array.isArray(data)) {
                    data = data[0];
                }

                setCar(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Errore nel recupero del dettaglio auto:", err);
                setError("Impossibile caricare i dettagli del veicolo.");
                setLoading(false);
            });
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Sei sicuro di voler eliminare questa auto?")) return;

        try {
            await axios.delete(`http://127.0.0.1:8000/api/cars/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Auto eliminata con successo!");
            navigate('/');
        } catch (err) {
            console.error("Errore durante l'eliminazione:", err);
            alert("Errore durante l'eliminazione del veicolo.");
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px', color: '#e9ecef' }}>Caricamento dettagli...</div>;
    }

    if (error || !car) {
        return <div style={{ textAlign: 'center', marginTop: '50px', color: '#ff6b6b' }}><h2>{error || "Auto non trovata."}</h2></div>;
    }

    // Formatta l'immagine
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
        <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px', color: '#e9ecef' }}>
            <Link to="/" style={{ color: '#adb5bd', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>
                ← Torna al Catalogo
            </Link>

            <div style={{
                backgroundColor: '#2b3035',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #495057',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
            }}>
                {imageSrc ? (
                    <img src={imageSrc} alt={car.name} style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
                ) : (
                    <div style={{ height: '300px', backgroundColor: '#212529', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6c757d' }}>
                        Nessuna Immagine Disponibile
                    </div>
                )}

                <div style={{ padding: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h1 style={{ margin: 0, fontSize: '2rem', color: '#f8f9fa' }}>{car.name}</h1>
                        <span style={{
                            backgroundColor: '#5a6268', color: '#fff', fontSize: '0.9rem',
                            padding: '6px 14px', borderRadius: '6px', fontWeight: '600'
                        }}>
                            {car.brand ? car.brand.name : 'N/D'}
                        </span>
                    </div>

                    <div style={{ color: '#ffc107', fontWeight: 'bold', fontSize: '1.8rem', marginBottom: '25px' }}>
                        € {Number(car.price).toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px', borderTop: '1px solid #495057', borderBottom: '1px solid #495057', padding: '20px 0' }}>
                        <div>
                            <span style={{ color: '#868e96', display: 'block', fontSize: '0.85rem' }}>Tipologia</span>
                            <strong style={{ fontSize: '1.1rem' }}>{car.type ? car.type.name : 'N/D'}</strong>
                        </div>
                        <div>
                            <span style={{ color: '#868e96', display: 'block', fontSize: '0.85rem' }}>Chilometraggio</span>
                            <strong style={{ fontSize: '1.1rem' }}>{Number(car.km).toLocaleString('it-IT')} km</strong>
                        </div>
                        <div>
                            <span style={{ color: '#868e96', display: 'block', fontSize: '0.85rem' }}>Proprietario Assegnato</span>
                            <strong style={{ fontSize: '1.1rem' }}>{car.customer?.name || car.customer?.full_name || 'Nessuno'}</strong>
                        </div>
                    </div>

                    {/* Azioni riservate agli utenti autenticati */}
                    {token && (
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button
                                onClick={handleDelete}
                                style={{
                                    padding: '10px 20px', backgroundColor: '#dc3545', color: '#fff',
                                    border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer'
                                }}
                            >
                                Elimina Veicolo
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}