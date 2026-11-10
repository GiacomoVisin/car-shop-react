import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

export default function catalog() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Stati per i filtri e la ricerca
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    // Caricamento dati da Laravel
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/cars')
            .then(response => {
                const data = response.data.data ? response.data.data : response.data;
                setCars(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Errore durante il recupero delle auto:", err);
                setError("Impossibile caricare il catalogo auto da Laravel.");
                setLoading(false);
            });
    }, []);

    // Estrazione dinamica dei Brand unici
    const brandsList = useMemo(() => {
        const list = cars
            .map(c => c.brand?.name)
            .filter((v, i, a) => v && a.indexOf(v) === i);
        return list.sort();
    }, [cars]);

    // Estrazione dinamica delle Tipologie uniche
    const typesList = useMemo(() => {
        const list = cars
            .map(c => c.type?.name)
            .filter((v, i, a) => v && a.indexOf(v) === i);
        return list.sort();
    }, [cars]);

    // Filtraggio e ordinamento
    const filteredCars = useMemo(() => {
        return cars.filter(car => {
            const matchSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (car.brand?.name && car.brand.name.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchBrand = selectedBrand === '' || car.brand?.name === selectedBrand;
            const matchType = selectedType === '' || car.type?.name === selectedType;

            return matchSearch && matchBrand && matchType;
        }).sort((a, b) => {
            if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
            if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
            if (sortBy === 'km-asc') return Number(a.km) - Number(b.km);
            return b.id - a.id;
        });
    }, [cars, searchQuery, selectedBrand, selectedType, sortBy]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', color: '#e9ecef' }}>
                <h2>Caricamento catalogo in corso...</h2>
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
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>

            {/* Header */}
            <header style={{ textAlign: 'center', marginBottom: '35px', borderBottom: '1px solid #343a40', paddingBottom: '20px' }}>
                <h1 style={{ fontSize: '2.4rem', margin: '0 0 10px 0', color: '#f8f9fa' }}>
                    🏎️ Catalogo Auto Usate
                </h1>
                <p style={{ color: '#6c757d', margin: 0 }}>Gestione Parco Auto — React Frontend + Laravel REST API</p>
            </header>

            {/* Toolbar Filtri */}
            <div style={{
                backgroundColor: '#2b3035', padding: '20px', borderRadius: '12px',
                boxShadow: '0 6px 12px rgba(0,0,0,0.3)', marginBottom: '30px',
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px'
            }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#adb5bd', marginBottom: '6px' }}>Cerca</label>
                    <input
                        type="text" placeholder="Es. Audi, Golf..." value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)} style={inputStyle}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#adb5bd', marginBottom: '6px' }}>Marca</label>
                    <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)} style={inputStyle}>
                        <option value="">Tutti i Brand</option>
                        {brandsList.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#adb5bd', marginBottom: '6px' }}>Tipologia</label>
                    <select value={selectedType} onChange={e => setSelectedType(e.target.value)} style={inputStyle}>
                        <option value="">Tutte le Tipologie</option>
                        {typesList.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#adb5bd', marginBottom: '6px' }}>Ordina per</label>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={inputStyle}>
                        <option value="newest">Più recenti</option>
                        <option value="price-asc">Prezzo: dal più basso</option>
                        <option value="price-desc">Prezzo: dal più alto</option>
                        <option value="km-asc">Chilometraggio minore</option>
                    </select>
                </div>
            </div>

            <div style={{ marginBottom: '20px', color: '#6c757d', fontSize: '0.95rem' }}>
                Trovate <strong>{filteredCars.length}</strong> auto su {cars.length} disponibili
            </div>

            {/* Griglia Auto */}
            {filteredCars.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px 0', color: '#6c757d' }}>
                    <h3>Nessun veicolo corrisponde ai filtri selezionati.</h3>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '24px' }}>
                    {filteredCars.map(car => {
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
                                background: 'linear-gradient(145deg, #343a40, #2b3035)',
                                borderRadius: '12px', overflow: 'hidden', border: '1px solid #495057',
                                boxShadow: '0 8px 18px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column'
                            }}>
                                <div style={{ position: 'relative' }}>
                                    {imageSrc ? (
                                        <img src={imageSrc} alt={car.name} style={{ width: '100%', height: '190px', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ height: '190px', backgroundColor: '#212529', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6c757d' }}>
                                            Nessuna Immagine
                                        </div>
                                    )}
                                    <span style={{
                                        position: 'absolute', top: '12px', right: '12px',
                                        backgroundColor: 'rgba(90, 98, 104, 0.85)', color: '#fff',
                                        fontSize: '0.75rem', fontWeight: '600', padding: '4px 10px', borderRadius: '6px'
                                    }}>
                                        {car.brand ? car.brand.name : 'N/D'}
                                    </span>
                                </div>

                                <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: '#f8f9fa' }}>{car.name}</h3>
                                        <div style={{ color: '#ffc107', fontWeight: 'bold', fontSize: '1.3rem', marginBottom: '15px' }}>
                                            € {Number(car.price).toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#ced4da', borderTop: '1px solid #495057', paddingTop: '12px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                <span style={{ color: '#868e96' }}>Tipologia:</span>
                                                <strong>{car.type ? car.type.name : 'N/D'}</strong>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#868e96' }}>Chilometraggio:</span>
                                                <strong>{Number(car.km).toLocaleString('it-IT')} km</strong>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => alert(`Dettaglio auto ID: ${car.id}`)}
                                        style={{
                                            marginTop: '18px', width: '100%', padding: '10px',
                                            backgroundColor: '#5a6268', color: '#fff', border: 'none',
                                            borderRadius: '6px', fontWeight: '600', cursor: 'pointer'
                                        }}
                                    >
                                        Vedi Dettaglio
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: '#1e2225',
    border: '1px solid #495057',
    borderRadius: '6px',
    color: '#e9ecef',
    fontSize: '0.9rem',
    boxSizing: 'border-box'
};