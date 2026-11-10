import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Chiamata API a Laravel per il login
            const response = await axios.post('http://127.0.0.1:8000/api/login', {
                email,
                password
            });

            if (response.data.success) {
                // Salviamo il token e i dati utente
                localStorage.setItem('token', response.data.token);
                onLoginSuccess(response.data.user);
                navigate('/'); // Reindirizza al catalogo
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Credenziali non valide o errore di connessione.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh',
            color: '#fff'
        }}>
            <form onSubmit={handleLogin} style={{
                backgroundColor: '#2b3035',
                padding: '30px',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '400px',
                boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
                border: '1px solid #495057'
            }}>
                <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Accedi</h2>

                {error && (
                    <div style={{ backgroundColor: '#dc3545', color: '#fff', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#adb5bd' }}>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#adb5bd' }}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#ffc107',
                        color: '#212529',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    {loading ? 'Accesso in corso...' : 'Login'}
                </button>
            </form>
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